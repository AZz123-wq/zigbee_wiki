import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { ApiKeyValidationError, validateDeepSeekApiKey } from './llmClient.js';
import { accessUserStore, type AccessRole, type AccessUser } from './dataStore.js';

const scryptAsync = promisify(scrypt);

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(MODULE_DIR, '..', '..', '..');
const ENV_FILE = path.join(ROOT_DIR, '.env.local');
const COOKIE_NAME = 'my_wiki_session';
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
const SESSION_VERSION = 'v1';
const SCRYPT_KEY_LENGTH = 64;
const ACCESS_PASSWORD_BYTES = 18;
const SECRET_BYTES = 32;
const ADMIN_USER_ID = 'admin';

type SessionPayload = {
  user_id: string;
  role: AccessRole;
  iat: number;
  exp: number;
};

export interface AuthenticatedUser {
  id: string;
  role: AccessRole;
  api_key: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

function parseEnvValue(raw: string) {
  const trimmed = raw.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).replace(/\\(["\\$`])/g, '$1');
  }
  return trimmed;
}

function loadLocalEnv() {
  if (!fs.existsSync(ENV_FILE)) return;
  const content = fs.readFileSync(ENV_FILE, 'utf-8');
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    process.env[match[1]] = parseEnvValue(match[2]);
  }
}

loadLocalEnv();

function isAuthEnabled() {
  return process.env.APP_AUTH_ENABLED === '1' || process.env.APP_AUTH_ENABLED === 'true';
}

function requiredConfigMissing() {
  if (!process.env.SESSION_SECRET) return 'SESSION_SECRET is not configured';
  return null;
}

function envFileHasValue(key: string) {
  if (!fs.existsSync(ENV_FILE)) return false;
  const content = fs.readFileSync(ENV_FILE, 'utf-8');
  return new RegExp(`^${key}=`, 'm').test(content);
}

function legacyPasswordHash() {
  return process.env.APP_ACCESS_PASSWORD_HASH || '';
}

function ensureAccessUsers(): AccessUser[] {
  const data = accessUserStore.read();
  const users = Array.isArray(data.users) ? data.users : [];
  const hasAdmin = users.some((user) => user.id === ADMIN_USER_ID && user.role === 'admin');
  const legacyHash = legacyPasswordHash();

  if (hasAdmin || !legacyHash) return users;

  const now = new Date().toISOString();
  const adminUser: AccessUser = {
    id: ADMIN_USER_ID,
    role: 'admin',
    password_hash: legacyHash,
    api_key: process.env.DEEPSEEK_API_KEY || '',
    created_at: now,
    updated_at: now,
  };
  const nextUsers = [adminUser, ...users];
  accessUserStore.write({ users: nextUsers });
  return nextUsers;
}

function hasExistingAccessPassword() {
  return ensureAccessUsers().length > 0 || Boolean(envFileHasValue('APP_ACCESS_PASSWORD_HASH'));
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return header.split(';').reduce<Record<string, string>>((cookies, part) => {
    const [rawName, ...rawValue] = part.trim().split('=');
    if (!rawName || rawValue.length === 0) return cookies;
    cookies[rawName] = decodeURIComponent(rawValue.join('='));
    return cookies;
  }, {});
}

function sign(value: string) {
  return createHmac('sha256', process.env.SESSION_SECRET || '')
    .update(value)
    .digest('base64url');
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function createSessionCookie(user: AuthenticatedUser) {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    user_id: user.id,
    role: user.role,
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const unsigned = `${SESSION_VERSION}.${encodedPayload}`;
  return `${unsigned}.${sign(unsigned)}`;
}

function verifySessionCookie(req: Request): AuthenticatedUser | null {
  const cookie = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!cookie) return null;

  const parts = cookie.split('.');
  if (parts.length !== 3 || parts[0] !== SESSION_VERSION) return null;

  const unsigned = `${parts[0]}.${parts[1]}`;
  if (!safeEqual(sign(unsigned), parts[2])) return null;

  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8')) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (!Number.isFinite(payload.exp) || payload.exp <= now || !payload.user_id) return null;

    const user = ensureAccessUsers().find((item) => item.id === payload.user_id);
    if (!user) return null;
    return {
      id: user.id,
      role: user.role,
      api_key: user.api_key || '',
    };
  } catch {
    return null;
  }
}

function setSessionCookie(res: Response, user: AuthenticatedUser) {
  const cookie = createSessionCookie(user);
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(cookie)}; Max-Age=${SESSION_MAX_AGE_SECONDS}; Path=/; HttpOnly; SameSite=Lax`
  );
}

function clearSessionCookie(res: Response) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`
  );
}

async function verifyPasswordHash(password: string, configuredHash: string) {
  const parts = configuredHash.split(':');
  if (parts.length !== 3 || parts[0] !== 'scrypt') {
    throw new Error('Password hash must use format scrypt:<salt_b64url>:<hash_b64url>');
  }

  const salt = Buffer.from(parts[1], 'base64url');
  const expected = Buffer.from(parts[2], 'base64url');
  const derived = (await scryptAsync(password, salt, expected.length || SCRYPT_KEY_LENGTH)) as Buffer;

  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

async function findUserByPassword(password: string): Promise<AuthenticatedUser | null> {
  const users = ensureAccessUsers();
  for (const user of users) {
    if (!user.password_hash) continue;
    if (await verifyPasswordHash(password, user.password_hash)) {
      return {
        id: user.id,
        role: user.role,
        api_key: user.api_key || '',
      };
    }
  }
  return null;
}

async function createPasswordHash(password: string) {
  const salt = randomBytes(16);
  const derived = (await scryptAsync(password, salt, SCRYPT_KEY_LENGTH)) as Buffer;
  return `scrypt:${salt.toString('base64url')}:${derived.toString('base64url')}`;
}

function createAccessPassword() {
  return randomBytes(ACCESS_PASSWORD_BYTES).toString('base64url');
}

function createSecret() {
  return randomBytes(SECRET_BYTES).toString('base64url');
}

function quoteEnvValue(value: string) {
  return `"${value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\$/g, '\\$')
    .replace(/`/g, '\\`')
    .replace(/\n/g, '')}"`;
}

function writeEnvValues(values: Record<string, string>) {
  const existing = fs.existsSync(ENV_FILE)
    ? fs.readFileSync(ENV_FILE, 'utf-8').trimEnd().split(/\r?\n/)
    : [];
  const seen = new Set<string>();
  const keys = new Set(Object.keys(values));
  const next = existing.map((line) => {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=/);
    if (!match || !keys.has(match[1])) return line;
    seen.add(match[1]);
    return `${match[1]}=${quoteEnvValue(values[match[1]])}`;
  });

  for (const [key, value] of Object.entries(values)) {
    if (!seen.has(key)) next.push(`${key}=${quoteEnvValue(value)}`);
  }

  fs.writeFileSync(ENV_FILE, `${next.join('\n')}\n`, { mode: 0o600 });
  fs.chmodSync(ENV_FILE, 0o600);
}

function registerStatusForError(err: unknown) {
  if (!(err instanceof ApiKeyValidationError)) return 500;
  if (err.kind === 'unauthorized') return 401;
  if (err.kind === 'timeout' || err.kind === 'network') return 502;
  if (err.kind === 'api' || err.kind === 'invalid_response') return 502;
  return 500;
}

export function authStatus(req: Request) {
  if (!hasExistingAccessPassword()) return false;
  if (!isAuthEnabled()) return true;
  if (requiredConfigMissing()) return false;
  return Boolean(verifySessionCookie(req));
}

export function currentUser(req: Request): AuthenticatedUser | null {
  if (!isAuthEnabled()) {
    return {
      id: ADMIN_USER_ID,
      role: 'admin',
      api_key: process.env.DEEPSEEK_API_KEY || '',
    };
  }
  return verifySessionCookie(req);
}

export const authRouter = {
  status: ((req: Request, res: Response) => {
    const user = currentUser(req);
    res.json({
      authenticated: Boolean(user),
      registration_available: true,
      user_id: user?.id,
      role: user?.role,
    });
  }) as RequestHandler,

  login: (async (req: Request, res: Response) => {
    if (!hasExistingAccessPassword()) {
      return res.status(409).json({ error: '请先注册访问口令' });
    }

    if (!isAuthEnabled()) {
      return res.json({ authenticated: true, user_id: ADMIN_USER_ID, role: 'admin' });
    }

    const configError = requiredConfigMissing();
    if (configError) {
      return res.status(500).json({ error: configError });
    }

    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    try {
      const user = await findUserByPassword(password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid access password' });
      }

      setSessionCookie(res, user);
      return res.json({ authenticated: true, user_id: user.id, role: user.role });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Password verification failed' });
    }
  }) as RequestHandler,

  register: (async (req: Request, res: Response) => {
    const apiKey = typeof req.body?.apiKey === 'string' ? req.body.apiKey.trim() : '';
    if (!apiKey) {
      return res.status(400).json({ error: 'DeepSeek API Key 不能为空' });
    }

    try {
      await validateDeepSeekApiKey(apiKey);
      const password = createAccessPassword();
      const passwordHash = await createPasswordHash(password);
      const sessionSecret = process.env.SESSION_SECRET || createSecret();
      const values = {
        APP_AUTH_ENABLED: 'true',
        SESSION_SECRET: sessionSecret,
      };

      writeEnvValues(values);
      Object.assign(process.env, values);

      const now = new Date().toISOString();
      accessUserStore.update((data) => {
        data.users.push({
          id: `user_${randomBytes(9).toString('base64url')}`,
          role: 'user',
          password_hash: passwordHash,
          api_key: apiKey,
          created_at: now,
          updated_at: now,
        });
        return data;
      });

      return res.status(201).json({ password, role: 'user' });
    } catch (err: any) {
      const status = registerStatusForError(err);
      return res.status(status).json({ error: err.message || '注册失败，请检查 DeepSeek API Key' });
    }
  }) as RequestHandler,

  logout: ((_req: Request, res: Response) => {
    clearSessionCookie(res);
    res.json({ authenticated: false });
  }) as RequestHandler,
};

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!hasExistingAccessPassword()) {
    return res.status(401).json({ error: 'Registration required' });
  }

  if (!isAuthEnabled()) {
    req.user = {
      id: ADMIN_USER_ID,
      role: 'admin',
      api_key: process.env.DEEPSEEK_API_KEY || '',
    };
    return next();
  }

  const configError = requiredConfigMissing();
  if (configError) {
    return res.status(500).json({ error: configError });
  }

  const user = verifySessionCookie(req);
  if (user) {
    req.user = user;
    return next();
  }
  return res.status(401).json({ error: 'Authentication required' });
}

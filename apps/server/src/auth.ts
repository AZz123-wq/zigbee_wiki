import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { createHmac, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

const COOKIE_NAME = 'my_wiki_session';
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
const SESSION_VERSION = 'v1';
const SCRYPT_KEY_LENGTH = 64;

type SessionPayload = {
  iat: number;
  exp: number;
};

function isAuthEnabled() {
  return process.env.APP_AUTH_ENABLED === '1' || process.env.APP_AUTH_ENABLED === 'true';
}

function requiredConfigMissing() {
  if (!process.env.APP_ACCESS_PASSWORD_HASH) return 'APP_ACCESS_PASSWORD_HASH is not configured';
  if (!process.env.SESSION_SECRET) return 'SESSION_SECRET is not configured';
  return null;
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

function createSessionCookie() {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const unsigned = `${SESSION_VERSION}.${encodedPayload}`;
  return `${unsigned}.${sign(unsigned)}`;
}

function verifySessionCookie(req: Request) {
  const cookie = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!cookie) return false;

  const parts = cookie.split('.');
  if (parts.length !== 3 || parts[0] !== SESSION_VERSION) return false;

  const unsigned = `${parts[0]}.${parts[1]}`;
  if (!safeEqual(sign(unsigned), parts[2])) return false;

  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8')) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    return Number.isFinite(payload.exp) && payload.exp > now;
  } catch {
    return false;
  }
}

function setSessionCookie(res: Response) {
  const cookie = createSessionCookie();
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

async function verifyPassword(password: string) {
  const configuredHash = process.env.APP_ACCESS_PASSWORD_HASH || '';
  const parts = configuredHash.split(':');
  if (parts.length !== 3 || parts[0] !== 'scrypt') {
    throw new Error('APP_ACCESS_PASSWORD_HASH must use format scrypt:<salt_b64url>:<hash_b64url>');
  }

  const salt = Buffer.from(parts[1], 'base64url');
  const expected = Buffer.from(parts[2], 'base64url');
  const derived = (await scryptAsync(password, salt, expected.length || SCRYPT_KEY_LENGTH)) as Buffer;

  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

export function authStatus(req: Request) {
  if (!isAuthEnabled()) return true;
  if (requiredConfigMissing()) return false;
  return verifySessionCookie(req);
}

export const authRouter = {
  status: ((req: Request, res: Response) => {
    res.json({ authenticated: authStatus(req) });
  }) as RequestHandler,

  login: (async (req: Request, res: Response) => {
    if (!isAuthEnabled()) {
      return res.json({ authenticated: true });
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
      if (!(await verifyPassword(password))) {
        return res.status(401).json({ error: 'Invalid access password' });
      }
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Password verification failed' });
    }

    setSessionCookie(res);
    return res.json({ authenticated: true });
  }) as RequestHandler,

  logout: ((_req: Request, res: Response) => {
    clearSessionCookie(res);
    res.json({ authenticated: false });
  }) as RequestHandler,
};

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!isAuthEnabled()) return next();

  const configError = requiredConfigMissing();
  if (configError) {
    return res.status(500).json({ error: configError });
  }

  if (verifySessionCookie(req)) return next();
  return res.status(401).json({ error: 'Authentication required' });
}

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.workbench"
LOG_DIR="$RUN_DIR/logs"
ENV_FILE="$ROOT_DIR/.env.local"
RUNTIME_FILE="$RUN_DIR/runtime.env"
SERVER_PID="$RUN_DIR/server.pid"
FRONTEND_PID="$RUN_DIR/frontend.pid"
SERVER_PORT="${SERVER_PORT:-3001}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"
VITE_API_TARGET="${VITE_API_TARGET:-}"

mkdir -p "$RUN_DIR" "$LOG_DIR"

usage() {
  cat <<'EOF'
Usage:
  scripts/workbench.sh start [--api-key KEY] [--env-file FILE] [--server-port N] [--frontend-port N]
  scripts/workbench.sh stop
  scripts/workbench.sh restart [options]
  scripts/workbench.sh status
  scripts/workbench.sh logs [server|frontend]
  scripts/workbench.sh env set KEY VALUE
  scripts/workbench.sh env show

Notes:
  - API keys are read from the current environment, .env.local, or --api-key.
  - .env.local and .workbench/ are ignored by git.
  - Supported env vars include DEEPSEEK_API_KEY, ANTHROPIC_BASE_URL, ANTHROPIC_MODEL.
EOF
}

load_env_file() {
  local file="${1:-$ENV_FILE}"
  [[ -f "$file" ]] || return 0
  set -a
  # shellcheck disable=SC1090
  source "$file"
  set +a
}

load_runtime_file() {
  [[ -f "$RUNTIME_FILE" ]] || return 0
  # shellcheck disable=SC1090
  source "$RUNTIME_FILE"
}

write_runtime_file() {
  cat >"$RUNTIME_FILE" <<EOF
SERVER_PORT="$SERVER_PORT"
FRONTEND_PORT="$FRONTEND_PORT"
VITE_API_TARGET="$VITE_API_TARGET"
EOF
}

write_env_value() {
  local key="$1"
  local value="$2"
  touch "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  if grep -qE "^${key}=" "$ENV_FILE"; then
    local escaped
    escaped="$(printf '%s' "$value" | sed 's/[&/\]/\\&/g')"
    sed -i "s/^${key}=.*/${key}=\"${escaped}\"/" "$ENV_FILE"
  else
    printf '%s="%s"\n' "$key" "$value" >> "$ENV_FILE"
  fi
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

port_owner() {
  local port="$1"
  if command_exists ss; then
    ss -ltnp "sport = :$port" 2>/dev/null | awk 'NR > 1 { print; found=1 } END { exit found ? 0 : 1 }'
  elif command_exists lsof; then
    lsof -nP -iTCP:"$port" -sTCP:LISTEN 2>/dev/null
  else
    return 1
  fi
}

ensure_port_available() {
  local name="$1"
  local port="$2"
  local pid_file="$3"

  if [[ -z "$port" ]]; then
    echo "$name: empty port" >&2
    return 1
  fi

  if is_running "$pid_file"; then
    return 0
  fi

  local owner
  owner="$(port_owner "$port" || true)"
  if [[ -n "$owner" ]]; then
    echo "$name: port $port is already in use by another process:" >&2
    echo "$owner" >&2
    echo "Stop that process or choose another port." >&2
    return 1
  fi
}

is_running() {
  local pid_file="$1"
  [[ -f "$pid_file" ]] || return 1
  local pid
  pid="$(cat "$pid_file" 2>/dev/null || true)"
  [[ -n "$pid" ]] || return 1
  kill -0 "$pid" 2>/dev/null
}

stop_one() {
  local name="$1"
  local pid_file="$2"
  if ! is_running "$pid_file"; then
    rm -f "$pid_file"
    echo "$name: not running"
    return 0
  fi
  local pid
  pid="$(cat "$pid_file")"
  echo "Stopping $name (pid $pid)..."
  kill -- "-$pid" 2>/dev/null || kill "$pid" 2>/dev/null || true
  for _ in {1..20}; do
    if ! kill -0 "$pid" 2>/dev/null; then
      rm -f "$pid_file"
      echo "$name: stopped"
      return 0
    fi
    sleep 0.2
  done
  kill -9 -- "-$pid" 2>/dev/null || kill -9 "$pid" 2>/dev/null || true
  rm -f "$pid_file"
  echo "$name: killed"
}

start_one() {
  local name="$1"
  local pid_file="$2"
  local log_file="$3"
  local workdir="$4"
  local port="$5"
  shift 5

  if is_running "$pid_file"; then
    echo "$name: already running (pid $(cat "$pid_file"))"
    return 0
  fi

  echo "Starting $name..."
  (
    cd "$workdir"
    nohup setsid "$@" >>"$log_file" 2>&1 </dev/null &
    echo $! >"$pid_file"
  )

  for _ in {1..30}; do
    if ! is_running "$pid_file"; then
      echo "$name: failed to start; see $log_file" >&2
      rm -f "$pid_file"
      return 1
    fi
    if port_owner "$port" >/dev/null; then
      echo "$name: running (pid $(cat "$pid_file"), port $port)"
      return 0
    fi
    sleep 0.2
  done

  echo "$name: started but port $port did not open; see $log_file" >&2
  stop_one "$name" "$pid_file" >/dev/null || true
  return 1
}

cmd_start() {
  local env_file="$ENV_FILE"
  local api_key=""

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --api-key)
        api_key="${2:-}"
        shift 2
        ;;
      --env-file)
        env_file="${2:-}"
        shift 2
        ;;
      --server-port)
        SERVER_PORT="${2:-3001}"
        shift 2
        ;;
      --frontend-port)
        FRONTEND_PORT="${2:-5173}"
        shift 2
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        echo "Unknown option: $1" >&2
        usage
        exit 1
        ;;
    esac
  done

  load_env_file "$env_file"
  if [[ -n "$api_key" ]]; then
    export DEEPSEEK_API_KEY="$api_key"
  fi

  export PORT="$SERVER_PORT"
  export SERVER_PORT FRONTEND_PORT
  export VITE_API_TARGET="${VITE_API_TARGET:-http://localhost:$SERVER_PORT}"

  if [[ -z "${DEEPSEEK_API_KEY:-}" ]]; then
    echo "Warning: DEEPSEEK_API_KEY is not set. Chat calls will fail until configured." >&2
  fi

  ensure_port_available "server" "$SERVER_PORT" "$SERVER_PID"
  ensure_port_available "frontend" "$FRONTEND_PORT" "$FRONTEND_PID"
  write_runtime_file

  if ! start_one "server" "$SERVER_PID" "$LOG_DIR/server.log" "$ROOT_DIR/server" "$SERVER_PORT" ./node_modules/.bin/tsx src/index.ts; then
    rm -f "$RUNTIME_FILE"
    return 1
  fi
  if ! start_one "frontend" "$FRONTEND_PID" "$LOG_DIR/frontend.log" "$ROOT_DIR/frontend" "$FRONTEND_PORT" ./node_modules/.bin/vite --host 0.0.0.0 --port "$FRONTEND_PORT"; then
    stop_one "server" "$SERVER_PID"
    rm -f "$RUNTIME_FILE"
    return 1
  fi
  echo "Frontend: http://localhost:$FRONTEND_PORT"
  echo "Backend:  http://localhost:$SERVER_PORT/api/index/summary"
}

print_status() {
  local name="$1"
  local pid_file="$2"
  local port="$3"

  if is_running "$pid_file"; then
    echo "$name: running (pid $(cat "$pid_file"), port $port)"
    return 0
  fi

  rm -f "$pid_file"
  local owner
  owner="$(port_owner "$port" || true)"
  if [[ -n "$owner" ]]; then
    echo "$name: stopped, but port $port is in use by another process"
    echo "$owner"
  else
    echo "$name: stopped"
  fi
}

cmd_status() {
  load_runtime_file
  print_status "server" "$SERVER_PID" "$SERVER_PORT"
  print_status "frontend" "$FRONTEND_PID" "$FRONTEND_PORT"
}

cmd_logs() {
  local target="${1:-all}"
  case "$target" in
    server) tail -n 120 -f "$LOG_DIR/server.log" ;;
    frontend) tail -n 120 -f "$LOG_DIR/frontend.log" ;;
    all)
      echo "== server =="
      tail -n 80 "$LOG_DIR/server.log" 2>/dev/null || true
      echo "== frontend =="
      tail -n 80 "$LOG_DIR/frontend.log" 2>/dev/null || true
      ;;
    *)
      echo "Unknown logs target: $target" >&2
      exit 1
      ;;
  esac
}

case "${1:-}" in
  start)
    shift
    cmd_start "$@"
    ;;
  stop)
    stop_one "frontend" "$FRONTEND_PID"
    stop_one "server" "$SERVER_PID"
    rm -f "$RUNTIME_FILE"
    ;;
  restart)
    shift
    stop_one "frontend" "$FRONTEND_PID"
    stop_one "server" "$SERVER_PID"
    cmd_start "$@"
    ;;
  status)
    cmd_status
    ;;
  logs)
    shift || true
    cmd_logs "${1:-all}"
    ;;
  env)
    case "${2:-}" in
      set)
        [[ $# -eq 4 ]] || { echo "Usage: scripts/workbench.sh env set KEY VALUE" >&2; exit 1; }
        write_env_value "$3" "$4"
        echo "Wrote $3 to $ENV_FILE"
        ;;
      show)
        if [[ -f "$ENV_FILE" ]]; then
          sed -E 's/^(DEEPSEEK_API_KEY=).+/\1***redacted***/' "$ENV_FILE"
        else
          echo "$ENV_FILE does not exist"
        fi
        ;;
      *)
        usage
        exit 1
        ;;
    esac
    ;;
  -h|--help|'')
    usage
    ;;
  *)
    echo "Unknown command: $1" >&2
    usage
    exit 1
    ;;
esac

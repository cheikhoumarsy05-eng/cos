#!/usr/bin/env bash
# First-time setup: deps, .env, DB schema, seed content. Safe to re-run (idempotent).
set -euo pipefail
cd "$(dirname "$0")/.."

step() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }

# 1. Tooling
command -v pnpm >/dev/null || { echo "pnpm not found. Install: npm i -g pnpm (or corepack enable)"; exit 1; }

# 2. Dependencies
step "Installing dependencies"
pnpm install

# 3. .env (never clobber an existing one)
if [ -f .env ]; then
  step ".env already exists — leaving it untouched"
else
  step "Creating .env from .env.example"
  cp .env.example .env
  # Generate a secret if the placeholder is still blank.
  if grep -q '^PAYLOAD_SECRET=$' .env; then
    secret="$(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))')"
    # portable in-place edit (BSD + GNU sed)
    sed -i.bak "s|^PAYLOAD_SECRET=.*|PAYLOAD_SECRET=$secret|" .env && rm -f .env.bak
    echo "Generated PAYLOAD_SECRET."
  fi
  echo "Set DATABASE_URI in .env to your Postgres connection string before continuing."
fi

# 4. Migrations — only if the DB is reachable; otherwise tell the user, don't fail the whole setup.
step "Applying database migrations"
set -a; . ./.env; set +a
if [ -z "${DATABASE_URI:-}" ] || printf '%s' "$DATABASE_URI" | grep -q 'user:password@'; then
  echo "DATABASE_URI is not configured yet — skipping migrations."
  echo "Edit .env, then run: pnpm migrate"
else
  # Create the database itself if the Postgres CLI is available (harmless if it already exists).
  if command -v createdb >/dev/null; then
    if createdb "$DATABASE_URI" 2>/dev/null; then
      echo "Database created."
    else
      echo "Database already exists or couldn't be created — continuing."
    fi
  else
    echo "createdb not found — assuming the database already exists (skip if using Docker/cloud Postgres)."
  fi
  if yes N | pnpm migrate; then
    echo "Migrations applied."
    # Seed content so the site isn't blank on first run (idempotent — skips anything already present).
    step "Seeding initial content"
    if pnpm seed; then
      echo "Content seeded."
    else
      echo "Seeding failed — run it later with: pnpm seed"
    fi
  else
    echo "Migrations skipped or failed. On a fresh DB run: pnpm migrate && pnpm seed"
    echo "(If prompted about dev-mode data loss, that DB was already dev-pushed — a fresh clone won't hit this.)"
  fi
fi

step "Done. Start the app with: pnpm dev"

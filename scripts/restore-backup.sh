#!/usr/bin/env bash
# Loads a backup file from the Backup workflow into an empty database.
# Usage: scripts/restore-backup.sh <backup-file.sql.age> <database-url>
# It asks for the age private key. See docs/restore-backup.md.
set -euo pipefail

if [ $# -ne 2 ]; then
  echo "Usage: scripts/restore-backup.sh <backup-file.sql.age> <database-url>" >&2
  exit 1
fi
backup=$1
db_url=$2

for tool in age psql; do
  if ! command -v "$tool" > /dev/null; then
    echo "$tool isn't installed. Run: brew install age libpq" >&2
    exit 1
  fi
done
if [ ! -f "$backup" ]; then
  echo "No such file: $backup" >&2
  exit 1
fi

# Stop before touching a database the app already uses: its rows would
# clash with the backup's. This also checks the address works.
has_tables=$(psql --no-psqlrc --tuples-only --no-align --dbname "$db_url" \
  --command "select to_regclass('public.tasks') is not null")
if [ "$has_tables" = t ]; then
  echo "This database already has a tasks table. Load the backup into a new, empty Supabase project instead." >&2
  exit 1
fi

# The key is read here and never saved to a file.
read -r -s -p "Paste the age private key (it starts with AGE-SECRET-KEY-), then press Enter: " key
echo

# The plain copy holds every user's data, so it lives in a private
# folder that's deleted however the script ends.
work=$(mktemp -d)
chmod 700 "$work"
trap 'rm -rf "$work"' EXIT

if ! age --decrypt --identity <(printf '%s\n' "$key") --output "$work/backup.sql" "$backup"; then
  echo "Couldn't decrypt the file. Check that you pasted the whole key, and that it's the backup key." >&2
  exit 1
fi
unset key

echo "Loading the backup..."
# --single-transaction: if anything fails, nothing is changed.
# Hide Postgres's notices, so only real errors show.
psql --no-psqlrc --quiet --single-transaction --variable ON_ERROR_STOP=1 \
  --command "set client_min_messages = warning" \
  --file "$work/backup.sql" --dbname "$db_url" > /dev/null

echo "Done. The database now has:"
psql --no-psqlrc --dbname "$db_url" --command "
  select (select count(*) from auth.users) as users,
         (select count(*) from public.tasks) as tasks,
         (select count(*) from public.settings) as settings"

#!/usr/bin/env bash
# Dumps the whole database into one SQL file that psql can load.
# Usage: scripts/backup-dump.sh <database-url> <output-file>
# Needs the Supabase CLI and Docker. The backup workflow runs this, and so
# can you, against a local Supabase. See docs/restore-backup.md.
#
# It never prints the data: the workflow logs are public.
set -euo pipefail

db_url=$1
out=$2

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

# Supabase's own backup steps: roles, then tables, then data.
# Data comes from two schemas: public (tasks, settings) and auth (the user
# list, which both tables point to). Why, and why not the others: 0024.
# The CLI's messages name the database's address, so show them only when
# a step fails. Errors never hold rows from the database.
dump() {
  if ! supabase db dump --remote="$db_url" "$@" > "$work/log" 2>&1; then
    cat "$work/log" >&2
    exit 1
  fi
}
dump --role-only -f "$work/roles.sql"
dump -f "$work/schema.sql"
dump --data-only --use-copy --schema auth,public -f "$work/data.sql"

# Fail if a table we need is missing from the data dump.
for table in '"auth"."users"' '"public"."tasks"' '"public"."settings"'; do
  if ! grep -q "^COPY $table " "$work/data.sql"; then
    echo "The dump has no data for $table." >&2
    exit 1
  fi
done

{
  cat "$work/roles.sql" "$work/schema.sql"
  # Load rows without firing triggers or checking foreign keys row by row,
  # as Supabase's restore steps do.
  echo 'SET session_replication_role = replica;'
  cat "$work/data.sql"
} > "$out"

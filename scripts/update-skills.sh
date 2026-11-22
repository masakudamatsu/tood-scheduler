#!/usr/bin/env bash
# Updates the named skills from other people to their latest version.
# Run by .github/workflows/update-skills.yml. Why: docs/adrs/0028.
#
# Usage: scripts/update-skills.sh <skill-name>...
#
# Only the skills named here are updated. Others in skills-lock.json stay as they are.
set -euo pipefail

if [ "$#" -eq 0 ]; then
  echo "Name at least one skill to update." >&2
  exit 1
fi

# `skills update` with a name it doesn't know does nothing and still succeeds.
# So stop here, or a renamed or removed skill would quietly never be updated.
for name in "$@"; do
  if ! jq -e --arg name "$name" '.skills[$name]' skills-lock.json > /dev/null; then
    echo "$name is not in skills-lock.json. Fix the list of skills in .github/workflows/update-skills.yml." >&2
    exit 1
  fi
done

# Turn off the usage data that the skills tool and the skills themselves send.
export DISABLE_TELEMETRY=1 DO_NOT_TRACK=1
# Tell the skills tool we use Claude Code. If it can't tell which coding agent
# is used, it writes a copy of each skill for every agent it knows,
# for example in agent/skills/.
export AI_AGENT=claude

npx -y skills@1.9.0 update "$@" --project --yes

# Stop if the update changed anything other than the named skills and the lock file.
allowed='^skills-lock\.json$'
for name in "$@"; do
  allowed="$allowed|^\.agents/skills/$name/"
done
unexpected="$(git status --porcelain --untracked-files=all | cut -c4- | grep -Ev "$allowed" || true)"
if [ -n "$unexpected" ]; then
  echo "The update changed files it shouldn't have:" >&2
  echo "$unexpected" >&2
  exit 1
fi

# Each skill lives in .agents/skills/, with a symlink in .claude/skills/ (docs/adrs/0019).
for name in "$@"; do
  if [ ! -L ".claude/skills/$name" ] || [ "$(readlink ".claude/skills/$name")" != "../../.agents/skills/$name" ]; then
    echo ".claude/skills/$name is no longer a symlink to .agents/skills/$name." >&2
    exit 1
  fi
done

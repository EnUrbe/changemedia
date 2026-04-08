#!/usr/bin/env bash
set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: not inside a git repository."
  exit 1
fi

branch="$(git branch --show-current)"
if [[ -z "$branch" ]]; then
  echo "Error: could not determine current git branch."
  exit 1
fi

commit_message="${*:-chore: deploy $(date '+%Y-%m-%d %H:%M:%S')}"

echo "Current branch: $branch"
echo "Staging all changes..."
git add -A

if git diff --cached --quiet; then
  echo "No staged changes to commit."
else
  echo "Committing with message: $commit_message"
  git commit -m "$commit_message"
fi

echo "Pushing to origin/$branch..."
git push origin "$branch"

echo "Push complete. If Vercel Git integration is enabled, deployment will trigger automatically."

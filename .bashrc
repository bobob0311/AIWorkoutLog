harness(){
local base extra
base="${< .codex/commands/harness.md}"
extra="$(printf '%s ' "$@")"
codex ask "$(printf '%s\n\n%s' "$base" "$extra")"
}


#!/usr/bin/env bash
# PreToolUse (Edit|Write|MultiEdit): bloqueia conteúdo com chave, token ou private key.
entrada="$(cat)"
padrao='AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{36}|sk-[A-Za-z0-9_-]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|(SN_PASSWORD|SN_USER|PASSWORD|TOKEN|SECRET)=[^"\\ ]+'
if printf '%s' "$entrada" | grep -Eq "$padrao"; then
  echo "Bloqueado: o conteúdo parece ter um segredo. Use o Infisical e leia da variável de ambiente." >&2
  exit 2
fi
exit 0

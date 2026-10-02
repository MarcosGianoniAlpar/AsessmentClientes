#!/usr/bin/env bash
# PreToolUse (Bash): repo de análise, ServiceNow é somente leitura.
# Bloqueia chamadas HTTP de escrita para instâncias ou para $SN_INSTANCE_URL.
entrada="$(cat)"
if printf '%s' "$entrada" | grep -Eqi 'service-now\.com|servicenowservices\.com|SN_INSTANCE_URL'; then
  if printf '%s' "$entrada" | grep -Eqi '(-X|--request)[ =]*(POST|PUT|PATCH|DELETE)|(^|[ "])(-d|--data[a-z-]*|-F|--form|-T|--upload-file)[ =]|(http|https)[ ]+(POST|PUT|PATCH|DELETE)[ ]'; then
    echo "Bloqueado: este repositório é só de análise. Na instância ServiceNow use apenas GET." >&2
    exit 2
  fi
fi
exit 0

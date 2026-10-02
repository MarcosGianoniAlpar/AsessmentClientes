# 0001: Repositório só de análise

- **Data:** 2026-10-02
- **Status:** aceita

## Contexto

O harness padrão prevê `apps/`, `packages/` e verify com typecheck, lint e testes. Este repositório não tem código de aplicação: o produto são documentos de assessment de instâncias ServiceNow.

## Decisão

- Remover `apps/` e `packages/`; criar `assessments/`, `templates/` e `docs/`.
- O verify checa estrutura, ausência de travessão e ausência de segredos nos arquivos versionados.
- Acesso às instâncias é somente leitura, reforçado por hook.
- Exports brutos ficam fora do Git.

## Consequências

Se surgir automação de coleta (scripts de extração), ela entra em `scripts/` e o verify ganha lint e testes para ela.

# AsessmentClientes

Repositório de **análises (assessments) de instâncias ServiceNow de clientes** da Alpar.
Aqui não se desenvolve nada na plataforma: só se lê, analisa e documenta.

## Regras

1. **Somente leitura no ServiceNow.** Consultas à instância só via GET (Table API, Aggregate API, exports). Nunca POST, PUT, PATCH ou DELETE. Nunca rodar background script, nunca commitar update set. O hook `block-sn-write.sh` bloqueia escrita via curl.
2. **Segredos no Infisical.** Credenciais de instância nascem no cofre e chegam como variável de ambiente (`infisical run -- claude`). Nunca escrever usuário, senha ou token em arquivo. O hook `block-secrets.sh` bloqueia.
3. **Dados brutos não vão para o Git.** Exports da instância (xlsx, csv, xml, json) ficam em `assessments/<cliente>/brutos/`, que está no `.gitignore`. No repositório entra só a análise.
4. **Sem dado pessoal nos achados.** Usar sys_id, contagens ou nomes de grupo. Nunca nome, e-mail ou telefone de usuário final.
5. **Todo achado tem evidência.** Tabela, filtro (encoded query), contagem ou print. Achado sem evidência não entra.
6. **PR pequeno.** Uma entrega por branch `claude/<entrega>`. Nunca commit na main.
7. **Verify verde antes do PR.** `npm run verify`.
8. **Sem travessão** no meio de frases. Usar vírgula, dois pontos ou ponto.
9. **Português do Brasil** nos documentos; termos do ServiceNow ficam no original (Business Rule, Update Set, RITM).

## Estrutura

- `assessments/<cliente>/`: uma pasta por cliente, partindo de `templates/assessment.md`.
- `templates/`: modelos de assessment e de achado.
- `docs/`: método, escala de severidade e decisões (`docs/decisoes/`).
- `scripts/`: utilitários (verify, extrações somente leitura).

## Rotina de cada entrega

1. Criar branch `claude/<cliente>-<entrega>`.
2. Copiar o template para `assessments/<cliente>/` (se for cliente novo).
3. Coletar evidências (somente leitura) e registrar achados.
4. `npm run verify` até ficar verde.
5. Chamar o subagente `revisor` para revisar o diff.
6. Abrir o PR e atualizar o `HANDOFF.md`.
7. Registrar no `DEBT.md` o que ficou para depois.

## Skills úteis

`servicenow-modulos`, `servicenow-scripting-guide`, `servicenow-request-management`, `servicenow-data-migration`, `servicenow-terminologias` para classificar achados; `alpar-presentation` para o deck de apresentação ao cliente; `xlsx` para ler exports.

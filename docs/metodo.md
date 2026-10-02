# Método de análise

1. **Kickoff:** escopo, instâncias, acesso somente leitura (papel `snc_read_only` ou equivalente).
2. **Coleta:** Table API e Aggregate API via GET, exports de listas. Brutos em `assessments/<cliente>/brutos/` (fora do Git).
3. **Análise:** por área, usando as skills ServiceNow para classificar cada achado no componente certo.
4. **Consolidação:** achados com evidência, severidade e esforço; roadmap em ondas.
5. **Revisão:** `npm run verify` e subagente `revisor`.
6. **Entrega:** documento no repositório e deck com a skill `alpar-presentation`.

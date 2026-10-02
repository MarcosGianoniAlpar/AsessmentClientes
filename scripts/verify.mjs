// Portão de qualidade: o mesmo comando roda local e no CI.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const root = process.cwd();
const IGNORAR = new Set(['.git', 'node_modules', 'brutos']);
const TEXTO = new Set(['.md', '.json', '.yml', '.yaml', '.sh', '.mjs', '.js', '.txt', '.example', '']);

function arquivos(dir) {
  return readdirSync(dir).flatMap((nome) => {
    if (IGNORAR.has(nome)) return [];
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) return arquivos(caminho);
    return TEXTO.has(extname(nome)) ? [caminho] : [];
  });
}

const etapas = {
  estrutura() {
    const obrigatorios = ['CLAUDE.md', 'HANDOFF.md', 'DEBT.md', 'env.example', 'templates/assessment.md', '.claude/settings.json', 'assessments/README.md'];
    const faltando = obrigatorios.filter((f) => !existsSync(join(root, f))).map((f) => `faltando: ${f}`);
    // Cada cliente: slug válido, assessment.md presente e registrado no índice.
    const dir = join(root, 'assessments');
    const indice = readFileSync(join(dir, 'README.md'), 'utf8');
    const clientes = readdirSync(dir).filter((n) => statSync(join(dir, n)).isDirectory());
    for (const c of clientes) {
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c)) faltando.push(`slug inválido: assessments/${c}`);
      if (!existsSync(join(dir, c, 'assessment.md'))) faltando.push(`faltando: assessments/${c}/assessment.md`);
      if (!indice.includes(`| ${c} |`)) faltando.push(`cliente fora do índice: ${c}`);
    }
    return faltando;
  },
  estilo() {
    const travessao = '—';
    return arquivos(root)
      .filter((f) => f.endsWith('.md'))
      .flatMap((f) => readFileSync(f, 'utf8').split('\n')
        .map((linha, i) => (linha.includes(travessao) ? `${relative(root, f)}:${i + 1} travessão` : null))
        .filter(Boolean));
  },
  segredos() {
    const padroes = [
      /AKIA[0-9A-Z]{16}/,
      /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
      /gh[pousr]_[A-Za-z0-9]{36}/,
      /sk-[A-Za-z0-9_-]{20,}/,
      /xox[baprs]-[A-Za-z0-9-]{10,}/,
      /^[ \t]*(SN_PASSWORD|SN_USER|PASSWORD|TOKEN|SECRET)[A-Z0-9_]*[ \t]*=[ \t]*\S+/m,
    ];
    return arquivos(root)
      .filter((f) => padroes.some((p) => p.test(readFileSync(f, 'utf8'))))
      .map((f) => `possível segredo: ${relative(root, f)}`);
  },
};

let falhou = false;
for (const [nome, etapa] of Object.entries(etapas)) {
  const erros = etapa();
  if (erros.length) {
    falhou = true;
    console.error(`✗ ${nome}\n  ${erros.join('\n  ')}`);
    break;
  }
  console.log(`✓ ${nome}`);
}
process.exit(falhou ? 1 : 0);

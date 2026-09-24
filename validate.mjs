// Valida o frontmatter de todo o conteúdo contra os mesmos schemas
// do src/content.config.ts do site (dougbr-site). Se mudar lá, muda aqui.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import yaml from 'js-yaml';
import { z } from 'zod';

// ---------- Limite de tamanho para assets commitados ----------
// Prints e diagramas pequenos: OK no repo. Acima disso: vai pro R2.
const MAX_ASSET_KB = 500;

// ---------- Schemas (espelho de src/content.config.ts) ----------
const schemas = {
    posts: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        author: z.string(), // slug do membro
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
    }),
    events: z.object({
        title: z.string(),
        eventDate: z.coerce.date(),
        location: z.string(),
        format: z.enum(['presencial', 'online', 'híbrido']).default('online'),
        link: z.string().url().optional(),
        partner: z.string().optional(),
        flag: z.enum(['apoio', 'presenca']).optional(),
        cover: z.string().url().optional(),
        gallery: z.array(z.string().url()).default([]),
    }),
    jobs: z.object({
        title: z.string(),
        company: z.string(),
        location: z.string(),
        level: z.string().optional(),
        salary: z.string().optional(),
        link: z.string().url(),
        postedAt: z.coerce.date(),
        expiresAt: z.coerce.date().optional(),
    }),
    members: z.object({
        name: z.string(),
        role: z.string(), // ex: Fundador, Community Lead, Membro
        capability: z.string().optional(), // frente que o lead toca
        isLead: z.boolean().default(false),
        avatar: z.string().optional(), // caminho em /public ou URL
        linkedin: z.string().url().optional(),
        github: z.string().url().optional(),
        instagram: z.string().url().optional(),
        order: z.number().default(99),
    }),
    pillars: z.object({
        title: z.string(),
        order: z.number(),
        accent: z.enum(['green', 'yellow', 'blue']),
    }),
};

const collections = Object.keys(schemas);
const errors = [];

// ---------- Helpers ----------
function* walk(dir) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) yield* walk(full);
        else yield full;
    }
}

function extractFrontmatter(file) {
    const raw = readFileSync(file, 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    return match ? match[1] : null;
}

// ---------- 1) Validação de frontmatter ----------
for (const collection of collections) {
    const dir = join(process.cwd(), collection);
    if (!existsSync(dir)) continue;

    for (const file of walk(dir)) {
        if (!file.endsWith('.md')) continue;

        const rel = file.replace(process.cwd() + '/', '');
        const fm = extractFrontmatter(file);

        if (fm === null) {
            errors.push(`${rel}: frontmatter ausente (o arquivo precisa começar com ---)`);
            continue;
        }

        let data;
        try {
            data = yaml.load(fm);
        } catch (e) {
            errors.push(`${rel}: YAML inválido — ${e.message}`);
            continue;
        }

        const result = schemas[collection].safeParse(data);
        if (!result.success) {
            for (const issue of result.error.issues) {
                errors.push(`${rel}: campo "${issue.path.join('.')}" — ${issue.message}`);
            }
        }
    }
}

// ---------- 2) Checagem de assets ----------
for (const collection of collections) {
    const dir = join(process.cwd(), collection);
    if (!existsSync(dir)) continue;

    for (const file of walk(dir)) {
        const rel = file.replace(process.cwd() + '/', '');

        // 2a) Arquivos que não são .md (imagens etc.): limite de tamanho
        if (!file.endsWith('.md')) {
            const sizeKB = statSync(file).size / 1024;
            if (sizeKB > MAX_ASSET_KB) {
                errors.push(
                    `${rel}: ${Math.round(sizeKB)}KB passa do limite de ${MAX_ASSET_KB}KB. ` +
                    `Otimize a imagem ou suba no R2 (assets.doug.knov.work) e use a URL.`
                );
            }
            continue;
        }

        // 2b) Referências de imagem relativas no markdown precisam existir
        const body = readFileSync(file, 'utf8');
        const refs = body.matchAll(/!\[[^\]]*\]\(([^)\s]+)[^)]*\)/g);
        for (const [, ref] of refs) {
            if (ref.startsWith('http://') || ref.startsWith('https://')) continue; // R2/externa: ok
            if (ref.startsWith('/')) continue; // /public do site: não dá pra validar aqui
            if (!existsSync(join(dirname(file), ref))) {
                errors.push(`${rel}: imagem "${ref}" não encontrada (caminho relativo ao post)`);
            }
        }
    }
}

// ---------- Resultado ----------
if (errors.length > 0) {
    console.error(`\n❌ ${errors.length} problema(s) encontrado(s):\n`);
    for (const e of errors) console.error(`  • ${e}`);
    process.exit(1);
}

console.log('✅ Conteúdo válido!');
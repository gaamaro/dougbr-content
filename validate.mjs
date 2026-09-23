import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { z } from 'zod';

const schemas = {
    posts: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        author: z.string(),
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
        role: z.string(),
        pillar: z.enum(['conexao', 'conhecimento', 'acessibilidade']).optional(),
        isLead: z.boolean().default(false),
        avatar: z.string().optional(),
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

let failed = 0;

for (const [dir, schema] of Object.entries(schemas)) {
    let files;
    try {
        files = readdirSync(dir).filter((f) => f.endsWith('.md'));
    } catch {
        continue; // pasta ainda não existe: ok
    }
    for (const file of files) {
        const path = join(dir, file);
        const raw = readFileSync(path, 'utf8');
        const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (!match) {
            console.error(`✗ ${path}: frontmatter ausente ou malformado`);
            failed++;
            continue;
        }
        let data;
        try {
            data = yaml.load(match[1]);
        } catch (e) {
            console.error(`✗ ${path}: YAML inválido — ${e.message}`);
            failed++;
            continue;
        }
        const result = schema.safeParse(data);
        if (!result.success) {
            console.error(`✗ ${path}:`);
            for (const issue of result.error.issues) {
                console.error(`    - ${issue.path.join('.')}: ${issue.message}`);
            }
            failed++;
        } else {
            console.log(`✓ ${path}`);
        }
    }
}

if (failed > 0) {
    console.error(`\n${failed} arquivo(s) com problema.`);
    process.exit(1);
}
console.log('\nConteúdo válido ✅');
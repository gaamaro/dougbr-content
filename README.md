# DOUG BR — Conteúdo

Conteúdo do site da DOUG BR (DevOps User Group Brazil). Aqui vivem **apenas os Markdowns** — o código do site fica em um repo privado. A cada merge na `main`, o site é rebuildado e publicado automaticamente.

## Como contribuir

1. Faça um **fork** deste repo
2. Crie uma branch: `git checkout -b post/meu-titulo`
3. Adicione seu `.md` na pasta certa (modelos abaixo)
4. Abra um **Pull Request** — uma validação automática confere o frontmatter
5. Um lead revisa e faz o merge → site no ar em ~2 min

## Modelos de frontmatter

### `posts/meu-post.md`
\`\`\`
---
title: "Título do post"
description: "Resumo de uma linha (aparece nos cards e na busca)"
pubDate: 2026-10-01
author: "seu-slug-de-membro"
tags: ["devops", "kubernetes"]
draft: false
---

Texto do post em Markdown...
\`\`\`

### `events/meetup-13.md`
\`\`\`
---
title: "Meetup DOUG BR #13"
eventDate: 2026-11-20
location: "Campinas/SP"
format: "híbrido"
link: "https://..."
partner: "DEVPIRA"
---
\`\`\`
`format` aceita: `presencial`, `online`, `híbrido`.

### `jobs/empresa-vaga.md`
\`\`\`
---
title: "Pessoa Engenheira DevOps"
company: "Nome da Empresa"
location: "Remoto"
level: "Pleno"
salary: "R$ 12k–16k"
link: "https://..."
postedAt: 2026-10-01
expiresAt: 2026-11-01
---
\`\`\`

### `members/seu-nome.md`
\`\`\`
---
name: "Nome Sobrenome"
role: "Community Lead"
isLead: true
pillar: "conexao"
order: 20
linkedin: "https://www.linkedin.com/in/..."
github: "https://github.com/..."
---

Bio curta (aparece na sua página de perfil).
\`\`\`
`pillar` aceita: `conexao`, `conhecimento`, `acessibilidade` (opcional).
⚠️ Fotos de perfil ficam no repo do site — peça a um lead para adicionar.

## Regras de ouro

- Aspas sempre retas (`"`), nunca curvas
- Datas no formato `AAAA-MM-DD`
- Nomes de arquivo em minúsculo, com hífens: `meu-post.md`
- Se a validação falhar no PR, leia o log do check — ele diz o arquivo e o campo exato
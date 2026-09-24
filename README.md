# DOUG BR — Conteúdo

Este repositório guarda **todo o conteúdo** do site da DOUG BR (DevOps User
Group Brazil): posts, eventos, vagas, membros e pilares. O site é gerado a
partir daqui automaticamente — você não precisa saber programar nem rodar o
site localmente para contribuir.

**O fluxo resumido:** clone → branch → escreve → valida → PR → merge →
o site atualiza sozinho em alguns minutos. 🚀

---

## Estrutura

```
├── posts/       ← artigos do blog
├── events/      ← encontros, meetups, lives
├── jobs/        ← vagas da comunidade
├── members/     ← pessoas da comunidade (leads, fundadores)
├── pillars/     ← os 3 pilares da comunidade (não mexer sem alinhamento)
├── validate.mjs ← validador que roda no CI (e localmente)
└── .github/     ← workflows e templates
```

## Como contribuir (passo a passo)

### 1. Clone o repositório

```bash
git clone git@github.com:gaamaro/dougbr-content.git
cd dougbr-content
```

### 2. Instale as dependências (só na primeira vez)

Precisa de [Node.js](https://nodejs.org) 18+ instalado:

```bash
npm install
```

### 3. Crie uma branch

Nunca commite direto na `main` — ela é protegida. Crie uma branch
descritiva:

```bash
git checkout -b post/meu-primeiro-post
# exemplos: post/..., evento/..., vaga/..., perfil/seu-nome
```

### 4. Escreva o conteúdo

Crie o arquivo `.md` na pasta certa, seguindo os templates da seção
[Formatos de frontmatter](#formatos-de-frontmatter) abaixo. O corpo do
arquivo aceita **Markdown completo**: títulos, listas, código, imagens,
links.

### 5. Valide localmente

```bash
node validate.mjs
```

Se aparecer `✅ Conteúdo válido!`, pode seguir. Se aparecer erro, ele diz
**exatamente** o arquivo, o campo e o motivo — corrige e roda de novo.

### 6. Commit, push e PR

```bash
git add .
git commit -m "post: título do meu post"
git push -u origin post/meu-primeiro-post

gh pr create --title "post: título do meu post" --body "Descrição curta do que está sendo adicionado."
```

&gt; Sem o [GitHub CLI](https://cli.github.com) (`gh`)? Pode abrir o PR pela
&gt; interface web — o GitHub mostra um banner "Compare & pull request" logo
&gt; após o push.

### 7. Revisão e merge

- A Action **valida** roda automaticamente no seu PR — se ficar vermelha,
  clique nela para ver o erro, corrija e dê push na mesma branch
- Um maintainer revisa e aprova
- Após o merge, o **deploy do site dispara sozinho** — seu conteúdo entra
  no ar em alguns minutos

### 8. Limpeza (depois do merge)

```bash
git checkout main
git pull
git branch -d post/meu-primeiro-post
```

---

## Formatos de frontmatter

Todo arquivo `.md` começa com um bloco `---` de metadados. Copie o template
correspondente e preencha:

### Post (`posts/`)

```yaml
---
title: "Título do post"
description: "Resumo de uma ou duas frases (aparece nos cards e no SEO)."
pubDate: 2026-10-15
author: "seu-slug-de-member"   # o nome do seu arquivo em members/, sem .md
tags: ["kubernetes", "ci-cd"]
draft: false                   # true = não publica (útil pra rascunho em PR)
---
```

### Evento (`events/`)

```yaml
---
title: "DOUG BR #12 — Observabilidade na prática"
eventDate: 2026-11-20
location: "Online"
format: "online"               # online | presencial | híbrido
link: "https://..."            # meetup, sympla, linkedin...
partner: "AWS UG Piracicaba"   # opcional
flag: "apoio"                  # opcional — apoio | presenca (selo de destaque)
cover: "https://..."           # opcional — logo do evento no R2
gallery:                       # opcional — fotos pós-evento no R2
  - "https://..."
---
```

Lembrando: `flag` exibe um selo de destaque no card; `cover` é a logo principal do evento hospedada no R2; `gallery` são as fotos pós-evento, também no R2. Veja a seção de imagens abaixo.

### Vaga (`jobs/`)

```yaml
---
title: "Pessoa SRE Plena"
company: "Empresa X"
location: "Remoto"
level: "Pleno"                 # opcional
salary: "R$ 12k–16k"           # opcional
link: "https://..."            # link da candidatura
postedAt: 2026-10-01
expiresAt: 2026-11-01          # opcional — vaga sai do ar depois
---
```

### Membro (`members/`)

```yaml
---
name: "Seu Nome"
role: "Community Lead"         # Fundador | Community Lead | Membro
capability: "Observabilidade"  # frente que você toca: Cloud, IaC, Comunicação...
isLead: true
avatar: "https://assets.doug.knov.work/members/seu-nome.png"  # veja seção de imagens
linkedin: "https://www.linkedin.com/in/..."
github: "https://github.com/..."      # opcional
instagram: "https://instagram.com/..." # opcional
order: 10                      # ordem de exibição (menor = aparece antes)
---
```

O **corpo** do arquivo do membro vira a bio na página de perfil — escreva à
vontade em Markdown.

&gt; `capability` ≠ pilar. Pilares (Conexão, Conhecimento, Acessibilidade) são
&gt; a filosofia da comunidade. A capability é a **frente técnica/de
&gt; comunidade** que você é responsável por tocar.

---

## Imagens e arquivos pesados

**Imagens do post** (prints de terminal, diagramas, screenshots): commitam
junto com o post, na mesma pasta, e referencia com caminho relativo:

```
posts/
└── meu-post/
    ├── index.md
    └── diagrama.png   →  no markdown: ![Diagrama](./diagrama.png)
```

Regras:

- **Até 500KB por imagem** — o CI falha o PR se passar disso. Otimize antes
  ([squoosh.app](https://squoosh.app) ou similar) ou suba no R2.
- **Galerias de eventos, PDFs, slides, vídeos e avatares**: não commitar.
  Esses vão para o nosso bucket R2 em `https://assets.doug.knov.work` —
  mencione no PR que precisa de upload e um maintainer sobe e te passa a URL
  para referenciar no markdown.
- Imagens referenciadas com caminho relativo **precisam existir** no PR —
  o CI valida isso automaticamente.

---

## FAQ

**Preciso rodar o site pra ver como ficou?**
Não. Se o `node validate.mjs` passar e o PR ficar verde, o site gera a
página corretamente. Se quiser preview visual, fale com um maintainer.

**Como edito algo que já publiquei?**
Mesmo fluxo: branch → edita o arquivo → PR → merge.

**Meu PR ficou vermelho, e agora?**
Clique no check **valida** na página do PR — o log mostra o arquivo e o
campo com problema. Corrija, commite na mesma branch e dê push; o PR
atualiza sozinho.

**Posso commitar na main?**
Não — a branch é protegida e o push será recusado. Todo conteúdo entra via
PR (isso garante que nada quebre o site).

---

Dúvidas? Abra uma
[Discussion](https://github.com/gaamaro/dougbr-content/discussions) ou fale
com os leads no nosso canal. 💛💚
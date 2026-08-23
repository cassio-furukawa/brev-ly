# brev.ly — Encurtador de URLs

Solução para o desafio de encurtamento de URLs, dividida em duas subpastas:

- `server/` — API em Fastify + TypeScript + Drizzle + PostgreSQL
- `web/` — SPA em React + Vite + TypeScript

## Decisão de identificador

Para as operações de deletar, obter e incrementar acessos de um link, foi adotado o
campo **`shortUrl`** (a URL encurtada) como identificador em todas as rotas, mantendo
consistência entre back-end e front-end, já que é o único dado que a página de
redirecionamento tem disponível na URL do navegador.

## Rodando tudo com Docker (Postgres + API + Web)

```bash
docker compose up --build
```

Isso sobe os três serviços juntos:

- Postgres em `localhost:5432`
- API em `http://localhost:3333`
- Front-end (Vite dev server, com hot reload) em `http://localhost:5173`

Só é necessário ter o arquivo `server/.env` criado (copie de `server/.env.example`) antes de subir. Já vai estar tudo configurado.

O compose já cuida de duas coisas automaticamente, a cada `up`:

- **Migrations**: o container do `server` roda `db:migrate:prod` antes de iniciar a API. Migrations já aplicadas são ignoradas pelo Drizzle, então isso é seguro em toda subida — inclusive na primeira, quando o banco ainda está vazio.
- **Dependências do front**: o container do `web` roda `npm install` antes do `vite dev` a cada início, então uma lib nova adicionada ao `package.json` é instalada automaticamente, sem precisar rebuildar a imagem manualmente.

## Rodando o back-end manualmente

```bash
cd server
npm install
npm run db:migrate
npm run dev
```

### Rotas da API

| Método | Rota            | Descrição                                              |
| ------ | --------------- | ------------------------------------------------------- |
| POST   | `/links`        | Cria um link encurtado                                  |
| GET    | `/links`        | Lista todos os links cadastrados                        |
| GET    | `/links/:shortUrl` | Retorna a URL original e incrementa o contador de acessos |
| DELETE | `/links/:shortUrl` | Remove um link                                        |
| GET    | `/links/export` | Gera um CSV com todos os links e retorna a URL pública do arquivo |

## Rodando o front-end manualmente

```bash
cd web
npm install
npm run dev
```

### Páginas

- `/` — formulário de cadastro e listagem dos links
- `/:shortUrl` — página de redirecionamento
- qualquer outra rota — página 404

## Stack

**Back-end:** TypeScript, Fastify, Drizzle ORM, PostgreSQL, AWS SDK (S3 compatível com Cloudflare R2), fast-csv, Docker

**Front-end:** TypeScript, React, Vite, TailwindCSS, React Query, React Hook Form, Zod

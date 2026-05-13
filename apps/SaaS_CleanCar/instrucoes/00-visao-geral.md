# Visão Geral — SaaS Lavação (Multi-Tenant)

Este repositório contém um sistema SaaS (multi-clientes) para gestão de empresa(s) de lavagem/estética automotiva, substituindo a ficha em papel por Ordem de Serviço digital, com precificação por porte, combos, pagamentos e fechamento de caixa diário.

## Objetivos do Produto

- Substituir 100% a ficha manual por **Ordem de Serviço (OS) digital**
- Permitir **gerar PDF** para impressão/compartilhamento
- Uso mobile-first (tablet/smartphone)
- Controle financeiro diário (pagamentos + **fechamento de caixa**)
- Preparado para múltiplas unidades por tenant e **controle de acesso granular (RBAC)**
- SaaS multi-tenant em banco único: isolamento por `id_tenant`

## Stack (Definitiva)

### Backend
- Node.js + NestJS
- PostgreSQL
- Prisma ORM (recomendado) ou SQL puro (aceito, mas Prisma preferível)
- Autenticação: JWT + Refresh Token
- RBAC (papéis + permissões granulares)
- Middleware de tenant: injeta `id_tenant` a partir do token

### Frontend
- Next.js (PWA)
- UI mobile-first
- Assinatura digital via canvas
- Geração/visualização de PDF (via endpoint)

### Infra/Deploy
- Docker Compose (dev)
- Produção: container + PostgreSQL gerenciado (opcional)
- Armazenamento de arquivos (assinaturas/PDF): S3 compatível (ou disco local no MVP)

## Conceitos Essenciais

### Multi-Tenant (SaaS)
- Toda tabela de negócio possui `id_tenant`
- Toda consulta SEMPRE filtra por `id_tenant` (hard rule)
- O backend não aceita `id_tenant` vindo do frontend. Ele vem do JWT.

### Multiunidade
- Um tenant pode ter N unidades
- OS, pagamentos e fechamentos estão vinculados a uma unidade

### Precificação
- Serviços avulsos: preço por `porte` do veículo
- Combos: preço fechado por `porte` (não calculado via desconto dinâmico)
- Desconto manual só com permissão

## Módulos do Sistema (Backend)
- Auth (login, refresh, logout)
- Tenants + Unidades (admin tenant)
- Usuários + Papéis + Permissões (RBAC)
- Cadastros: Clientes, Veículos
- Catálogo: Serviços, Preços por porte, Combos, Preços do combo por porte, Itens do combo
- Ordens de Serviço: criação, status, assinatura, PDF, histórico
- Pagamentos: múltiplas formas por OS
- Financeiro: fechamento de caixa diário e relatórios

## Regras de Negócio (Resumo)
- OS pode ter OU combo OU lista de serviços avulsos
- Total da OS calculado e persistido em `total_centavos`
- OS cancelada exige motivo + auditoria + estorno de pagamentos
- Fechamento de caixa bloqueia edições (exceto reabertura com permissão)
- Auditoria registra alterações críticas (cancelamento, preço, pagamentos, reabertura)

## Variáveis de Ambiente (.env)

# Backend
PORT=3001
DATABASE_URL=postgresql://usr_posto:posto12345@localhost:5432/postodb?schema=public
JWT_ACCESS_SECRET=troque_isto
JWT_REFRESH_SECRET=troque_isto
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Storage
STORAGE_DRIVER=local # local|s3
STORAGE_LOCAL_PATH=./storage
S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_REGION=

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001

## Critérios de Aceite Globais
- Nenhuma rota retorna/aceita dados de tenant diferente
- Todas as telas principais funcionam em mobile
- PDF da OS gerado com dados essenciais (cliente/veículo/serviços/total/assinatura)
- Fechamento de caixa por unidade e por dia funcionando
- Permissões impedem ações indevidas (editar preço/fechar caixa/cancelar OS etc.)

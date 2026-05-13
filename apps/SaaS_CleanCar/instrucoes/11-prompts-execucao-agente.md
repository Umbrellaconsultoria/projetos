# Prompts Estruturados para Execução Automática do Agente

Este documento define prompts sequenciais para um agente LLM gerar o sistema completo em etapas seguras.

---

## Prompt 1 — Criar Backend Base

Objetivo:
Gerar projeto NestJS com:
- Estrutura definida em 01-estrutura-codigo.md
- Prisma configurado
- Multi-tenant obrigatório
- JWT Auth
- RBAC funcional

Regras:
- Não gerar código incompleto
- Não pular validações
- Criar migrations
- Criar script seed.js

Saída esperada:
Projeto compilável com `npm run start:dev`

---

## Prompt 2 — Implementar Módulo de Ordens de Serviço

Objetivo:
Implementar módulo completo:
- Criação OS
- Itens e Combo
- Cálculo total
- Status
- Cancelamento
- Assinatura
- PDF

Regras:
- Aplicar multi-tenant
- Aplicar RBAC
- Aplicar auditoria

---

## Prompt 3 — Implementar Financeiro

Objetivo:
Implementar:
- Pagamentos
- Estorno
- Fechamento de caixa
- Reabertura
- Relatórios básicos

Regras:
- Bloquear edição após fechamento
- Garantir integridade por transação

---

## Prompt 4 — Frontend MVP

Objetivo:
Criar frontend Next.js PWA com:
- Login
- Dashboard
- Nova OS
- Lista OS
- Detalhe OS
- Financeiro
- Cadastros

Regras:
- Mobile-first
- Total visível fixo
- UX rápida

---

## Prompt 5 — Teste Final

Objetivo:
Executar smoke test:
- Criar OS
- Registrar pagamento
- Fechar caixa
- Gerar PDF

Validar:
- Multi-tenant
- RBAC
- Auditoria
- Integridade de dados

---

Fluxo ideal de execução:
1 → 2 → 3 → 4 → 5

Nunca gerar tudo em um único passo.
Sempre validar compilação antes de avançar.

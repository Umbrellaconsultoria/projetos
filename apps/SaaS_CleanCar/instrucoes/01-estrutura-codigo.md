# Estrutura do Código — Padrões e Convenções

Este documento dita a estrutura do monorepo e padrões de implementação para o agente gerar o sistema completo.

## Estrutura do Repositório (Monorepo)

/apps
  /backend
    /src
      /auth
      /tenants
      /unidades
      /usuarios
      /rbac
      /clientes
      /veiculos
      /servicos
      /combos
      /ordens-servico
      /pagamentos
      /financeiro
      /arquivos
      /auditoria
      /common
        /decorators
        /guards
        /interceptors
        /middlewares
        /pipes
        /utils
    prisma/
      schema.prisma
      migrations/
  /frontend
    /src
      /app (ou /pages)
      /components
      /modules
      /lib
      /styles

/docker
  docker-compose.yml

/docs
  00-visao-geral.md
  01-estrutura-codigo.md
  02-guia-testes.md
  03-sql-schema-e-queries.md
  04-funcionalidade-ordem-servico.md
  05-funcionalidade-financeiro-caixa.md
  06-rbac-multi-tenant.md

## Backend — Padrões NestJS

### Camadas
- Controller: valida input, chama Service, retorna DTO
- Service: regra de negócio, transações, chamadas Prisma
- Repository (opcional): para queries mais complexas
- DTOs: validação com class-validator
- Guards: AuthGuard + RbacGuard
- Interceptor: injeta `id_tenant` no contexto e aplica filtros
- Auditoria: registrar mudanças críticas

### Multi-Tenant (Obrigatório)
- Decorator `@TenantId()` obtém id_tenant do request (do token)
- Nenhuma rota recebe `id_tenant` por body/query/params
- Prisma: sempre usar where com `id_tenant`

### RBAC
- JWT contém: `sub` (id_usuario), `id_tenant`, `id_unidade_padrao`, `papeis[]`
- Guard RBAC consulta permissões efetivas do usuário
- Permissões são chaves estáveis (ex: `fechar_caixa`, `editar_precos`)

### Status da OS
Enum:
- ABERTA
- EM_EXECUCAO
- FINALIZADA
- ENTREGUE
- CANCELADA

## Frontend — Padrões Next.js (PWA)

### Páginas/Telas
- /login
- /dashboard
- /ordens-servico/nova
- /ordens-servico
- /ordens-servico/[id]
- /financeiro/caixa
- /cadastros/clientes
- /cadastros/veiculos
- /cadastros/servicos
- /cadastros/combos
- /admin/usuarios
- /admin/unidades
- /admin/papeis-permissoes

### Mobile-first
- Botões grandes
- Total sempre fixo visível na OS
- Campo placa com máscara
- Seleção de serviços/combos otimizada para toque

## Padrões de Erro/Resposta
- 200/201 sucesso
- 400 validação
- 401 não autenticado
- 403 sem permissão
- 404 não encontrado (dentro do tenant)
- 409 conflito (ex: placa duplicada no tenant)
- 500 erro inesperado

Formato padrão (opcional):
{
  "sucesso": true,
  "dados": {...},
  "erros": []
}

## Auditoria (Obrigatório)
Registrar em `logs_auditoria` para:
- cancelamento de OS
- reabertura de caixa
- alteração de preços
- estorno/edição de pagamentos
- alteração de permissões/papéis

Campos: id_tenant, id_usuario, acao, entidade, id_registro, antes_json, depois_json, criado_em

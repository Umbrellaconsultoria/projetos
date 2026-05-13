# RBAC + Multi-Tenant — Implementação Obrigatória

## 1) Multi-Tenant (hard rules)

- JWT deve conter `id_tenant`
- O backend deve derivar `id_tenant` somente do token
- O Prisma/SQL deve sempre filtrar: WHERE id_tenant = tenantDoToken
- Se um ID existir mas for de outro tenant → responder 404 (não 403)

## 2) Papéis e permissões (RBAC)

Permissões (chaves estáveis):
- criar_ordem_servico
- editar_ordem_servico
- alterar_status_ordem_servico
- cancelar_ordem_servico
- visualizar_ordem_servico
- aplicar_desconto_manual
- gerar_pdf_ordem_servico
- registrar_pagamento
- editar_pagamento
- visualizar_financeiro
- fechar_caixa
- reabrir_caixa
- visualizar_relatorios_financeiros
- criar_usuario
- editar_usuario
- desativar_usuario
- gerenciar_papeis
- gerenciar_permissoes
- criar_unidade
- editar_unidade
- visualizar_unidades
- criar_cliente
- editar_cliente
- criar_veiculo
- editar_veiculo
- criar_servico
- editar_servico
- editar_precos
- criar_combo
- editar_combo
- visualizar_relatorios_operacionais
- exportar_relatorios

## 3) Papéis sugeridos (default seed)
- administrador: todas
- gerente: quase todas, sem gerenciar_permissoes (opcional)
- atendente: criar/editar OS, registrar pagamento, gerar PDF
- lavador: visualizar OS, alterar status (EM_EXECUCAO/FINALIZADA)

## 4) Implementação (NestJS)

- AuthGuard: valida JWT
- TenantInterceptor: coloca tenant no request context
- RbacGuard: verifica se usuário tem permissão (via roles do usuário)
- Decorator: @Permissao('fechar_caixa')

## 5) Auditoria
Auditar sempre:
- cancelamento de OS
- estorno de pagamento
- reabrir caixa
- alterar preço
- alterar papéis/permissões

Critérios de aceite:
- alterar preços sem permissão → 403
- acessar OS de outro tenant → 404
- reabrir caixa sem permissão → 403

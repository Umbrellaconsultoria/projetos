# Seed Inicial — Dados Padrão do Sistema

Este arquivo define os dados iniciais obrigatórios para funcionamento do SaaS após migrate.

## Objetivo
Após rodar `prisma migrate deploy` e `node scripts/seed.js`, o sistema deve iniciar com:

- 1 Tenant Demo
- 1 Unidade
- 1 Usuário Administrador
- Papéis padrão
- Permissões padrão
- Serviços e Combos de exemplo

---

## 1) Permissões (Inserir todas)

Lista de chaves obrigatórias:

criar_ordem_servico
editar_ordem_servico
alterar_status_ordem_servico
cancelar_ordem_servico
visualizar_ordem_servico
aplicar_desconto_manual
gerar_pdf_ordem_servico
registrar_pagamento
editar_pagamento
visualizar_financeiro
fechar_caixa
reabrir_caixa
visualizar_relatorios_financeiros
criar_usuario
editar_usuario
desativar_usuario
gerenciar_papeis
gerenciar_permissoes
criar_unidade
editar_unidade
visualizar_unidades
criar_cliente
editar_cliente
criar_veiculo
editar_veiculo
criar_servico
editar_servico
editar_precos
criar_combo
editar_combo
visualizar_relatorios_operacionais
exportar_relatorios

---

## 2) Papéis Padrão

### Administrador
- Todas permissões

### Gerente
- Todas exceto gerenciar_permissoes

### Atendente
- criar_ordem_servico
- editar_ordem_servico
- alterar_status_ordem_servico
- registrar_pagamento
- gerar_pdf_ordem_servico
- visualizar_ordem_servico

### Lavador
- visualizar_ordem_servico
- alterar_status_ordem_servico

---

## 3) Tenant Demo

nome_fantasia: Lavação Demo
telefone: (11) 99999-9999

---

## 4) Unidade Demo

nome: Unidade Centro
ativo: true

---

## 5) Usuário Admin

nome: Admin
email: admin@demo.com
senha: 123456 (hash bcrypt obrigatório)
papel: Administrador

---

## 6) Serviços de Exemplo

Lavagem Simples
Lavagem do Motor
Higienização Bancos
Descontaminação Plásticos

Preços por porte devem ser inseridos automaticamente.

---

## 7) Combos de Exemplo

Bronze
Prata
Ouro

Cada combo deve incluir pelo menos 2 serviços e preço por porte.

---

Critério de aceite:
Após rodar seed:
- Login com admin@demo.com funciona
- Criar OS sem precisar cadastrar nada manualmente

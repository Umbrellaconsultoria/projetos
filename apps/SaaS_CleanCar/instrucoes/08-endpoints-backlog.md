# Backlog de Endpoints + DTOs — Sistema Completo

Este documento lista TODOS os endpoints necessários para o MVP SaaS.

---

# AUTH

POST /auth/login
POST /auth/refresh
POST /auth/logout

---

# TENANT (Admin Global SaaS)

POST /tenants
GET /tenants/:id

---

# UNIDADES

POST /unidades
GET /unidades
PATCH /unidades/:id

---

# USUÁRIOS

POST /usuarios
GET /usuarios
PATCH /usuarios/:id
DELETE /usuarios/:id (soft delete)

---

# PAPÉIS E PERMISSÕES

GET /permissoes
POST /papeis
PATCH /papeis/:id
POST /papeis/:id/permissoes

---

# CLIENTES

POST /clientes
GET /clientes
GET /clientes/:id
PATCH /clientes/:id

---

# VEÍCULOS

POST /veiculos
GET /veiculos?placa=ABC1234
PATCH /veiculos/:id

---

# SERVIÇOS

POST /servicos
GET /servicos
PATCH /servicos/:id

POST /servicos/:id/precos
PATCH /servicos/:id/precos/:precoId

---

# COMBOS

POST /combos
GET /combos
PATCH /combos/:id

POST /combos/:id/itens
POST /combos/:id/precos

---

# ORDENS DE SERVIÇO

POST /ordens-servico
GET /ordens-servico
GET /ordens-servico/:id
PATCH /ordens-servico/:id
PATCH /ordens-servico/:id/status
POST /ordens-servico/:id/cancelar
POST /ordens-servico/:id/assinatura
GET /ordens-servico/:id/pdf

---

# PAGAMENTOS

POST /pagamentos
POST /pagamentos/:id/estornar
GET /pagamentos?data=YYYY-MM-DD&id_unidade=uuid

---

# FINANCEIRO

GET /financeiro/caixa/resumo
POST /financeiro/caixa/fechar
POST /financeiro/caixa/:id/reabrir

---

# RELATÓRIOS (MVP)

GET /relatorios/operacional?data_inicio&data_fim
GET /relatorios/financeiro?data_inicio&data_fim

---

# CRITÉRIOS FINAIS DE ACEITE

✔ Multi-tenant funcionando  
✔ RBAC bloqueando ações indevidas  
✔ OS completa com PDF  
✔ Pagamentos múltiplos por OS  
✔ Fechamento de caixa com bloqueio  
✔ Auditoria funcionando  
✔ Mobile-first operacional  
✔ Banco com índices adequados  
✔ Sem vazamento de dados entre tenants  


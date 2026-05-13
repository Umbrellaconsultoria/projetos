# Guia de Testes — Validação Manual e Scripts

O objetivo é garantir estabilidade do MVP mesmo sem suíte automatizada no início.

## 1) Healthcheck
Endpoint:
GET /ping
Esperado: 200 OK

Curl:
curl -I http://localhost:3001/ping

## 2) Auth
### Login
POST /auth/login
Body:
{
  "email": "admin@empresa.com",
  "senha": "123456"
}

Esperado:
- access_token, refresh_token
- payload do JWT contém id_tenant

### Acesso negado
Chamar rota protegida sem token → 401

### Acesso sem permissão
Chamar rota com token, sem permissão → 403

## 3) Multi-Tenant (teste crítico)
Cenário:
- Tenant A e Tenant B
- Criar cliente no Tenant A
- Logar no Tenant B e tentar acessar o cliente pelo ID
Esperado: 404 (nunca retornar dados de outro tenant)

## 4) Ordens de Serviço
Checklist:
- Criar OS com combo
- Criar OS com serviços avulsos
- Garantir que não permite combo + avulsos ao mesmo tempo
- Assinar na tela e salvar assinatura
- Gerar PDF e validar conteúdo

## 5) Pagamentos
- Registrar pagamento parcial
- Registrar múltiplas formas (pix + dinheiro)
- Validar total pago vs total OS
- Tentar editar pagamento sem permissão → 403

## 6) Fechamento de Caixa
- Registrar pagamentos em um dia
- Fechar caixa do dia (por unidade)
- Tentar editar pagamento após fechamento → 409 ou 403 (definir padrão)
- Reabrir caixa apenas com permissão `reabrir_caixa`

## Scripts sugeridos (Node)
- scripts/check-health.js (ping)
- scripts/seed-dev.js (criar tenant/unidade/admin)
- scripts/smoke-test.js (login → cria cliente → cria OS → paga → fecha caixa)

Critério de aceite:
- smoke-test executa sem falhas em ambiente limpo

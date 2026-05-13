# Funcionalidade — Financeiro (Pagamentos + Fechamento de Caixa)

## Pagamentos

### Registrar pagamento
POST /pagamentos
Permissão: registrar_pagamento

Body:
{
  "id_ordem_servico": "uuid",
  "forma_pagamento": "PIX",
  "valor_centavos": 5000
}

Regras:
- Validar OS pertence ao tenant e unidade do usuário (ou permitir cross-unit com permissão)
- Permitir múltiplos pagamentos por OS
- Não permitir lançar pagamento em OS CANCELADA
- Se caixa do dia FECHADO: bloquear (409) salvo permissão especial (opcional)

### Estornar pagamento
POST /pagamentos/:id/estornar
Permissão: editar_pagamento
Body: { "motivo": "..." }

Regras:
- marcar estornado=true e motivo_estorno
- auditar

## Fechamento de Caixa

### Consultar resumo do dia (pré-fechamento)
GET /financeiro/caixa/resumo?data=YYYY-MM-DD&id_unidade=uuid
Permissão: visualizar_financeiro

Retorna:
- totais por forma de pagamento
- total_esperado
- qtde_os
- cancelamentos

### Fechar caixa
POST /financeiro/caixa/fechar
Permissão: fechar_caixa

Body:
{
  "data_referencia": "2026-02-14",
  "id_unidade": "uuid",
  "total_informado_centavos": 123450,
  "observacoes": "..."
}

Regra:
- total_esperado = soma(pagamentos do dia, não estornados)
- diferenca = informado - esperado
- criar fechamentos_caixa (status=FECHADO)
- auditar

### Reabrir caixa
POST /financeiro/caixa/:id/reabrir
Permissão: reabrir_caixa
Body: { "motivo": "..." }

Regra:
- muda status para ABERTO
- audita

Critérios de aceite:
- fechamento é único por (tenant, unidade, data)
- após FECHADO, bloquear edições críticas sem permissão

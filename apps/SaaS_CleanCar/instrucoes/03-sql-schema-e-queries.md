# SQL — Schema (pt-BR) e Queries Essenciais

Este documento define o schema mínimo (PostgreSQL) e consultas base.
Recomendação: gerar migrations via Prisma. Mesmo assim, manter este doc como referência.

## Tipos/Enums (sugestão)
- porte_veiculo: HATCH_SEDAN | MEDIO | GRANDE
- status_os: ABERTA | EM_EXECUCAO | FINALIZADA | ENTREGUE | CANCELADA
- forma_pagamento: DINHEIRO | PIX | CARTAO_CREDITO | CARTAO_DEBITO | OUTROS
- status_caixa: ABERTO | FECHADO

## Tabelas (mínimo)

### tenants
- id (uuid pk)
- nome_fantasia
- razao_social (null)
- cnpj (null)
- telefone (null)
- criado_em

### unidades
- id (uuid pk)
- id_tenant (fk)
- nome
- endereco (null)
- ativo
- criado_em

### usuarios
- id (uuid pk)
- id_tenant (fk)
- id_unidade_padrao (fk null)
- nome
- email
- telefone (null)
- senha_hash
- ativo
- criado_em

### papeis / permissoes / papel_permissoes / usuario_papeis
- papeis: id, id_tenant, nome
- permissoes: id, chave, descricao
- papel_permissoes: id_papel, id_permissao
- usuario_papeis: id_usuario, id_papel

### clientes
- id, id_tenant, nome, telefone, criado_em

### veiculos
- id, id_tenant, id_cliente, placa, modelo, porte, observacoes

### servicos
- id, id_tenant, nome, descricao, ativo

### servico_precos
- id, id_tenant, id_servico, porte, valor_centavos, atualizado_em

### combos
- id, id_tenant, nome, percentual_marketing (null), ativo

### combo_itens
- id, id_tenant, id_combo, id_servico

### combo_precos
- id, id_tenant, id_combo, porte, valor_centavos

### ordens_servico
- id, id_tenant, id_unidade, id_cliente, id_veiculo
- data (date)
- hora_chegada (time null)
- hora_saida (time null)
- prazo (text null) OU prazo_em (timestamp null)
- status (status_os)
- pertence_valor (boolean)
- descricao_pertences (text null)
- observacoes (text null)
- total_centavos (int)
- desconto_centavos (int default 0)
- motivo_cancelamento (text null)
- id_usuario_criacao
- criado_em

### ordem_servico_itens (avulsos)
- id, id_tenant, id_ordem_servico, id_servico, porte, valor_centavos, quantidade

### ordem_servico_combo
- id, id_tenant, id_ordem_servico, id_combo, porte, valor_centavos

### pagamentos
- id, id_tenant, id_unidade, id_ordem_servico
- forma_pagamento, valor_centavos, pago_em, id_usuario
- estornado (boolean default false), motivo_estorno (text null)

### fechamentos_caixa
- id, id_tenant, id_unidade
- data_referencia (date)
- status (status_caixa)
- total_esperado_centavos
- total_informado_centavos
- diferenca_centavos
- observacoes (text null)
- fechado_em (timestamp null)
- id_usuario_fechamento

### logs_auditoria
- id, id_tenant, id_usuario, acao, entidade, id_registro
- antes_json, depois_json, criado_em

### arquivos (assinaturas/pdfs)
- id, id_tenant
- tipo (ASSINATURA|PDF_OS|OUTRO)
- id_referencia (ex: id_ordem_servico)
- url_arquivo
- criado_em

## Índices obrigatórios
- (id_tenant) em todas as tabelas
- veiculos: (id_tenant, placa) unique
- ordens_servico: (id_tenant, id_unidade, data)
- pagamentos: (id_tenant, id_unidade, pago_em)
- fechamentos_caixa: (id_tenant, id_unidade, data_referencia) unique

## Queries essenciais (SQL puro — referência)

### Total do dia por forma de pagamento (por unidade)
SELECT forma_pagamento, SUM(valor_centavos) total_centavos
FROM pagamentos
WHERE id_tenant = $1
  AND id_unidade = $2
  AND DATE(pago_em) = $3
  AND estornado = false
GROUP BY forma_pagamento;

### Total esperado do caixa (por unidade/dia)
SELECT COALESCE(SUM(valor_centavos),0) total_centavos
FROM pagamentos
WHERE id_tenant = $1
  AND id_unidade = $2
  AND DATE(pago_em) = $3
  AND estornado = false;

### OS do dia (kanban)
SELECT id, status, total_centavos, criado_em
FROM ordens_servico
WHERE id_tenant=$1 AND id_unidade=$2 AND data=$3
ORDER BY criado_em DESC;

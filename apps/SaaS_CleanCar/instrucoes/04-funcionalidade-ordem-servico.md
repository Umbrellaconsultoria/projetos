# Funcionalidade — Ordem de Serviço (OS) + PDF + Assinatura

Este documento descreve o passo a passo para implementar OS como substituição da ficha manual.

## Endpoints (Backend)

### Criar OS
POST /ordens-servico
Permissão: criar_ordem_servico

Body:
{
  "placa": "ABC1D23",
  "cliente": { "nome": "João", "telefone": "..." },         // opcional se placa já existir
  "veiculo": { "modelo": "Onix", "porte": "HATCH_SEDAN" },  // obrigatório se novo
  "data": "2026-02-14",
  "hora_chegada": "09:10",
  "prazo": "até 12:00",
  "observacoes": "..."
  "pertence_valor": true,
  "descricao_pertences": "Notebook na mochila",
  "combo": { "id_combo": "uuid", "porte": "HATCH_SEDAN" }   // OU
  "itens": [
    { "id_servico": "uuid", "porte": "HATCH_SEDAN", "quantidade": 1 }
  ]
}

Regras:
- combo XOR itens (nunca ambos)
- preço é buscado do catálogo (combo_precos ou servico_precos)
- total_centavos = soma/valor_combo - desconto_centavos (se permitido)

Retorno:
201 { id_os, total_centavos, status }

### Alterar status
PATCH /ordens-servico/:id/status
Permissão: alterar_status_ordem_servico
Body: { "status": "EM_EXECUCAO" }

### Cancelar OS
POST /ordens-servico/:id/cancelar
Permissão: cancelar_ordem_servico
Body: { "motivo": "..." }

Regras:
- se tiver pagamentos: estornar (marca estornado) e auditar
- muda status para CANCELADA
- grava motivo_cancelamento
- audita

### Salvar assinatura
POST /ordens-servico/:id/assinatura
Permissão: editar_ordem_servico
Body: multipart/form-data (imagem PNG) OU base64 (canvas)

### Gerar PDF
GET /ordens-servico/:id/pdf
Permissão: gerar_pdf_ordem_servico

Requisitos do PDF:
- Nome/Telefone
- Veículo/Placa/Porte
- Data/Hora chegada/saída/prazo
- Serviços/Combo selecionado
- Total
- Pertences e observações
- Assinatura (se houver)

## Implementação (Backend)

- Ao criar OS:
  1) Resolver veículo por placa dentro do tenant
  2) Se não existir, criar cliente+veículo
  3) Validar combo/itens
  4) Buscar preços (porte obrigatório)
  5) Calcular total e persistir
  6) Registrar auditoria (criação)

- PDF:
  - Gerar no backend (ex: pdfkit/puppeteer)
  - Salvar arquivo em `arquivos` e retornar stream

## Implementação (Frontend)

Tela /ordens-servico/nova:
- Campo placa (primeiro)
- Auto-preenchimento se veículo existente
- Porte com seleção rápida
- Seletor: [Combo] ou [Serviços]
- Total fixo visível
- Campo pertences (sim/não + descrição)
- Assinatura em canvas
- Botões: Salvar | Salvar e Gerar PDF

Critérios de aceite:
- Em 30s o atendente consegue criar OS completa no celular
- PDF corresponde aos dados salvos
- Não permite combo + itens simultaneamente

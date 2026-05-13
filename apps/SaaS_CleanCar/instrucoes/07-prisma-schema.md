# Prisma Schema — Modelo Completo (pt-BR)

Este arquivo define o schema Prisma completo baseado no modelo SaaS multi-tenant.
Todas as entidades possuem `id_tenant` quando aplicável.

## Observações Importantes

- Banco único (multi-tenant por coluna)
- Todos os models de negócio possuem `id_tenant`
- Índices estratégicos já definidos
- Valores monetários sempre em centavos (Int)
- Datas com timezone (DateTime)

---

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum PorteVeiculo {
  HATCH_SEDAN
  MEDIO
  GRANDE
}

enum StatusOS {
  ABERTA
  EM_EXECUCAO
  FINALIZADA
  ENTREGUE
  CANCELADA
}

enum FormaPagamento {
  DINHEIRO
  PIX
  CARTAO_CREDITO
  CARTAO_DEBITO
  OUTROS
}

enum StatusCaixa {
  ABERTO
  FECHADO
}

model Tenant {
  id             String   @id @default(uuid())
  nome_fantasia  String
  razao_social   String?
  cnpj           String?
  telefone       String?
  criado_em      DateTime @default(now())

  unidades       Unidade[]
  usuarios       Usuario[]
  clientes       Cliente[]
  veiculos       Veiculo[]
  servicos       Servico[]
  combos         Combo[]
  ordens         OrdemServico[]
  pagamentos     Pagamento[]
  fechamentos    FechamentoCaixa[]
  logs           LogAuditoria[]
  arquivos       Arquivo[]
}

model Unidade {
  id          String   @id @default(uuid())
  id_tenant   String
  nome        String
  endereco    String?
  ativo       Boolean  @default(true)
  criado_em   DateTime @default(now())

  tenant      Tenant   @relation(fields: [id_tenant], references: [id])
  ordens      OrdemServico[]
  pagamentos  Pagamento[]
  fechamentos FechamentoCaixa[]

  @@index([id_tenant])
}

model Usuario {
  id                String   @id @default(uuid())
  id_tenant         String
  id_unidade_padrao String?
  nome              String
  email             String
  telefone          String?
  senha_hash        String
  ativo             Boolean  @default(true)
  criado_em         DateTime @default(now())

  tenant            Tenant   @relation(fields: [id_tenant], references: [id])
  papeis            UsuarioPapel[]

  @@unique([id_tenant, email])
  @@index([id_tenant])
}

model Papel {
  id         String   @id @default(uuid())
  id_tenant  String
  nome       String
  tenant     Tenant   @relation(fields: [id_tenant], references: [id])
  permissoes PapelPermissao[]
  usuarios   UsuarioPapel[]

  @@index([id_tenant])
}

model Permissao {
  id        String @id @default(uuid())
  chave     String @unique
  descricao String?
  papeis    PapelPermissao[]
}

model PapelPermissao {
  id_papel     String
  id_permissao String

  papel        Papel     @relation(fields: [id_papel], references: [id])
  permissao    Permissao @relation(fields: [id_permissao], references: [id])

  @@id([id_papel, id_permissao])
}

model UsuarioPapel {
  id_usuario String
  id_papel   String

  usuario    Usuario @relation(fields: [id_usuario], references: [id])
  papel      Papel   @relation(fields: [id_papel], references: [id])

  @@id([id_usuario, id_papel])
}

model Cliente {
  id         String   @id @default(uuid())
  id_tenant  String
  nome       String
  telefone   String?
  criado_em  DateTime @default(now())

  tenant     Tenant   @relation(fields: [id_tenant], references: [id])
  veiculos   Veiculo[]
  ordens     OrdemServico[]

  @@index([id_tenant])
}

model Veiculo {
  id          String        @id @default(uuid())
  id_tenant   String
  id_cliente  String
  placa       String
  modelo      String
  porte       PorteVeiculo
  observacoes String?

  tenant      Tenant  @relation(fields: [id_tenant], references: [id])
  cliente     Cliente @relation(fields: [id_cliente], references: [id])
  ordens      OrdemServico[]

  @@unique([id_tenant, placa])
  @@index([id_tenant])
}

model Servico {
  id          String   @id @default(uuid())
  id_tenant   String
  nome        String
  descricao   String?
  ativo       Boolean  @default(true)

  tenant      Tenant   @relation(fields: [id_tenant], references: [id])
  precos      ServicoPreco[]
  combo_itens ComboItem[]

  @@index([id_tenant])
}

model ServicoPreco {
  id              String        @id @default(uuid())
  id_tenant       String
  id_servico      String
  porte           PorteVeiculo
  valor_centavos  Int
  atualizado_em   DateTime      @default(now())

  servico         Servico       @relation(fields: [id_servico], references: [id])

  @@index([id_tenant])
}

model Combo {
  id                   String   @id @default(uuid())
  id_tenant            String
  nome                 String
  percentual_marketing Int?
  ativo                Boolean  @default(true)

  tenant               Tenant   @relation(fields: [id_tenant], references: [id])
  itens                ComboItem[]
  precos               ComboPreco[]

  @@index([id_tenant])
}

model ComboItem {
  id          String  @id @default(uuid())
  id_tenant   String
  id_combo    String
  id_servico  String

  combo       Combo   @relation(fields: [id_combo], references: [id])
  servico     Servico @relation(fields: [id_servico], references: [id])

  @@index([id_tenant])
}

model ComboPreco {
  id             String        @id @default(uuid())
  id_tenant      String
  id_combo       String
  porte          PorteVeiculo
  valor_centavos Int

  combo          Combo         @relation(fields: [id_combo], references: [id])

  @@index([id_tenant])
}

model OrdemServico {
  id                    String      @id @default(uuid())
  id_tenant             String
  id_unidade            String
  id_cliente            String
  id_veiculo            String
  data                  DateTime
  hora_chegada          DateTime?
  hora_saida            DateTime?
  prazo                 String?
  status                StatusOS
  pertence_valor        Boolean
  descricao_pertences   String?
  observacoes           String?
  total_centavos        Int
  desconto_centavos     Int         @default(0)
  motivo_cancelamento   String?
  criado_em             DateTime    @default(now())

  tenant                Tenant      @relation(fields: [id_tenant], references: [id])
  unidade               Unidade     @relation(fields: [id_unidade], references: [id])
  cliente               Cliente     @relation(fields: [id_cliente], references: [id])
  veiculo               Veiculo     @relation(fields: [id_veiculo], references: [id])
  itens                 OrdemServicoItem[]
  combo                 OrdemServicoCombo?
  pagamentos            Pagamento[]

  @@index([id_tenant, id_unidade, data])
}

model OrdemServicoItem {
  id               String @id @default(uuid())
  id_tenant        String
  id_ordem_servico String
  id_servico       String
  porte            PorteVeiculo
  valor_centavos   Int
  quantidade       Int

  ordem            OrdemServico @relation(fields: [id_ordem_servico], references: [id])

  @@index([id_tenant])
}

model OrdemServicoCombo {
  id               String @id @default(uuid())
  id_tenant        String
  id_ordem_servico String
  id_combo         String
  porte            PorteVeiculo
  valor_centavos   Int

  ordem            OrdemServico @relation(fields: [id_ordem_servico], references: [id])

  @@unique([id_ordem_servico])
  @@index([id_tenant])
}

model Pagamento {
  id                String         @id @default(uuid())
  id_tenant         String
  id_unidade        String
  id_ordem_servico  String
  forma_pagamento   FormaPagamento
  valor_centavos    Int
  pago_em           DateTime       @default(now())
  estornado         Boolean        @default(false)
  motivo_estorno    String?

  ordem             OrdemServico   @relation(fields: [id_ordem_servico], references: [id])
  unidade           Unidade        @relation(fields: [id_unidade], references: [id])

  @@index([id_tenant, id_unidade, pago_em])
}

model FechamentoCaixa {
  id                       String      @id @default(uuid())
  id_tenant                String
  id_unidade               String
  data_referencia          DateTime
  status                   StatusCaixa
  total_esperado_centavos  Int
  total_informado_centavos Int
  diferenca_centavos       Int
  observacoes              String?
  fechado_em               DateTime?

  unidade                  Unidade     @relation(fields: [id_unidade], references: [id])

  @@unique([id_tenant, id_unidade, data_referencia])
}

model LogAuditoria {
  id           String   @id @default(uuid())
  id_tenant    String
  id_usuario   String
  acao         String
  entidade     String
  id_registro  String
  antes_json   Json?
  depois_json  Json?
  criado_em    DateTime @default(now())

  tenant       Tenant   @relation(fields: [id_tenant], references: [id])
}

model Arquivo {
  id             String   @id @default(uuid())
  id_tenant      String
  tipo           String
  id_referencia  String
  url_arquivo    String
  criado_em      DateTime @default(now())

  tenant         Tenant   @relation(fields: [id_tenant], references: [id])
}

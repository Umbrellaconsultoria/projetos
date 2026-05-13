# SaaS CleanCar - Backend

Este é o serviço backend do SaaS CleanCar, desenvolvido com [NestJS](https://nestjs.com/) e [Prisma](https://www.prisma.io/). 
O sistema é responsável por toda a lógica de negócios, gestão multilocatário (multi-tenant), processamento de pagamentos do SaaS, segurança com JWT e acesso a banco de dados relacional (PostgreSQL).

## Como iniciar

### Pré-requisitos
- Node.js
- Banco de dados PostgreSQL configurado

### Instalação

```bash
npm install
```

### Configuração do Banco de Dados
Crie um arquivo `.env` na raiz do backend contendo as informações necessárias, como a `DATABASE_URL` (para o Prisma) e `JWT_SECRET`.

Em seguida, execute as migrações:
```bash
npx prisma migrate dev
```

### Executando a API

```bash
# modo de desenvolvimento
npm run start:dev

# modo de produção
npm run start:prod
```

## Estrutura de Módulos

O backend está organizado em vários módulos baseados na arquitetura do NestJS:
- **AuthModule** & **UsuariosModule**: Autenticação, Login e controle de acesso (RBAC).
- **SaasModule** & **FaturasModule**: Gestão financeira das assinaturas e planos do SaaS (para os clientes da matriz).
- **OrdensServicoModule**, **ServicosModule** & **CombosModule**: Lógica central de negócio para lavagens e execução de serviços.
- **TenantsModule**: Isolamento dos dados de diferentes postos e lava a jatos na mesma infraestrutura.

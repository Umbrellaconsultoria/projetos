# SaaS CleanCar 🚗💧

O **SaaS CleanCar** é uma plataforma multilocatário (Multi-Tenant) moderna e escalável, criada com o objetivo de centralizar a gestão e a operação de postos de lavagem automotiva (Lava Jatos).

Este sistema atua como um verdadeiro Software as a Service (SaaS), permitindo que múltiplas empresas de lava jato gerenciem suas filiais, contas, clientes e serviços separadamente, enquanto a "Matriz" provedora do sistema possui painéis globais para gerenciar assinaturas e inadimplência.

---

## 🎯 Objetivos do Projeto

1. **Eficiência Operacional:** Proporcionar um painel único e integrado para empresas gerenciarem clientes, veículos, serviços e pacotes/combos.
2. **Arquitetura Multi-Tenant Seguro:** Isolar completamente os dados de cada locatário (Tenant) usando o padrão de "Tenant ID" no banco de dados, para que um posto jamais veja os dados operacionais do outro.
3. **Gestão do Produto (SaaS):** Fornecer aos desenvolvedores/donos do software as ferramentas para faturar, suspender assinaturas atrasadas, e aprovar o upload de comprovantes (via PIX) sem sair do ambiente.
4. **Customização de Marca:** Permitir que as empresas conectadas exibam suas próprias logomarcas dentro da aplicação usando upload dinâmico.

---

## 🛠 Como foi construído (Stack Tecnológico)

A aplicação segue uma arquitetura híbrida com separação entre a API Backend e o cliente Frontend, unificados em um único repositório para facilidade de manutenção.

### 🌐 Frontend (`apps/frontend`)
- **Framework:** [Next.js (App Router)](https://nextjs.org/) & React.
- **Linguagem:** TypeScript.
- **Destaques:** Componentização rica, sistema de design personalizado com CSS global (variáveis e tokens), Context API para gestão de autenticação (JWT) e proteção de rotas (RBAC).

### ⚙️ Backend (`apps/backend`)
- **Framework:** [NestJS](https://nestjs.com/) (Node.js).
- **Linguagem:** TypeScript.
- **Banco de Dados:** PostgreSQL, orquestrado e tipado através do [Prisma ORM](https://www.prisma.io/).
- **Segurança:** Autenticação via Passport.js com tokens JWT, além de Guards e Interceptors para verificação avançada de papéis (RBAC).
- **Armazenamento:** `Multer` para recebimento de uploads de logomarcas e comprovantes PIX, salvos com gestão de rotas estáticas express.

---

## 📂 Padrão do Repositório

O projeto adota uma estrutura em dois módulos principais:

```text
SaaS_CleanCar/
├── apps/
│   ├── backend/         # Contém toda a API em NestJS
│   │   ├── prisma/      # Schema do banco de dados relacional
│   │   └── src/         # Controladores, Serviços e Módulos do Nest
│   │
│   └── frontend/        # Contém o painel administrativo em Next.js
│       └── src/
│           ├── app/     # Rotas, Views (Telas) e Layouts
│           └── ...
│
├── instrucoes/          # Guias de documentação técnica interna e fluxos
└── README.md            # Este arquivo raiz
```

### Por que esse padrão?
Esse formato visa separar fisicamente os contextos visuais e estruturais, mas agrupar de forma lógica no repositório. Para quem faz a integração local, é bastante simples transitar entre os scripts do banco de dados e os artefatos visuais no Next.

---

## 🚀 Guia de Inicialização Rápida

Consulte os Readmes específicos de cada pasta para os comandos completos de inicialização:
- [Backend README](./apps/backend/README.md)
- [Frontend README](./apps/frontend/README.md)

No geral, você precisará de uma instância Postgres rodando e duas sessões de terminal, executando `npm install` e `npm run dev` na raiz das duas pastas correspondentes.

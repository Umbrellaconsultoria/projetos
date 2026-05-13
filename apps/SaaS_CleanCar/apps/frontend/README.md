# SaaS CleanCar - Frontend

Este é o projeto frontend do SaaS CleanCar, construído com [Next.js](https://nextjs.org), React e TypeScript. 
Ele fornece a interface de usuário para gerenciamento de lava a jato, faturas de SaaS, ordens de serviço, clientes, combos e configurações globais.

## Como iniciar

Primeiro, instale as dependências:

```bash
npm install
```

Para rodar o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) com seu navegador para ver a aplicação em execução.

## Estrutura do Projeto

- `/src/app`: Contém as rotas e páginas da aplicação (arquitetura App Router do Next.js).
  - `(auth)`: Páginas protegidas que exigem autenticação.
  - `(public)`: Telas abertas como Login e Registro.
- `/src/components`: Componentes reutilizáveis de interface.
- `/src/services`: Integrações com a API do backend via Axios.
- `/src/contexts`: Contextos do React, como o gerenciador de Autenticação.

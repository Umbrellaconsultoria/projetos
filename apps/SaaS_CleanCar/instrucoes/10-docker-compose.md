# Docker Compose — Ambiente de Desenvolvimento

Este arquivo define ambiente local completo.

version: "3.9"

services:
  postgres:
    image: postgres:15
    container_name: posto_postgres
    restart: always
    environment:
      POSTGRES_USER: usr_posto
      POSTGRES_PASSWORD: posto12345
      POSTGRES_DB: postodb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./apps/backend
    container_name: lavacao_backend
    restart: always
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://usr_posto:posto12345@postgres:5432/postodb
      JWT_ACCESS_SECRET: secret
      JWT_REFRESH_SECRET: refresh_secret
    ports:
      - "3001:3001"

  frontend:
    build: ./apps/frontend
    container_name: lavacao_frontend
    restart: always
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    ports:
      - "3000:3000"

volumes:
  postgres_data:

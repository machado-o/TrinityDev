# Instruções

## Passo a passo para rodar a aplicação com docker:

Requisitos:
    - Docker Desktop 😁

---

## Criando containers do node, Postgree, pgAdmin e subindo servidor

No terminal digite:

```bash
docker compose up --build -d
```

e só 😁

---

## Acessando pgAdmin via docker

Acesse o pgAdmin no seu navegador: `http://localhost:5050`

Faça o login com o e-mail `admin@admin.com` e a senha `admin`.

1. Clique em `Add New Server`

2. Na aba General:
    Name: `Banco Trinity`

3. Na aba Connection:
    Host: `db`
    Port: `5432`
    Maintenance database: `sav_trinitydev`
    Username: `admin`
    Password: `admin123`

Depois de preencher, é só clicar em `Save`.
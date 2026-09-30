# Vi Agendamentos: front

Front em Angular do app de agendamento para salões. O `docker-compose.yml` do ambiente local fica no repositório vizinho `vi-agendamentos`.

## Rodar

Pelo compose do repositório `vi-agendamentos`:

```powershell
cd ..\vi-agendamentos
docker compose up --build
```

Abra http://localhost:4200. As chamadas `/api` passam pelo proxy do Angular até o serviço `api` do compose.

Quando o `package.json` mudar, apague só o volume do `node_modules` e reconstrua a imagem, para ele nascer de novo:

```powershell
docker compose down
docker volume rm vi-agendamentos_web-node-modules
docker compose up --build
```

Não use `docker compose down -v`: ele apaga todos os volumes, inclusive o banco local.

## Testes

Rodam no Windows, sem contêiner. Pré-requisitos: Node.js 24.15 ou mais novo e Angular CLI 22.

```powershell
ng test --watch=false
```

# Vi Agendamentos: front

Front em Angular do app de agendamento para salões. O `docker-compose.yml` do ambiente local fica no repositório vizinho `vi-agendamentos`.

## Rodar

Pelo compose do repositório `vi-agendamentos`:

```powershell
cd ..\vi-agendamentos
docker compose up --build
```

Abra http://localhost:4200. As chamadas `/api` passam pelo proxy do Angular até o serviço `api` do compose.

Quando o `package.json` mudar, apague os volumes e reconstrua a imagem, para o `node_modules` do contêiner nascer de novo:

```powershell
docker compose down -v
docker compose up --build
```

O `-v` apaga também o cache de pacotes do .NET, que a API baixa de novo na subida seguinte.

## Testes

Rodam no Windows, sem contêiner. Pré-requisitos: Node.js 24.15 ou mais novo e Angular CLI 22.

```powershell
ng test --watch=false
```

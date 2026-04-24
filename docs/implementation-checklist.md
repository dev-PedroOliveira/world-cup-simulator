# Checklist de Implementacao

## Fundacao do projeto

- [x] Criar estrutura inicial de pastas orientada a responsabilidades.
- [x] Criar arquivos-base para `app`, `domain`, `features`, `shared` e `api`.
- [x] Definir o bootstrap real com React.
- [x] Configurar ferramenta de build e scripts do projeto.

## Dominio

- [ ] Definir contratos de `Team`, `Match`, `Group`, `StandingRow`, `Round` e `Tournament`.
- [ ] Criar constantes fixas do torneio.
- [ ] Implementar `drawGroups()`.
- [ ] Implementar `createGroupFixtures()`.
- [ ] Implementar `simulateGroupMatch()`.
- [ ] Implementar `calculateStandings()`.
- [ ] Implementar `resolveGroupTie()`.
- [ ] Implementar `buildRoundOf16()`.
- [ ] Implementar `simulateKnockoutMatch()`.
- [ ] Centralizar aleatoriedade em `randomizer`.

## Estado e orquestracao

- [ ] Definir estado inicial do torneio.
- [ ] Definir actions principais do reducer.
- [ ] Implementar `worldCupReducer`.
- [ ] Implementar contexto e provider.
- [ ] Implementar selectors para evitar acoplamento com a UI.
- [ ] Criar hook de orquestracao para carregar times, simular torneio e enviar resultado.

## API

- [ ] Definir contrato de `GET` das selecoes.
- [ ] Definir contrato de `POST` do resultado final.
- [ ] Implementar cliente HTTP baseado em `fetch`.
- [ ] Implementar mapeamento de DTO externo para entidade interna.
- [ ] Tratar estados de loading, sucesso e erro.

## Interface

- [ ] Criar pagina `Home`.
- [ ] Criar pagina `Groups`.
- [ ] Criar pagina `Knockout`.
- [ ] Criar pagina `Summary`.
- [ ] Criar componentes de exibicao para grupos, partidas, chaveamento e campeao.

## Testes

- [ ] Cobrir geracao dos grupos.
- [ ] Cobrir geracao dos confrontos da fase de grupos.
- [ ] Cobrir classificacao com desempate.
- [ ] Cobrir simulacao do mata-mata com penaltis.
- [ ] Cobrir fluxo principal do torneio com aleatoriedade controlada.

## Documentacao

- [ ] Documentar arquitetura no `README`.
- [ ] Documentar fluxo de simulacao.
- [ ] Documentar criterio de desempate.
- [ ] Documentar decisoes e trade-offs.

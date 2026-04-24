# Simulador de Copa do Mundo

Base React em JavaScript para simular uma Copa do Mundo completa, com foco em separacao entre dominio, estado, integracao com API e interface.

## Estrutura

- `src/app`: bootstrap da aplicacao
- `src/pages`: paginas de alto nivel
- `src/features/world-cup`: orquestracao da feature principal
- `src/domain`: regras puras e entidades
- `src/shared`: utilitarios e constantes compartilhadas
- `src/api`: cliente HTTP e mapeadores
- `src/tests`: testes de dominio e integracao leve
- `docs`: documentacao de apoio

## Rodando o projeto

1. Instale Node.js com `npm`.
2. Execute `npm install`.
3. Execute `npm run dev`.

## Proximos passos

1. Implementar entidades e contratos do dominio.
2. Criar os servicos puros de simulacao.
3. Ligar reducer, contexto e integracao com a API.
4. Construir as telas de grupos, mata-mata e resumo final.

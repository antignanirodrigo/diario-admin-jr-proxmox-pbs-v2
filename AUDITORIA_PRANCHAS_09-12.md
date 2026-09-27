# Auditoria das pranchas 09–12 — módulo 3

Data: 27/09/2026. Oito pranchas ativas em HQ técnica italiana, seis quadros (3 × 2) por prancha. Referência de desenho: pares corrigidos 05–08, com personagens adultos, datacenter azul escuro, tinta de graphic novel e legendas brancas superiores. A primeira prancha desenvolve incidente/conceito; a segunda apresenta evidência/decisão, sem repetir a mesma sequência visual.

| Aula | Prancha 1 | Prancha 2 | Estado preservado |
| --- | --- | --- | --- |
| 09 | VM 201 na vmbr9 isolada; percurso VM–bridge–uplink | `qm config`, interfaces, membros da bridge e ticket | Mudança para vmbr0 proposta; teste ainda pendente |
| 10 | Falha em enp1s0; failover active-backup e dependência do switch | Estado do bond, route, portas e plano | Reparo de enp1s0 e teste remoto pendentes |
| 11 | VM 202 com tag 20 contra policy de VLAN 30 | Policy, `qm config`, bridge VLAN-aware, `bridge vlan show` | Tag 30 proposto; acesso e isolamento ainda não verificados |
| 12 | Gestão bloqueada e rede usuários permitida na 8006 | Nome, route, socket, regra e correção mínima | Testes allow/deny pendentes |

Auditoria de coerência: foram rejeitados/corrigidos IP ilustrado incorreto na 09, marcação de reparo concluído e route inventada na 10, IP errado na 11. A abertura da prancha 2 repetia a pose da prancha 1 nos quatro pares; essas quatro cenas foram revistas e as versões ativas são `aula-09-p2-v2.png` a `aula-12-p2-v2.png`. Nas quatro aulas, personagens e composição foram comparados dentro de cada par. As pranchas continuam protótipos; texto pequeno de interfaces e comandos requer revisão tipográfica determinística antes de comercialização. As saídas canônicas estão nos laboratórios, não nos monitores desenhados.

## 27/09/2026 — Parecer independente Level 99 da prancha 12-2

**REPROVADA; próxima prancha NÃO liberada.** O revisor examinou `assets/aula-12-p2-v2.png` em resolução total, comparou os seis quadros com `assets/aula-12.png`, a aula, o guia de comandos e `PADRAO_PRANCHAS.md`. A prancha 2 repete a sequência DNS → route → LISTEN → auditoria → correção → testes da prancha 1; P1-Q5 e P2-Q5 quase repetem a pose do Sênior. Os personagens preservam a aparência geral, mas isso não compensa a repetição narrativa.

Falhas técnicas bloqueantes: P2-Q1 mostra `getent hosts` sem o FQDN; P2-Q2 adiciona `proto kernel scope link src 10.10.10.12` não presente na saída simulada e infere conectividade remota a partir de rota local; P2-Q3 inventa valores de `Recv-Q`/`Send-Q` e omite o LISTEN IPv6 da aula; P2-Q4 abrevia a saída do relatório; P2-Q5 usa `Modifichiamo` para uma ação apenas proposta; P2-Q6 apresenta `ALLOW`/`DENY` como resultado embora ambos os testes ainda estejam `PENDING`. P1-Q5 também inventa uma regra explícita `BLOCK 10.10.10.0/24` onde o laboratório registra `Input policy: DROP`; P1-Q3 toma rota local como prova de alcance remoto e P1-Q6 usa `Correggiamo` para correção ainda não realizada. A expressão `name resolution` em P2-Q1 deve virar italiano natural, e textos pequenos nos terminais e na tabela carecem de legibilidade.

O par permanece ativo somente como protótipo histórico, **sem aprovação Level 99**. Corrigir as duas pranchas e submetê-las novamente ao revisor antes de gerar a aula 13 ou declarar o par apto para publicação comercial.

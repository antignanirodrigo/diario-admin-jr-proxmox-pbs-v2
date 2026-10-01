# Auditoria Level 99 — aula 16

**Data:** 30/09/2026. **Par ativo naquela data:** `assets/aula-16-p1-v5.png` e `assets/aula-16-p2-v4.png`, 1536 × 1024, seis quadros cada.

O conteúdo inicial foi reprovado por mostrar a sintaxe de criação `local-lvm:cloudinit` como se fosse o volume lido em `qm config` e por não provar limpeza da identidade da base. As saídas agora mostram volumes `vm-230-cloudinit`/`vm-231-cloudinit`; o laboratório exige `cloud-init clean --logs --machine-id` no guest, leitura `uninitialized`, shutdown ordenado e confirmação `stopped` antes do template. O revisor técnico aprovou a nova sequência, guia de opções, ajuda e distinção de clone, snapshot e backup.

A P1 precisou de três correções de caudas de fala nos quadros Q2/Q6 antes de ser aprovada na v5. A primeira P2 foi reprovada porque balões gerados apontavam para telas ou não tinham cauda. A arte base v2 removeu os balões anteriores e recebeu seis balões compostos deterministicamente; P2 v4 e o par foram aprovados. As cenas de conceito e as cenas de execução são distintas, com os mesmos protagonistas e estilo.

**Fatos conferidos:** base 230 running e 560G available em local-lvm antes do clone; `machine-id=uninitialized` antes do shutdown; template 230 e clone completo 231 em local-lvm com `link_down=1`; snapshot local `pre-update` sem RAM. O clone iniciado não prova identidade única do guest. Upgrade, backup externo e restauração não foram executados; as caixas finais permanecem pendentes.

**Verificação:** `npm.cmd test` 25/25, incluindo sequência mutável e ajuda de todos os comandos; página e PNGs HTTP 200 no portal 4170. Risco residual não bloqueante: os monitores desenhados são esquemáticos; saídas literais e validação do guest ficam no laboratório. As aulas anteriores ainda precisam de auditoria editorial do conjunto antes de venda do curso inteiro.

## Reabertura por repetição visual — 01/10/2026

A aprovação de 30/09 foi revogada para uso comercial. Uma auditoria independente comparou as aulas 14–16 e constatou repetição de encenação, embora não houvesse cópia pixel a pixel: júnior com a mão no queixo diante de monitor na abertura; sênior apontando uma tela; dupla diante de checklist. Na própria aula 16, P1-Q3/P2-Q4 repetiam a VM sem rede e P1-Q5/P2-Q3 repetiam o diagrama de clone. O parecer anterior conferiu conteúdo e balões, mas não avaliou suficientemente a sequência editorial entre aulas.

O par foi redesenhado: **P1 `aula-16-p1-v6.png`**, base `aula-16-p1-base-v3.png` e texto vetorial `aula-16-p1-v6.svg`; **P2 `aula-16-p2-v5.png`**, base `aula-16-p2-base-v3.png` e texto vetorial `aula-16-p2-v5.svg`. A P1 troca a abertura por tomada superior com ticket, usa modelos de quatro funções, ação no console, rack frontal e plano longo para o backup pendente. A P2 usa nota de inventário, shutdown na interface virtual, sequência vertical de template/clone, baia QA isolada, detalhe de snapshot local e quadro de pendências. O botão físico de desligamento gerado numa primeira base da P2 foi rejeitado e corrigido antes da composição final.

**Pareceres independentes:** P1 v6 inicialmente REPROVADA por legenda de Q5 com aparência de fala sem personagem e falta de rótulos em Q2; correção para cartão `NOTA TECNICA` e quatro rótulos, seguida de APROVADA. P2 v5 APROVADA. Par P1 v6 + P2 v5 APROVADO após inspeção ampliada e comparação com 14–15. Balões têm caudas atribuíveis; cartões sem personagem são explicitamente narrativos. O backup externo, a identidade do guest e o upgrade continuam pendentes. A aprovação do par não libera comercialmente as aulas 14–15, que ainda exigem avaliação editorial do conjunto.

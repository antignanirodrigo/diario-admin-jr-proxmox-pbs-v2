# Auditoria visual — módulo 2 (aulas 05–08)

**26/09/2026 · Estado: protótipo ilustrado, ainda sem liberação comercial.**

Referência vinculante: as duas pranchas da aula 01 de `CURSO_NETHSERVER_8`, com HQ técnica ilustrada em seis quadros (3 × 2), Júnior e Sênior adultos, rack de datacenter azul, legendas curtas e sequência incidente → análise → decisão → evidência. O curso é Proxmox VE + PBS: elementos da interface, comandos e textos não podem migrar do NS8.

| Aula | Prancha 1 | Prancha 2 | Ponto editorial |
| --- | --- | --- | --- |
| 05 | Bloqueio por AMD-V desativado e checksum divergente | Correção e nova verificação como continuação narrativa | A simulação termina com a instalação suspensa; a segunda prancha antecipa a correção, que não foi executada pelo aluno. |
| 06 | Instalação após correção, dois NVMe em mirror, FQDN e rede de gestão | Acesso HTTPS, identidade do certificado e teste de isolamento | A tela ilustrada não substitui conferência do instalador real nem autoriza ignorar avisos do navegador. |
| 07 | Backup da VM 100 falha; UPID, log e storage | Diagnóstico e sequência de correção/validação | UPIDs, versões, datas e capacidade que apareçam desenhados são exemplos gráficos; a evidência canônica está no laboratório. |
| 08 | Atualização disponível, política de repositórios e janela | Pré-requisitos pendentes e atualização adiada | Nenhum pacote é instalado pelo laboratório. Enterprise e no-subscription não são equivalentes em validação. |

O primeiro conjunto de imagens misturava fotografia e HQ, contrariando a referência NS8. As cenas mais fotográficas foram refeitas com a prancha NS8 como referência direta. Antes de venda/publicação final ainda é necessária revisão tipográfica quadro a quadro e redesenho determinístico das interfaces e comandos: geradores de imagem podem inventar ou alterar números, rótulos e estados de telas. O conteúdo interativo e as respostas do simulador são a fonte didática para os valores exatos; a arte é narrativa.

Critérios para aprovar comercialmente: oito pranchas no mesmo traço, todos os textos italianos revisados por pessoa, valores técnicos coerentes com a aula, nenhuma tela de outro produto, legibilidade em desktop e celular, e revisão de direitos/marcas do material gráfico.

## 27/09/2026 — Correção de continuidade entre prancha 1 e 2

O usuário identificou corretamente que os pares 05–08 pareciam ilustrações de séries diferentes. Auditoria: a prancha 1 usava caixas brancas discretas de legenda no topo dos seis quadros, enquanto a prancha 2 alternava faixas azuis e números grandes; proporções de rosto, traço e iluminação também variavam. As quatro pranchas 2 foram redesenhadas tomando a prancha 1 da **mesma aula** como referência principal. As novas versões `aula-05-p2-hq-v2.png` a `aula-08-p2-hq-v2.png` são as únicas vinculadas às aulas. As versões anteriores permanecem como histórico.

- 05: mantém a instalação suspensa; não apresenta correção concluída que o laboratório não executou.
- 06: mantém pve02.lab.example, 10.10.10.12, dois NVMe de 960 GB e verificação de identidade do certificado antes do login.
- 07: termina com causa documentada e backup ainda pendente, pois o laboratório não cria uma nova cópia.
- 08: mantém repositório inadequado para o laboratório, testes/aviso pendentes e atualização adiada.

Inspeção visual: seis quadros por prancha, mesmo tipo de caixa branca superior, contornos ilustrados, dois personagens adultos, datacenter azul e continuidade do problema de cada aula. **Status: coerência visual aprovada para protótipo; não é homologação comercial.** Textos pequenos dentro das interfaces, datas ilustrativas e legibilidade em dispositivos móveis ainda precisam de composição final determinística e revisão editorial.

## 27/09/2026 — Remoção de repetições nas pranchas 2

A auditoria encontrou cenas ou informações repetidas nas pranchas 2 das aulas 05–08. As versões `aula-05-p2-hq-v3.png` a `aula-08-p2-hq-v3.png` substituem a repetição por uma sequência de continuação: 05 registra os bloqueios e mantém a instalação suspensa; 06 verifica FQDN, bridge, rota e porta 8006, deixando testes remotos pendentes; 07 lê UPID, log e espaço local antes de registrar a correção necessária; 08 registra pré-requisitos e adia a atualização. Também foram revistas as aulas 01–03; a aula 04 foi preservada.

As imagens são narrativas de protótipo. Datas, detalhes de telas e caracteres pequenos gerados na arte não substituem as saídas do laboratório. Para uso comercial, redesenhar interfaces e tipografia de forma determinística e revisar cada valor técnico.

## 27/09/2026 — Comparação das aulas 05–07 com a 08

A prancha 1 original da aula 08 ainda destoava: faces mais caricatas, cenário mais claro e balões maiores que nas aulas 05–07. A primeira candidata alinhou o traço, mas repetiu poses da aula 07 e foi rejeitada. A segunda candidata `aula-08-hq-v2.png` foi ativada: personagens adultos, datacenter escuro e legendas brancas; seis ações próprias da aula 08, com janela futura e atualização adiada. A prancha 2 da aula 08 permaneceu em v3. Status: coerência visual de protótipo; tipografia e detalhes técnicos ainda requerem revisão final.

## 27/09/2026 — Segunda prancha da aula 08 corrigida

O usuário observou que a prancha 2 ainda tinha o desenho antigo. A nova `aula-08-p2-hq-v4.png` usa a prancha 1 ativa como referência direta de personagens, tinta, luz e datacenter. Os seis quadros mostram versão, auditoria do repositório, pacotes atualizáveis, plano de manutenção, risco e ticket de adiamento. A primeira candidata trazia versões de pacotes inventadas e foi corrigida antes da ativação. Status: par visualmente coerente para protótipo, com revisão editorial final pendente.

# Base técnica — aula 17

Fontes primárias consultadas em 01/10/2026:

- [Manual `pct` do Proxmox VE](https://pve.proxmox.com/pve-docs-9-beta/pct.1.html): LXC compartilha o kernel do host Linux; não executa Windows ou FreeBSD como sistema ospite. Contém comandos `pct list` e `pct help` e explica containers não privilegiados.
- [Documentação de LXC do Proxmox VE](https://pve.proxmox.com/pve-docs-9-beta/chapter-pct.html): containers de sistema, namespaces, UID/GID mapping, templates, limites de recursos e recomendação de VM QEMU para application containers como Docker.

No ticket didático, A precisa de Windows e exige VM. B é um serviço Linux simples e fica como **candidato** a LXC não privilegiado, sujeito a teste de template, dependências, rede, storage e backup. C é um stack Docker/OCI, para o qual a documentação PVE recomenda VM. Não afirmar que Docker em LXC é tecnicamente impossível em qualquer configuração; a aula ensina a escolha recomendada para este caso, sem ativar `nesting` ou elevar privilégios por conveniência.

`cat /srv/INF-117-*` lê arquivos inventados para a simulação, explicitamente rotulados. `pct list` e `pveam list local` devem exibir apenas tabelas do nó/storage; a conclusão sobre ausência de CT/template fica fora da saída. Continuidade: a aula 16 observou `local` 99G/100G, com 1G livre. Antes de baixar template na aula 18 é obrigatório medir espaço, liberar capacidade de forma planejada ou usar storage apropriado, sem apagar artefatos ou fingir sucesso.

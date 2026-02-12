# TrinityDev

Sistema de Aluguel de Veiculos

## Grupo: Henrique, Julia e Lorrayne | Tema: Aluguel de Veículos

### Domínio do problema: Sistema de gestão de aluguel de veículos voltado para os funcionários da empresa.

### Processos de negócio:
1. Gestão de Reserva
2. Check-in / Check-out
3. Check-up

### Cadastros:
1. Atendente
2. Cliente
3. Agência
4. Categoria
5. Veículo
6. Seguro

### Regras de Negócio:
1. Reservas com duração a partir de X dias tem desconto
2. A data de check-in e check-out deve ser no horário de funcionamento da agência
3. Cliente/Condutor precisa ter CNH definitiva válida para fazer check-in
4. O carro só pode ser devolvido pelo cliente/condutor que alugou/reservou
5. O check-up deve ser feita no momento do check-in/check-out
6. Multar o cliente caso haja alguma avaria e não tenha sido contratado um seguro que cubra o dano

### Relatórios:
1. Reservas (cliente, categoria, data/hora, valor)
2. Check-up (tipo (check-in ou check-out), Funcionário, Veículo, combustível, pneu, paleta, limpeza, avarias)
3. Agências
4. Seguros
5. Veículos disponíveis
6. Valores de multa

-----------------------------------------------------------------------------------------------------------------------------------------------

# Visão Geral

É proposto o desenvolvimento do Sistema de Aluguel de Veículos (SAV), voltado exclusivamente para os funcionários de uma locadora de veículos. O sistema tem como objetivo informatizar e centralizar os processos de reserva de veículos, check-in, check-out e check-up, garantindo maior controle operacional, rastreabilidade das locações e cumprimento das regras de negócio da empresa.

Deverão ser gerados relatórios relacionados aos cadastros básicos e às operações de reserva, check-up, seguros, veículos disponíveis e valores de multa aplicados.

O sistema deverá aplicar automaticamente descontos para reservas com diárias acima do limite definido, e calcular multas para avarias não cobertas por seguro.

## Abrangência e sistemas relacionados:

### O SAV é um sistema independente e totalmente auto-contido. Suas principais funcionalidades contemplam:
- Gestão de cadastros: funcionários, clientes, agências, categorias de veículos, veículos e seguros.
- Gestão de reservas: criação, consulta e cancelamento de reservas de veículos.
- Check-in / Check-out: registro de retirada e devolução de veículos por clientes.
- Check-up: registro do estado do veículo (combustível, pneus, limpeza, avarias) no momento do check-in e check-out.
- Relatórios: emissão de relatórios gerenciais conforme necessidade da empresa.

### Funcionalidades que não serão implementadas nesta versão:

- Integração com sistemas externos de pagamento (cartão, PIX, etc.).
- Acesso direto pelo cliente via portal web ou aplicativo mobile.
- Gestão de frotas para manutenção preventiva e corretiva de veículos.

## Descrição do cliente:

Mova-se Locadora

Endereço: Rua Pedrinho Salvador, 777

Telefone: (27) 4002-8922

Proprietário: Yudi Tamashiro

## Descrição dos usuários:

Os usuários do SAV são exclusivamente os funcionários da empresa. A seguir estão descritos os perfis de usuário previstos.

### Atendente

Usuário operacional responsável pelo atendimento direto ao cliente. Ele realiza as operações de reserva, check-in, check-out e check-up, além de poder consultar e cadastrar clientes.

### Gerente

Este é o administrador do sistema. Este usuário é o responsável por cadastrar novos Funcionários no sistema assim como também realizar todas as funcionalidades do sistema.

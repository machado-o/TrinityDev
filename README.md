# TrinityDev

Sistema de Aluguel de Veiculos

## Tecnologias

- Node.js + Express
- Sequelize ORM
- Banco relacional (SQLite em teste e Postgres em desenvolvimento/producao)

## Grupo: Henrique, Julia e Lorrayne | Tema: Aluguel de Veículos

### Domínio do problema: Sistema de gestão de aluguel de veículos voltado para os funcionários da empresa.

### Processos de negócio:

1. Reserva
2. Check-in
3. Check-out

### Cadastros:

1. Funcionário
2. Cliente
3. Agência
4. Categoria de Veículo
5. Veículo
6. Seguro

### Regras de Negócio (2 p/ cada processo):

1. Reserva: Reservas com quantidade de dias igual ou superior ao limite configurado pelo Gerente têm desconto automático aplicado sobre o valor total.
2. Reserva: O sistema deve bloquear a criação de reservas para clientes com reservas conflitantes.
3. Check-in: Caso não haja veículos disponíveis da categoria escolhida, o cliente ganha um "upgrade" de categoria gratuitamente.
4. Check-in: Caso constem débitos pendentes de locações anteriores no histórico do cliente, o sistema deve bloquear a liberação do novo veículo.
5. Check-out: A quilometragem do carro deve ser maior à última quilometragem já registrada do veículo.
6. Check-out: Cliente com mais de 3 avarias registradas em locações anteriores, tem taxa de inspeção aplicada.

### Relatórios:

1. Reservas realizadas por funcionário em um período informado. Filtros: Funcionário e Data.
Totalização: Quantidade e valor de reservas realizadas por um funcionário.

2. Reservas por categoria de veículo em um período informado. Filtros: Categoria de Veículo e Data.
Totalização: Quantidade e valor de reservas de uma categoria de veículo.

3. Check-ins realizados por agência em um período informado. Filtros: Agência e Data.
Totalização: Quantidade de check-ins de uma agência. // CLiente com mais check-ins nessa agência?

4. Check-ins agrupados por veículo em um período informado. Filtros: Veículo e Data.
Totalização: Quantidade de check-ins de um veículo. // Funcionário com mais check-ins desse veículo?

5. Check-outs com avarias registradas agrupadas por veículo em um período informado. Filtros: Veículo e Data.
Totalização: Quantidade e valor de avarias de um veículo.

6. Check-outs com multas aplicadas a clientes em um período. Filtros: Cliente e Data.
Totalização: Quantidade e valor de multas de um cliente.

# Visão Geral

É proposto o desenvolvimento do Sistema de Aluguel de Veículos (SAV), voltado exclusivamente para os funcionários de uma locadora de veículos. O sistema tem como objetivo informatizar e centralizar os processos de reserva, check-in e check-out, garantindo maior controle operacional, rastreabilidade das locações e cumprimento das regras de negócio da empresa.

Deverão ser gerados relatórios relacionados aos cadastros básicos e às operações de reserva, check-in e check-out.

O sistema deverá aplicar automaticamente descontos para reservas com diárias acima do limite definido, e calcular multas para avarias não cobertas por seguro.

## Abrangência e sistemas relacionados:

### O SAV é um sistema independente e totalmente auto-contido. Suas principais funcionalidades contemplam:

- Gestão de cadastros: funcionários, clientes, agências, categorias de veículos, veículos e seguros.
- Reservas: criação, consulta e cancelamento de reservas de veículos.
- Check-in: registro de retirada de veículos por clientes.
- Check-out: registro de devolução de veículos por clientes e do estado do veículo.
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

Usuário operacional responsável pelo atendimento direto ao cliente. Ele realiza as operações de reserva, check-in e check-out, além de poder consultar e cadastrar clientes.

### Gerente

Este é o administrador do sistema. Este usuário é o responsável por cadastrar novos Funcionários no sistema assim como também realizar todas as funcionalidades do sistema.

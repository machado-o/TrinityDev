TrinityDev

# SistemaAluguelVeiculos

Grupo: Julia, Lorrayne e Henrique |
Tema: Aluguel de Veículos
-----------------------------------------------------------------------------------------------------------------------------------------------
*Domínio do problema: Sistema de gestão de aluguel de veículos voltado para os funcionários da empresa.

*Processos de negócio:
1. Gestão de Reserva
2. Check-in / Check-out
3. Check-up

*Cadastros:
1. Funcionário
2. Cliente
3. Agências
4. Categoria
5. Veículo
6. Seguros

*Regras de Negócio (2 p/ cada processo):
1. Reservas com diárias a partir de X dias tem desconto
2. A data de check-in e check-out deve ser no horário de funcionamento da agência
3. Cliente/Condutor precisa ter CNH definitiva válida para fazer check-in
4. O carro só pode ser devolvido pelo cliente/condutor que alugou/reservou
5. O check-up deve ser feita no momento do check-in/check-out
6. Multar o cliente caso haja alguma avaria e não tenha sido contratado um seguro que cubra o dano

*Relatórios:
1. Reservas (cliente, Categoria, data/hora, valor)
2. Check-up (tipo (check-in ou check-out), Funcionário, Veículo, combustível, pneu, paleta, limpeza, avarias)
3. Agências
4. Seguros
5. Veículos disponíveis
6. Valores de multa

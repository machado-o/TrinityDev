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




Sistema de Aluguel de Veículos 
Cliente: Mova-se

SAV - Sistema de Aluguel de Veículos 
DOCUMENTO DE REQUISITOS

Versão 1.0







Empresa: <Nome da Empresa>
<site da empresa>
ÍNDICE
1. Introdução 3
1.1 Convenções, termos e abreviações 3
1.1.1 Identificação dos Requisitos 3
1.1.2 Prioridades dos Requisitos 4
2. Visão geral do Produto/serviço 4
2.1 Abrangência e sistemas relacionados 4
2.2 Descrição do cliente 4
2.3 Descrição dos usuários 5
2.3.1 <Nome de um tipo específico de usuário> 5
2.3.2 <Nome de outro tipo específico de usuário > 5
2.3.3 … 5
3. Requisitos funcionais 5
3.1 <Nome de subseção para agrupar requisitos funcionais correlacionados > 5
[RF01] <Nome de requisito funcional> 5
[RF02] <Nome de requisito funcional> 5
3.2 <Nome de outra subseção para agrupar outros requisitos funcionais> 6
4. Requisitos não funcionais (suplementares) 6
4.1 Usabilidade 6
[RNF01] <Nome do requisito> 6
[RNF02] <Nome do requisito> 7
4.2 Confiabilidade 7
[RNF03] <Nome do requisito> 7
4.3 Desempenho 7
[RNF04] <Nome do requisito> 7
4.4 Configurabilidade 7
[RNF05] <Nome do requisito> 7
4.5 Segurança 8
[RNF06] <Nome do requisito> 8
4.6 Implementação 8
[RNF07] <Nome do requisito> 8
4.7 Interface 8
[RNF08] <Nome do requisito> 8
4.8 Empacotamento 8
[RNF09] <Nome do requisito> 8
4.9 Legais 8
[RNF10] <Nome do requisito> 9


1.	Introdução
Este documento especifica os requisitos do Sistema de Aluguel de Veículos (SAV), fornecendo aos desenvolvedores as informações necessárias para a execução de seu projeto e implementação, assim como para a realização dos testes e homologação.
Esta introdução fornece as informações necessárias para fazer um bom uso deste documento, explicitando seus objetivos e as convenções que foram adotadas no texto. As demais seções apresentam a especificação do SAV e estão organizadas como descrito abaixo:
	Seção 2 - Descrição geral do produto/serviço: apresenta uma visão geral do produto/serviço, caracterizando qual é o seu escopo e descrevendo seus usuários.
	Seção 3 - Requisitos funcionais: lista e descreve os requisitos funcionais do produto/serviço, especificando seus objetivos, funcionalidades, atores e prioridades.
	Seção 4 - Requisitos não funcionais: especifica todos os requisitos não funcionais do produto/serviço, divididos em requisitos de usabilidade, confiabilidade, desempenho, segurança, distribuição, adequação a padrões e requisitos de hardware e software.
1.1	Convenções, termos e abreviações
A correta interpretação deste documento exige o conhecimento de algumas convenções e termos específicos, que são descritos a seguir.
1.1.1	Identificação dos Requisitos
Por convenção, a referência a requisitos é feita através do identificador do requisito, de acordo com o esquema abaixo:
[identificador de tipo de requisito.identificador do requisito]
O identificador de tipo de requisito pode ser: 
	RF – requisito funcional 
	RNF – requisito não-funcional
Identificador do requisito é um número, criado sequencialmente, que determina que aquele requisito é único para um determinado tipo de requisito.
Ex: RF001, RF002, RNF001, RNF002.
1.1.2	Campos de Preenchimento Obrigatório
Todos os campos das tabelas identificados com o símbolo (*) serão considerados de preenchimento obrigatório.
1.1.3	Campos de Preenchimento
Todos os campos das tabelas identificados com o símbolo () serão considerados de preenchimento via teclado.
1.1.4	Campos de Seleção
	Todos os campos das tabelas identificados com o símbolo () serão considerados de seleção (por exemplo, via caixa de combinação).
2.	Visão geral do Produto/serviço
O sistema visa informatizar a gestão de aluguel de veículos, focando na operação interna realizada pelos funcionários. O software controlará desde o cadastro da frota e clientes até o fluxo crítico de check-in, check-out e vistorias (check-up). O objetivo é garantir que as regras de negócio (como validade de CNH e aplicação de multas por avarias) sejam cumpridas rigorosamente, otimizando o atendimento nas agências.
2.1	Abrangência e sistemas relacionados
O sistema fornecerá o controle completo de cadastros (clientes, veículos, funcionários), gestão de reservas e controle de estado dos veículos através de check-ups. O sistema não realizará a integração direta com gateways de pagamento bancário nesta versão, sendo o registro de pagamentos realizado manualmente pelo funcionário. O sistema é independente e auto-contido.
2.2	Descrição do cliente
Mova-se Locadora
Endereço: Rua Pedrinho Salvador, 777
Telefone: (27) 4002-8922
Proprietário: Yudi Tamashiro
2.3	Descrição dos usuários
2.3.1	 Funcionário
Usuário operacional responsável pelos cadastros, realização de check-ins, check-outs e vistorias de veículos.
2.3.2	 Gerente
Este é o administrador do sistema. Este usuário é o responsável por cadastrar novos Funcionários no sistema assim como também realizar todas as funcionalidades do sistema.
3.	Requisitos funcionais
<Nesta seção, apresente todos os requisitos funcionais do produto ou serviço. Para facilitar a visualização e entendimento deste documento, você pode agrupar os requisitos funcionais em subseções. >
3.1	<Nome de subseção para agrupar requisitos funcionais correlacionados >
<Utilize este espaço para descrever características comuns dos requisitos funcionais desta seção, explicitando o motivo do seu agrupamento em uma seção única.>
[RF01]	 <Nome de requisito funcional>
Ator: <Nome do Usuário>
<Forneça uma pequena explicação do propósito do requisito funcional (útil quando o nome do requisito não deixa suficientemente claro qual é o seu objetivo). Em seguida, assinale um dos símbolos abaixo para indicar a prioridade do requisito>

Requisitos Não-Funcionais:
1.	<Descrição do Requisito Não Funcional>
2.	<Descrição do Requisito Não Funcional>
3.	...
[RF02]	 <Nome de requisito funcional>
Ator: <Nome do Usuário>
<Utilize os mesmos campos mostrados no bloco anterior para descrever este e os demais requisitos funcionais desta subseção.>

Requisitos Não-Funcionais:
1.	<Descrição do Requisito Não Funcional>
2.	<Descrição do Requisito Não Funcional>
3.	...

3.2	<Nome de outra subseção para agrupar outros requisitos funcionais>
<Prossiga de maneira similar à subseção anterior para descrever quaisquer outras subseções que forem usadas para agrupar requisitos funcionais.>

3.3…
4.	Requisitos não funcionais (suplementares)
<Esta seção deve conter os requisitos não funcionais do sistema. Para uma melhor organização deste documento, utilize as subseções abaixo para agrupar os requisitos não funcionais relacionados.> 
4.1	Usabilidade
<Esta seção descreve os requisitos não funcionais associados a quais fatores humanos estão envolvidos no sistema Que tipo de ajuda o sistema vai prover Quais as formas de documentação ou manuais disponíveis Como esses manuais vão ser produzidos? Que tipo de informação eles vão conter? Seria interessante definir esses tópicos na fase de concepção, visto que o contrato com o cliente deveria especificar muitas dessas questões. >
[RNF01]	<Nome do requisito>
<Forneça uma pequena explicação do propósito do requisito não funcional (útil quando o nome do requisito não deixa suficientemente claro qual é o seu objetivo). Em seguida, assinale um dos símbolos abaixo para indicar a prioridade do requisito>
[RNF02]	<Nome do requisito>
<Utilize os mesmos campos mostrados no bloco anterior para descrever este e os demais requisitos não funcionais de usabilidade.>
4.2	Confiabilidade
<Esta seção descreve os requisitos não funcionais associados a que tipo de tratamento de falhas o sistema vai ter? O analista não é obrigado a produzir um sistema totalmente tolerante a falhas, mas deve estabelecer que tipo de falhas o sistema será capaz de gerenciar: falta de energia, falha de comunicação, falha na mídia de gravação, etc. Não se deve confundir aqui falha com erro de programação, pois erros de programação são elementos que nenhum software deveria conter. As falhas são situações anormais que podem ocorrer mesmo para um software implementado sem nenhum erro de programação.> 
[RNF03]	<Nome do requisito>
<Utilize os mesmos campos mostrados na seção 4.1 para descrever este e os demais requisitos não funcionais de confiabilidade.>
4.3	Desempenho
<Esta seção descreve os requisitos não funcionais associados a que tipo de eficiência e precisão o sistema será capaz de apresentar? Pode-se estabelecer, por exemplo, como requisito de eficiência, que nenhuma consulta à base de dados de cliente s vai demorar mais de cinco segundos. Note que na fase de concepção não se define como o sistema fará para cumprir o requisito, apenas se diz que de alguma forma ele terá de ser cumprido no projeto. Cabe ao projetista e ao programador garantir que o requisito seja satisfeito. Se o analista por algum motivo que o requisito não pode ser cumprido, então o requisito passa a ser um risco do sistema e eventualmente necessitara de um estudo ainda mais aprofundado na fase de concepção, para verificar a possibilidade de sua realização>
[RNF04]	<Nome do requisito>
<Utilize os mesmos campos mostrados na seção 4.1 para descrever este e os demais requisitos não funcionais de desempenho.>
4.4	Configurabilidade
<Esta seção descreve os requisitos não funcionais associados ao que pode ser configurado no sistema? Devem-se definir os elementos que poderão se configurados pelo usuário sem a necessidade de recomplilar o sistema. Exemplos de itens configuráveis são: o tipo de modem, impressoras, a moeda do país, políticas da empresa etc.> 
[RNF05]	<Nome do requisito>
<Utilize os mesmos campos mostrados na seção 4.1 para descrever este e os demais requisitos não funcionais de configurabilidade.>
4.5	Segurança
<Esta seção descreve os requisitos não funcionais associados quais são os tipos de usuários como um requisito suplementar e adicionar um requisito não-funcional de “controle de acesso” a todos os requisitos funcionais evidente, para indicar como o acesso à funções do sistema é controlado..> 
[RNF06]	<Nome do requisito>
<Utilize os mesmos campos mostrados na seção 4.1 para descrever este e os demais requisitos não funcionais de segurança.>
4.6	Implementação
<Esta seção descreve os requisitos não funcionais associados qual linguagem deve ser usada? Por que motivo? Que bibliotecas estarão disponíveis? Quais bancos de dados serão acessíveis?>
[RNF07]	<Nome do requisito>
<Utilize os mesmos campos mostrados na seção 4.1 para descrever este e os demais requisitos não funcionais de implementação.>
4.7	Interface
<Esta seção descreve os requisitos não funcionais associados a como deve ser a interface? Vai ser seguida alguma norma ergonômica?>
[RNF08]	 <Nome do requisito>
<Utilize os mesmos campos mostrados na seção 4.1 para descrever este e os demais requisitos não funcionais de interface.>
4.8	Empacotamento
<Esta seção descreve os requisitos não funcionais associados a forma como o software deve ser entregue ao usuário final?>
[RNF09]	<Nome do requisito>
<Utilize os mesmos campos mostrados na seção 4.1 para descrever este e os demais requisitos não funcionais de empacotamento.>
4.9	Legais
<Esta seção descreve os requisitos não funcionais associados a aspectos legais do desenvolvimento de software. Muitas vezes uma equipe de desenvolvimento deve contar com uma acessória jurídica para saber se está infringindo direitos autorais ou normas especificas da área para a qual o software está sendo desenvolvido >
[RNF10]	<Nome do requisito>
<Utilize os mesmos campos mostrados na seção 4.1 para descrever este e os demais requisitos não funcionais legais.>

            
Representante do contratando         Representante da contratante
                                           


  Testemunha 1    Testemunha 2  

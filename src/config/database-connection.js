import Sequelize from 'sequelize';
import { databaseConfig } from "./database-config.js";

import { Agencia } from '../models/Agencia.js';
import { Avaria } from '../models/Avaria.js';
import { CategoriaVeiculo } from '../models/CategoriaVeiculo.js';
import { Checkin } from '../models/Checkin.js';
import { Checkout } from '../models/Checkout.js';
import { Cliente } from '../models/Cliente.js';
import { Cobertura } from '../models/Cobertura.js';
import { Funcionario } from '../models/Funcionario.js';
import { Multa } from '../models/Multa.js';
import { Reserva } from '../models/Reserva.js';
import { Seguro } from '../models/Seguro.js';
import { Veiculo } from '../models/Veiculo.js';
import * as fs from 'fs';

const sequelize = new Sequelize(databaseConfig);

Agencia.init(sequelize);
Avaria.init(sequelize);
CategoriaVeiculo.init(sequelize);
Checkin.init(sequelize);
Checkout.init(sequelize);
Cliente.init(sequelize);
Cobertura.init(sequelize);
Funcionario.init(sequelize);
Multa.init(sequelize);
Reserva.init(sequelize);
Seguro.init(sequelize);
Veiculo.init(sequelize);

Agencia.associate(sequelize.models);
Avaria.associate(sequelize.models);
CategoriaVeiculo.associate(sequelize.models);
Checkin.associate(sequelize.models);
Checkout.associate(sequelize.models);
Cliente.associate(sequelize.models);
Cobertura.associate(sequelize.models);
Funcionario.associate(sequelize.models);
Multa.associate(sequelize.models);
Reserva.associate(sequelize.models);
Seguro.associate(sequelize.models);
Veiculo.associate(sequelize.models);

databaseInserts();

function databaseInserts() {
    (async () => {

        await sequelize.sync({ force: true }); 

        const agencia1 = await Agencia.create({ nome: "Agência Cachoeiro", endereco: "Avenida Jones dos Santos Neves, 100" });
        const agencia2 = await Agencia.create({ nome: "Agência Vitória", endereco: "Avenida Nossa Senhora da Penha, 500" });

        const func1 = await Funcionario.create({ nome: "Emanuelly", cpf: "111.111.111-11", cargo: "Gerente de Projetos", agenciaId: agencia1.id });
        const func2 = await Funcionario.create({ nome: "Carlos", cpf: "222.222.222-22", cargo: "Atendente", agenciaId: agencia2.id });

        const cliente1 = await Cliente.create({ nome: "Henrique", cpf: "333.333.333-33", email: "henrique@email.com", dataNascimento: "2000-05-15" });
        
        const catHatch = await CategoriaVeiculo.create({ nome: "Hatch Compacto", valorDiaria: 100.00 });
        const catSUV = await CategoriaVeiculo.create({ nome: "SUV Premium", valorDiaria: 350.00 });

        const veiculo1 = await Veiculo.create({ placa: "ABC1D23", chassi: "9BWZZZ37ZVT000001", status: "Disponível", marca: "BYD", modelo: "Dolphin", cor: "Preto", anoFabricacao: "2024", quilometragem: 1500.50, categoriaVeiculoId: catHatch.id, agenciaId: agencia1.id });
        const veiculo2 = await Veiculo.create({ placa: "XYZ9876", chassi: "9BWZZZ37ZVT000002", status: "Disponível", marca: "Jeep", modelo: "Compass", cor: "Branco", anoFabricacao: "2023", quilometragem: 25000.00, categoriaVeiculoId: catSUV.id, agenciaId: agencia1.id });

        const cobRoubo = await Cobertura.create({ nome: "Roubo e Furto", valorIndenizacaoMax: 50000.00 });
        const cobBatida = await Cobertura.create({ nome: "Colisão Total", valorIndenizacaoMax: 80000.00 });
        const cobVidros = await Cobertura.create({ nome: "Danos a Vidros", valorIndenizacaoMax: 2000.00 });

        const seguroOuro = await Seguro.create({ nome: "Plano Ouro", empresaSeguradora: "Porto Seguro", valorDiariaAdicional: 50.00, franquia: 1500.00 });
        const seguroBasico = await Seguro.create({ nome: "Plano Básico", empresaSeguradora: "Allianz", valorDiariaAdicional: 20.00, franquia: 4000.00 });

        await seguroOuro.addCoberturas([cobRoubo, cobBatida, cobVidros]);
        await seguroBasico.addCoberturas([cobRoubo]);

        const reserva1 = await Reserva.create({ dataRetirada: "2026-03-30 08:00:00", dataDevolucao: "2026-04-05 18:00:00", valorDiaria: 350.00, quantidadeDias: 6, valorSeguro: 300.00, valorFinal: 2400.00, clienteId: cliente1.id, categoriaId: catSUV.id, funcionarioId: func1.id, seguroId: seguroOuro.id, agenciaRetiradaId: agencia1.id, agenciaDevolucaoId: agencia1.id });

        const checkin1 = await Checkin.create({ dataCheckin: "2026-03-30", horarioCheckin: "08:15:00", quilometragemCheckin: 25000.00, nivelCombustivel: "Cheio", reservaId: reserva1.id, veiculoId: veiculo2.id, funcionarioId: func1.id });
        
        const avaria1 = await Avaria.create({ nome: "Arranhão na porta", valor: 350.00 });
        
        const checkout1 = await Checkout.create({ dataCheckout: "2026-04-05", horarioCheckout: "17:30:00", quilometragemCheckout: 25400.00, nivelCombustivel: "Metade", limpoInternamente: false, possuiAvarias: true, checkinId: checkin1.id, funcionarioId: func2.id });
        
        await checkout1.addAvarias([avaria1]);

        const multa1 = await Multa.create({ valor: 195.23, dataEmissao: "2026-04-01", descricao: "Excesso de velocidade na rodovia", clienteId: cliente1.id });
    })();
}

export default sequelize;
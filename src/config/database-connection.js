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

        const agencia1 = await Agencia.create({
            nome: "Agência Cachoeiro",
            cnpj: "12.345.678/0001-90",
            endereco: "Avenida Jones dos Santos Neves, 100",
            telefone: "(28) 3333-4444",
            status: "Ativa"
        });
        const agencia2 = await Agencia.create({
            nome: "Agência Vitória",
            cnpj: "98.765.432/0001-10",
            endereco: "Avenida Nossa Senhora da Penha, 500",
            telefone: "(27) 99999-1111",
            status: "Ativa"
        });

        const func1 = await Funcionario.create({
            nome: "Emanuelly",
            cpf: "111.111.111-11",
            cargo: "Gerente",
            dataNascimento: "1990-02-10",
            telefone: "(28) 3333-1111",
            email: "emanuelly@example.com",
            senha: "senha1234",
            agenciaId: agencia1.id
        });
        const func2 = await Funcionario.create({
            nome: "Carlos",
            cpf: "222.222.222-22",
            cargo: "Atendente",
            dataNascimento: "1998-06-20",
            telefone: "(27) 99999-2222",
            email: "carlos@example.com",
            senha: "senha1234",
            agenciaId: agencia2.id
        });

        const cliente1 = await Cliente.create({
            nome: "Henrique",
            cpf: "333.333.333-33",
            email: "henrique@email.com",
            dataNascimento: "2000-05-15",
            telefone: "(28) 3333-2222",
            cnh: "12345678901",
            categoriaCnh: "B",
            validadeCnh: "2030-01-01",
            endereco: "Rua Exemplo, 123"
        });
        
        const catHatch = await CategoriaVeiculo.create({
            nome: "Hatch Compacto",
            valorDiaria: 100.00,
            tipoCarroceria: "Hatch",
            propulsao: "Híbrido",
            cambio: "Automático",
            arCondicionado: true,
            capacidade: 5
        });
        const catSUV = await CategoriaVeiculo.create({
            nome: "SUV Premium",
            valorDiaria: 350.00,
            tipoCarroceria: "SUV",
            propulsao: "Combustão",
            cambio: "Automático",
            arCondicionado: false,
            capacidade: 5
        });

        const veiculo1 = await Veiculo.create({
            placa: "ABC1D23",
            chassi: "9BWZZZ37ZVT000001",
            status: "Disponível",
            marca: "BYD",
            modelo: "Dolphin",
            cor: "Preto",
            anoFabricacao: "2024",
            quilometragem: 1500.50,
            categoriaVeiculoId: catHatch.id
        });
        const veiculo2 = await Veiculo.create({
            placa: "XYZ9876",
            chassi: "9BWZZZ37ZVT000002",
            status: "Disponível",
            marca: "Jeep",
            modelo: "Compass",
            cor: "Branco",
            anoFabricacao: "2023",
            quilometragem: 25000.00,
            categoriaVeiculoId: catSUV.id
        });

        const cobRoubo = await Cobertura.create({
            nome: "Roubo e Furto",
            valorIndenizacaoMax: 50000.00
        });
        const cobBatida = await Cobertura.create({
            nome: "Colisão Total",
            valorIndenizacaoMax: 80000.00
        });
        const cobVidros = await Cobertura.create({
            nome: "Danos a Vidros",
            valorIndenizacaoMax: 2000.00
        });

        const seguroOuro = await Seguro.create({
            nome: "Plano Ouro",
            empresaSeguradora: "Porto Seguro",
            valorDiariaAdicional: 50.00,
            franquia: 1500.00
        });
        const seguroBasico = await Seguro.create({
            nome: "Plano Básico",
            empresaSeguradora: "Allianz",
            valorDiariaAdicional: 20.00,
            franquia: 4000.00
        });

        await seguroOuro.addCoberturas([cobRoubo, cobBatida, cobVidros]);
        await seguroBasico.addCoberturas([cobRoubo]);

        const reserva1 = await Reserva.create({
            dataRetirada: "2026-03-30 08:00:00",
            dataDevolucao: "2026-04-05 18:00:00",
            valorDiaria: 350.00,
            quantidadeDias: 6,
            valorSeguro: 300.00,
            valorFinal: 2400.00,
            clienteId: cliente1.id,
            categoriaVeiculoId: catSUV.id,
            funcionarioId: func1.id,
            seguroId: seguroOuro.id,
            agenciaRetiradaId: agencia1.id,
            agenciaDevolucaoId: agencia1.id
        });

        const checkin1 = await Checkin.create({
            dataCheckin: "2026-03-30",
            horarioCheckin: "08:15",
            quilometragemCheckin: 25000.00,
            cnhCondutor: "12345678901",
            cnhValidade: "2030-01-01",
            reservaId: reserva1.id,
            veiculoId: veiculo2.id,
            funcionarioId: func1.id
        });
        
        const avaria1 = await Avaria.create({
            nome: "Arranhão na porta",
            valor: 350.00
        });
        
        const checkout1 = await Checkout.create({
            dataCheckout: "2026-04-05",
            horarioCheckout: "17:30",
            quilometragemCheckout: 25400.00,
            nivelCombustivel: "Médio",
            condicaoPneus: "Bom",
            condicaoPalhetas: "Boas",
            limpoInternamente: false,
            limpoExternamente: true,
            possuiAvarias: true,
            checkinId: checkin1.id,
            funcionarioId: func2.id
        });
        
        await checkout1.addAvarias([avaria1]);

        // `Multa` não aceita data futura no seed.
        const multa1 = await Multa.create({
            valor: 195.23,
            dataEmissao: "2026-03-20",
            descricao: "Excesso de velocidade na rodovia",
            clienteId: cliente1.id
        });
    })();
}

export default sequelize;
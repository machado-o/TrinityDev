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

        const today = new Date();
        const toDateOnly = (date) => date.toISOString().slice(0, 10);
        const plusDays = (days) => {
            const d = new Date(today);
            d.setDate(d.getDate() + days);
            return d;
        };
        const formatDateTime = (date, hhmm) => `${toDateOnly(date)} ${hhmm}:00`;

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
        const agencia3 = await Agencia.create({
            nome: "Agência Vila Velha",
            cnpj: "45.987.123/0001-77",
            endereco: "Rua Sete de Setembro, 280",
            telefone: "(27) 3322-1100",
            status: "Ativa"
        });
        const agencia4 = await Agencia.create({
            nome: "Agência Serra",
            cnpj: "77.123.456/0001-55",
            endereco: "Avenida Central, 890",
            telefone: "(27) 3344-2233",
            status: "Inativa"
        });

        const func1 = await Funcionario.create({
            nome: "Emanuelly",
            cpf: "111.111.111-11",
            cargo: "Gerente",
            dataNascimento: "1990-02-10",
            telefone: "(28) 3333-1111",
            email: "emanuelly@example.com",
            senha: "Senha@1234",
            agenciaId: agencia1.id
        });
        const func2 = await Funcionario.create({
            nome: "Carlos",
            cpf: "222.222.222-22",
            cargo: "Atendente",
            dataNascimento: "1998-06-20",
            telefone: "(27) 99999-2222",
            email: "carlos@example.com",
            senha: "Senha@1234",
            agenciaId: agencia2.id
        });
        const func3 = await Funcionario.create({
            nome: "Juliana",
            cpf: "444.444.444-44",
            cargo: "Atendente",
            dataNascimento: "1995-11-03",
            telefone: "(27) 98123-4567",
            email: "juliana@example.com",
            senha: "Senha@1234",
            agenciaId: agencia3.id
        });
        const func4 = await Funcionario.create({
            nome: "Rafael",
            cpf: "555.555.555-55",
            cargo: "Gerente",
            dataNascimento: "1987-09-12",
            telefone: "(27) 98888-1212",
            email: "rafael@example.com",
            senha: "Senha@1234",
            agenciaId: agencia4.id
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
        const cliente2 = await Cliente.create({
            nome: "Marina",
            cpf: "666.666.666-66",
            email: "marina@email.com",
            dataNascimento: "1997-08-22",
            telefone: "(27) 97777-6666",
            cnh: "23456789012",
            categoriaCnh: "AB",
            validadeCnh: "2029-12-31",
            endereco: "Rua das Flores, 50"
        });
        const cliente3 = await Cliente.create({
            nome: "Paulo",
            cpf: "777.777.777-77",
            email: "paulo@email.com",
            dataNascimento: "1992-03-09",
            telefone: "(27) 96666-4444",
            cnh: "34567890123",
            categoriaCnh: "B",
            validadeCnh: "2031-06-10",
            endereco: "Av. Beira Mar, 900"
        });
        const cliente4 = await Cliente.create({
            nome: "Renata",
            cpf: "888.888.888-88",
            email: "renata@email.com",
            dataNascimento: "1989-12-30",
            telefone: "(28) 95555-3333",
            cnh: "45678901234",
            categoriaCnh: "D",
            validadeCnh: "2028-04-25",
            endereco: "Rua Santa Clara, 18"
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
            arCondicionado: true,
            capacidade: 5
        });
        const catSedan = await CategoriaVeiculo.create({
            nome: "Sedan Executivo",
            valorDiaria: 220.00,
            tipoCarroceria: "Sedan",
            propulsao: "Elétrico",
            cambio: "Automático",
            arCondicionado: true,
            capacidade: 5
        });
        const catPicape = await CategoriaVeiculo.create({
            nome: "Picape Utilitária",
            valorDiaria: 280.00,
            tipoCarroceria: "Picape",
            propulsao: "Combustão",
            cambio: "Manual",
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
            placa: "XYZ9A87",
            chassi: "9BWZZZ37ZVT000002",
            status: "Disponível",
            marca: "Jeep",
            modelo: "Compass",
            cor: "Branco",
            anoFabricacao: "2023",
            quilometragem: 25000.00,
            categoriaVeiculoId: catSUV.id
        });
        const veiculo3 = await Veiculo.create({
            placa: "QWE2R34",
            chassi: "9BWZZZ37ZVT000003",
            status: "Reservado",
            marca: "Toyota",
            modelo: "Corolla",
            cor: "Prata",
            anoFabricacao: "2022",
            quilometragem: 31000.10,
            categoriaVeiculoId: catSedan.id
        });
        const veiculo4 = await Veiculo.create({
            placa: "RTY4U56",
            chassi: "9BWZZZ37ZVT000004",
            status: "Manutenção",
            marca: "Fiat",
            modelo: "Toro",
            cor: "Cinza",
            anoFabricacao: "2021",
            quilometragem: 40210.45,
            categoriaVeiculoId: catPicape.id
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
        const cobTerceiros = await Cobertura.create({
            nome: "Danos a Terceiros",
            valorIndenizacaoMax: 100000.00
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
        const seguroPrata = await Seguro.create({
            nome: "Plano Prata",
            empresaSeguradora: "Bradesco Seguros",
            valorDiariaAdicional: 35.00,
            franquia: 2500.00
        });
        const seguroPlus = await Seguro.create({
            nome: "Plano Plus",
            empresaSeguradora: "Tokio Marine",
            valorDiariaAdicional: 60.00,
            franquia: 1000.00
        });

        await seguroOuro.addCoberturas([cobRoubo, cobBatida, cobVidros, cobTerceiros]);
        await seguroBasico.addCoberturas([cobRoubo]);
        await seguroPrata.addCoberturas([cobRoubo, cobBatida]);
        await seguroPlus.addCoberturas([cobRoubo, cobBatida, cobTerceiros]);

        const reserva1 = await Reserva.create({
            dataRetirada: formatDateTime(plusDays(2), "08:00"),
            dataDevolucao: formatDateTime(plusDays(6), "18:00"),
            valorDiaria: 350.00,
            quantidadeDias: 4,
            valorSeguro: 240.00,
            valorFinal: 1640.00,
            clienteId: cliente1.id,
            categoriaVeiculoId: catSUV.id,
            funcionarioId: func1.id,
            seguroId: seguroOuro.id,
            agenciaRetiradaId: agencia1.id,
            agenciaDevolucaoId: agencia1.id
        });
        const reserva2 = await Reserva.create({
            dataRetirada: formatDateTime(plusDays(3), "09:30"),
            dataDevolucao: formatDateTime(plusDays(7), "17:30"),
            valorDiaria: 100.00,
            quantidadeDias: 4,
            valorSeguro: 80.00,
            valorFinal: 480.00,
            clienteId: cliente2.id,
            categoriaVeiculoId: catHatch.id,
            funcionarioId: func2.id,
            seguroId: seguroBasico.id,
            agenciaRetiradaId: agencia2.id,
            agenciaDevolucaoId: agencia3.id
        });
        const reserva3 = await Reserva.create({
            dataRetirada: formatDateTime(plusDays(4), "10:00"),
            dataDevolucao: formatDateTime(plusDays(9), "16:00"),
            valorDiaria: 220.00,
            quantidadeDias: 5,
            valorSeguro: 175.00,
            valorFinal: 1275.00,
            clienteId: cliente3.id,
            categoriaVeiculoId: catSedan.id,
            funcionarioId: func3.id,
            seguroId: seguroPrata.id,
            agenciaRetiradaId: agencia3.id,
            agenciaDevolucaoId: agencia2.id
        });
        const reserva4 = await Reserva.create({
            dataRetirada: formatDateTime(plusDays(5), "07:45"),
            dataDevolucao: formatDateTime(plusDays(8), "15:15"),
            valorDiaria: 280.00,
            quantidadeDias: 3,
            valorSeguro: 180.00,
            valorFinal: 1020.00,
            clienteId: cliente4.id,
            categoriaVeiculoId: catPicape.id,
            funcionarioId: func4.id,
            seguroId: seguroPlus.id,
            agenciaRetiradaId: agencia4.id,
            agenciaDevolucaoId: agencia4.id
        });

        const checkin1 = await Checkin.create({
            dataCheckin: toDateOnly(plusDays(2)),
            horarioCheckin: "08:10",
            quilometragemCheckin: 25000.00,
            cnhCondutor: cliente1.cnh,
            cnhValidade: cliente1.validadeCnh,
            reservaId: reserva1.id,
            veiculoId: veiculo2.id,
            funcionarioId: func1.id
        });
        const checkin2 = await Checkin.create({
            dataCheckin: toDateOnly(plusDays(3)),
            horarioCheckin: "09:40",
            quilometragemCheckin: 1600.00,
            cnhCondutor: cliente2.cnh,
            cnhValidade: cliente2.validadeCnh,
            reservaId: reserva2.id,
            veiculoId: veiculo1.id,
            funcionarioId: func2.id
        });
        const checkin3 = await Checkin.create({
            dataCheckin: toDateOnly(plusDays(4)),
            horarioCheckin: "10:20",
            quilometragemCheckin: 31200.00,
            cnhCondutor: cliente3.cnh,
            cnhValidade: cliente3.validadeCnh,
            reservaId: reserva3.id,
            veiculoId: veiculo3.id,
            funcionarioId: func3.id
        });
        const checkin4 = await Checkin.create({
            dataCheckin: toDateOnly(plusDays(5)),
            horarioCheckin: "08:00",
            quilometragemCheckin: 40300.00,
            cnhCondutor: cliente4.cnh,
            cnhValidade: cliente4.validadeCnh,
            reservaId: reserva4.id,
            veiculoId: veiculo4.id,
            funcionarioId: func4.id
        });

        const avaria1 = await Avaria.create({
            nome: "Arranhão na porta",
            valor: 350.00
        });
        const avaria2 = await Avaria.create({
            nome: "Parachoque trincado",
            valor: 900.00
        });
        const avaria3 = await Avaria.create({
            nome: "Retrovisor quebrado",
            valor: 450.00
        });
        const avaria4 = await Avaria.create({
            nome: "Lanterna traseira queimada",
            valor: 180.00
        });

        const checkout1 = await Checkout.create({
            dataCheckout: toDateOnly(plusDays(6)),
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
        const checkout2 = await Checkout.create({
            dataCheckout: toDateOnly(plusDays(7)),
            horarioCheckout: "16:45",
            quilometragemCheckout: 1880.00,
            nivelCombustivel: "Alto",
            condicaoPneus: "Regular",
            condicaoPalhetas: "Boas",
            limpoInternamente: true,
            limpoExternamente: true,
            possuiAvarias: true,
            checkinId: checkin2.id,
            funcionarioId: func1.id
        });
        const checkout3 = await Checkout.create({
            dataCheckout: toDateOnly(plusDays(9)),
            horarioCheckout: "15:10",
            quilometragemCheckout: 31800.00,
            nivelCombustivel: "Baixo",
            condicaoPneus: "Ruim",
            condicaoPalhetas: "Ressecadas",
            limpoInternamente: false,
            limpoExternamente: false,
            possuiAvarias: true,
            checkinId: checkin3.id,
            funcionarioId: func4.id
        });
        const checkout4 = await Checkout.create({
            dataCheckout: toDateOnly(plusDays(8)),
            horarioCheckout: "14:50",
            quilometragemCheckout: 40900.00,
            nivelCombustivel: "Vazio",
            condicaoPneus: "Furado",
            condicaoPalhetas: "Quebradas",
            limpoInternamente: true,
            limpoExternamente: false,
            possuiAvarias: true,
            checkinId: checkin4.id,
            funcionarioId: func3.id
        });

        await checkout1.addAvarias([avaria1]);
        await checkout2.addAvarias([avaria2]);
        await checkout3.addAvarias([avaria3]);
        await checkout4.addAvarias([avaria4]);

        await Multa.create({
            valor: 195.23,
            dataEmissao: "2024-03-20",
            descricao: "Excesso de velocidade na rodovia",
            clienteId: cliente1.id
        });
        await Multa.create({
            valor: 320.00,
            dataEmissao: "2024-02-11",
            descricao: "Avanço de sinal vermelho",
            clienteId: cliente2.id
        });
        await Multa.create({
            valor: 88.50,
            dataEmissao: "2023-12-05",
            descricao: "Estacionamento irregular",
            clienteId: cliente3.id
        });
        await Multa.create({
            valor: 540.90,
            dataEmissao: "2024-01-17",
            descricao: "Ultrapassagem em local proibido",
            clienteId: cliente4.id
        });
    })();
}

export default sequelize;
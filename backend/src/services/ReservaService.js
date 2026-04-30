import { Op } from "sequelize";
import { Reserva } from "../models/Reserva.js";
import { Agencia } from "../models/Agencia.js";
import { CategoriaVeiculo } from "../models/CategoriaVeiculo.js";
import { Seguro } from "../models/Seguro.js";
import { Cliente } from "../models/Cliente.js";
import { Funcionario } from "../models/Funcionario.js";
import { validarModel } from "./_validarModel.js";

// Regra 1: desconto aplicado apenas por agências com histórico operacional comprovado (mínimo 2 reservas concluídas)
async function calcularValoresFinanceiros({ agenciaRetiradaId, categoria, seguro, dataRetirada, dataDevolucao }) {
  const quantidadeDias = Math.ceil((new Date(dataDevolucao) - new Date(dataRetirada)) / (1000 * 60 * 60 * 24));
  const valorDiaria = categoria ? parseFloat(categoria.valorDiaria) : null;
  const valorDiariaSeguro = seguro ? parseFloat(seguro.valorDiariaAdicional) : 0;
  const diasValidos = isNaN(quantidadeDias) ? 0 : quantidadeDias;
  const valorSeguro = parseFloat((valorDiariaSeguro * diasValidos).toFixed(2));

  let valorFinal = valorDiaria !== null
    ? parseFloat(((valorDiaria + valorDiariaSeguro) * quantidadeDias).toFixed(2))
    : null;

  if (valorFinal !== null && agenciaRetiradaId) {
    // JOIN Agencia → reservas concluídas: valida histórico operacional antes de aplicar o desconto
    const agencia = await Agencia.findOne({
      where: { id: agenciaRetiradaId },
      include: [{
        model: Reserva,
        as: 'reservasRetirada',
        required: false,
        where: { status: 'Concluída' },
        attributes: ['id'],
      }],
    });

    if (agencia) {
      const reservasConcluidas = agencia.reservasRetirada.length;
      const limite = agencia.limiteDiasDesconto;
      const percentualDesconto = parseFloat(agencia.percentualDesconto);

      if (reservasConcluidas >= 2 && quantidadeDias >= limite) {
        const desconto = valorFinal * (percentualDesconto / 100);
        valorFinal = parseFloat((valorFinal - desconto).toFixed(2));
      }
    }
  }

  return { quantidadeDias, valorDiaria, valorSeguro, valorFinal };
}

// Regra 2: cliente não pode ter reserva ativa conflitante no mesmo período
async function validarConflitoReservaCliente(clienteId, dataRetirada, dataDevolucao, erros, excludeId = null) {
  const where = {
    clienteId,
    status: { [Op.notIn]: ['Cancelada', 'Concluída'] },
    [Op.and]: [
      { dataRetirada: { [Op.lt]: dataDevolucao } },
      { dataDevolucao: { [Op.gt]: dataRetirada } },
    ],
  };
  if (excludeId) where.id = { [Op.ne]: excludeId };

  const conflito = await Reserva.findOne({ where });
  if (conflito) erros.push("O cliente já possui uma reserva no período solicitado!");
}

// Regra: data de retirada não pode ser no passado
function validarDataRetirada(dataRetirada, erros) {
  if (new Date(dataRetirada) < new Date()) erros.push("A data de retirada não pode ser no passado!");
}

// Regra: agência de retirada deve existir e estar ativa
function validarAgenciaRetirada(agenciaRetirada, erros) {
  if (!agenciaRetirada) erros.push("Agência de retirada não encontrada!");
  else if (agenciaRetirada.status === 'Inativa') erros.push("A agência de retirada está inativa e não pode receber reservas!");
}

// Regra: agência de devolução deve existir e estar ativa
function validarAgenciaDevolucao(agenciaDevolucao, erros) {
  if (!agenciaDevolucao) erros.push("Agência de devolução não encontrada!");
  else if (agenciaDevolucao.status === 'Inativa') erros.push("A agência de devolução está inativa e não pode receber reservas!");
}

// Orquestra todas as validações de negócio para create e update
async function verificarRegrasDeNegocio({ dataRetirada, dataDevolucao, clienteId, agenciaRetiradaId, agenciaDevolucaoId, reservaId, erros }) {
  if (dataRetirada) validarDataRetirada(dataRetirada, erros);

  const [agenciaRetirada, agenciaDevolucao] = await Promise.all([
    agenciaRetiradaId ? Agencia.findByPk(agenciaRetiradaId) : Promise.resolve(undefined),
    agenciaDevolucaoId ? Agencia.findByPk(agenciaDevolucaoId) : Promise.resolve(undefined),
  ]);

  if (agenciaRetiradaId !== undefined) validarAgenciaRetirada(agenciaRetirada, erros);
  if (agenciaDevolucaoId !== undefined) validarAgenciaDevolucao(agenciaDevolucao, erros);

  if (clienteId && dataRetirada && dataDevolucao) {
    await validarConflitoReservaCliente(clienteId, dataRetirada, dataDevolucao, erros, reservaId ?? null);
  }
}

class ReservaService {

  static async findAll() {
    return await Reserva.findAll({ include: { all: true } });
  }

  static async findByPk(req) {
    const { id } = req.params;
    return await Reserva.findByPk(id, { include: { all: true } });
  }

  static async create(req) {
    const { dataRetirada, dataDevolucao, clienteId, categoriaVeiculoId, funcionarioId, seguroId, agenciaRetiradaId, agenciaDevolucaoId } = req.body;
    const erros = [];

    const [cliente, funcionario, categoria] = await Promise.all([
      Cliente.findByPk(clienteId),
      Funcionario.findByPk(funcionarioId),
      CategoriaVeiculo.findByPk(categoriaVeiculoId),
    ]);

    if (!cliente) erros.push("Cliente não encontrado!");
    if (!funcionario) erros.push("Funcionário não encontrado!");
    if (!categoria) erros.push("Categoria de veículo não encontrada!");

    let seguro = null;
    if (seguroId) {
      seguro = await Seguro.findByPk(seguroId);
      if (!seguro) erros.push("Seguro não encontrado!");
    }

    await verificarRegrasDeNegocio({ dataRetirada, dataDevolucao, clienteId, agenciaRetiradaId, agenciaDevolucaoId, erros });

    const { quantidadeDias, valorDiaria, valorSeguro, valorFinal } = await calcularValoresFinanceiros({ agenciaRetiradaId, categoria, seguro, dataRetirada, dataDevolucao });

    erros.push(...await validarModel(Reserva.build({ dataRetirada, dataDevolucao })));

    if (erros.length > 0) throw erros.join(" ");

    const obj = await Reserva.create({
      dataRetirada, dataDevolucao, valorDiaria, quantidadeDias, valorSeguro, valorFinal,
      clienteId, categoriaVeiculoId, funcionarioId, seguroId, agenciaRetiradaId, agenciaDevolucaoId,
    });
    return await Reserva.findByPk(obj.id, { include: { all: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { dataRetirada, dataDevolucao, valorDiaria, quantidadeDias, valorSeguro, valorFinal, clienteId, categoriaVeiculoId, funcionarioId, seguroId, agenciaRetiradaId, agenciaDevolucaoId } = req.body;

    const obj = await Reserva.findByPk(id, { include: { all: true } });
    if (obj == null) throw "Reserva não encontrada!";

    const erros = [];

    const clienteFinal = clienteId ?? obj.clienteId;
    const retiradaFinal = dataRetirada ?? obj.dataRetirada;
    const devolucaoFinal = dataDevolucao ?? obj.dataDevolucao;

    await verificarRegrasDeNegocio({
      dataRetirada: dataRetirada !== undefined ? retiradaFinal : undefined,
      dataDevolucao: devolucaoFinal,
      clienteId: clienteFinal,
      agenciaRetiradaId: agenciaRetiradaId,
      agenciaDevolucaoId: agenciaDevolucaoId,
      reservaId: id,
      erros,
    });

    const patch = { dataRetirada, dataDevolucao, valorDiaria, quantidadeDias, valorSeguro, valorFinal, clienteId, categoriaVeiculoId, funcionarioId, seguroId, agenciaRetiradaId, agenciaDevolucaoId };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);

    erros.push(...await validarModel(obj));

    if (erros.length > 0) throw erros.join(" ");

    await obj.save({ validate: false });
    return await Reserva.findByPk(obj.id, { include: { all: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Reserva.findByPk(id);
    if (obj == null) throw "Reserva não encontrada!";
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover esta reserva pois está vinculada a outros registros.";
    }
  }
}

export { ReservaService };

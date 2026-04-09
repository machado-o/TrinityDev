import { Op } from "sequelize";
import { Reserva } from "../models/Reserva.js";
import { Agencia } from "../models/Agencia.js";

class ReservaService {

  static async findAll() {
    const objs = await Reserva.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Reserva.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const {
      dataRetirada,
      dataDevolucao,
      valorDiaria,
      quantidadeDias,
      valorSeguro,
      valorFinal,
      clienteId,
      categoriaVeiculoId,
      funcionarioId,
      seguroId,
      agenciaRetiradaId,
      agenciaDevolucaoId,
    } = req.body;

    // Regra 2: Bloquear reservas conflitantes para o mesmo cliente
    const conflito = await Reserva.findOne({
      where: {
        clienteId,
        [Op.and]: [
          { dataRetirada: { [Op.lt]: dataDevolucao } },
          { dataDevolucao: { [Op.gt]: dataRetirada } },
        ],
      },
    });
    if (conflito) throw "O cliente já possui uma reserva no período solicitado!";

    // Regra 1: Desconto automático se quantidadeDias >= limiteDiasDesconto da agência
    const agencia = await Agencia.findByPk(agenciaRetiradaId);
    if (!agencia) throw "Agência de retirada não encontrada!";

    let valorFinalCalculado = parseFloat(valorFinal);
    if (quantidadeDias >= agencia.limiteDiasDesconto) {
      const desconto = valorFinalCalculado * (parseFloat(agencia.percentualDesconto) / 100);
      valorFinalCalculado = parseFloat((valorFinalCalculado - desconto).toFixed(2));
    }

    const obj = await Reserva.create({
      dataRetirada,
      dataDevolucao,
      valorDiaria,
      quantidadeDias,
      valorSeguro,
      valorFinal: valorFinalCalculado,
      clienteId,
      categoriaVeiculoId,
      funcionarioId,
      seguroId,
      agenciaRetiradaId,
      agenciaDevolucaoId,
    });

    return await Reserva.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const {
      dataRetirada,
      dataDevolucao,
      valorDiaria,
      quantidadeDias,
      valorSeguro,
      valorFinal,
      clienteId,
      categoriaVeiculoId,
      funcionarioId,
      seguroId,
      agenciaRetiradaId,
      agenciaDevolucaoId,
    } = req.body;

    const obj = await Reserva.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw "Reserva não encontrada!";

    // Regra 2: Bloquear reservas conflitantes para o mesmo cliente (excluindo a reserva atual)
    const clienteFinal = clienteId !== undefined ? clienteId : obj.clienteId;
    const retiradaFinal = dataRetirada !== undefined ? dataRetirada : obj.dataRetirada;
    const devolucaoFinal = dataDevolucao !== undefined ? dataDevolucao : obj.dataDevolucao;

    const conflito = await Reserva.findOne({
      where: {
        clienteId: clienteFinal,
        id: { [Op.ne]: id },
        [Op.and]: [
          { dataRetirada: { [Op.lt]: devolucaoFinal } },
          { dataDevolucao: { [Op.gt]: retiradaFinal } },
        ],
      },
    });
    if (conflito) throw "O cliente já possui uma reserva no período solicitado!";

    const patch = {
      dataRetirada,
      dataDevolucao,
      valorDiaria,
      quantidadeDias,
      valorSeguro,
      valorFinal,
      clienteId,
      categoriaVeiculoId,
      funcionarioId,
      seguroId,
      agenciaRetiradaId,
      agenciaDevolucaoId,
    };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();

    return await Reserva.findByPk(obj.id, { include: { all: true, nested: true } });
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

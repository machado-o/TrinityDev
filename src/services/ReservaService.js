import { Op } from "sequelize";
import { Reserva } from "../models/Reserva.js";
import { Agencia } from "../models/Agencia.js";
import { CategoriaVeiculo } from "../models/CategoriaVeiculo.js";
import { Seguro } from "../models/Seguro.js";

class ReservaService {

  static async findAll() {
    const objs = await Reserva.findAll({ include: { all: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Reserva.findByPk(id, { include: { all: true } });
    return obj;
  }

  static async create(req) {
    const {
      dataRetirada,
      dataDevolucao,
      clienteId,
      categoriaVeiculoId,
      funcionarioId,
      seguroId,
      agenciaRetiradaId,
      agenciaDevolucaoId,
    } = req.body;

    // Item 2: Validação de data futura
    if (new Date(dataRetirada) < new Date()) throw "A data de retirada não pode ser no passado!";

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

    // Item 14: Verificar se agências estão ativas
    const agencia = await Agencia.findByPk(agenciaRetiradaId);
    if (!agencia) throw "Agência de retirada não encontrada!";
    if (agencia.status === 'Inativa') throw "A agência de retirada está inativa e não pode receber reservas!";

    const agenciaDevolucao = await Agencia.findByPk(agenciaDevolucaoId);
    if (!agenciaDevolucao) throw "Agência de devolução não encontrada!";
    if (agenciaDevolucao.status === 'Inativa') throw "A agência de devolução está inativa e não pode receber reservas!";

    // Item 6: Calcular campos financeiros a partir das entidades associadas
    const categoria = await CategoriaVeiculo.findByPk(categoriaVeiculoId);
    if (!categoria) throw "Categoria de veículo não encontrada!";

    const quantidadeDias = Math.ceil((new Date(dataDevolucao) - new Date(dataRetirada)) / (1000 * 60 * 60 * 24));
    const valorDiaria = parseFloat(categoria.valorDiaria);

    let valorDiariaSeguro = 0;
    if (seguroId) {
      const seguro = await Seguro.findByPk(seguroId);
      if (!seguro) throw "Seguro não encontrado!";
      valorDiariaSeguro = parseFloat(seguro.valorDiariaAdicional);
    }

    const valorSeguro = parseFloat((valorDiariaSeguro * quantidadeDias).toFixed(2));
    let valorFinal = parseFloat(((valorDiaria + valorDiariaSeguro) * quantidadeDias).toFixed(2));

    // Regra 1: Desconto automático se quantidadeDias >= limiteDiasDesconto da agência
    if (quantidadeDias >= agencia.limiteDiasDesconto) {
      const desconto = valorFinal * (parseFloat(agencia.percentualDesconto) / 100);
      valorFinal = parseFloat((valorFinal - desconto).toFixed(2));
    }

    const obj = await Reserva.create({
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
    });

    return await Reserva.findByPk(obj.id, { include: { all: true } });
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

    const obj = await Reserva.findByPk(id, { include: { all: true } });
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

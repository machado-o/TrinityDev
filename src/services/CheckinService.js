import { Op } from "sequelize";
import { Checkin } from "../models/Checkin.js";
import { Reserva } from "../models/Reserva.js";
import { Veiculo } from "../models/Veiculo.js";
import { CategoriaVeiculo } from "../models/CategoriaVeiculo.js";
import { Multa } from "../models/Multa.js";

class CheckinService {

  static async findAll() {
    const objs = await Checkin.findAll({ include: { all: true, nested: false } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Checkin.findByPk(id, { include: { all: true, nested: false } });
    return obj;
  }

  static async create(req) {
    const {
      dataCheckin,
      horarioCheckin,
      cnhCondutor,
      cnhValidade,
      quilometragemCheckin,
      reservaId,
      veiculoId,
      funcionarioId,
    } = req.body;

    const reserva = await Reserva.findByPk(reservaId);
    if (!reserva) throw "Reserva nÃ£o encontrada!";

    // Regra 4: Bloquear check-in se o cliente tiver dÃ©bitos pendentes
    const debitosPendentes = await Multa.count({
      where: { clienteId: reserva.clienteId, status: "Pendente" },
    });
    if (debitosPendentes > 0)
      throw "O cliente possui dÃ©bitos pendentes e nÃ£o pode realizar o check-in!";

    // Regra 3: Verificar disponibilidade na categoria da reserva e aplicar upgrade se necessÃ¡rio
    const veiculosNaCategoria = await Veiculo.findAll({
      where: { categoriaVeiculoId: reserva.categoriaVeiculoId, status: "DisponÃ­vel" },
    });

    let veiculoFinalId = veiculoId;

    if (veiculosNaCategoria.length === 0) {
      // Nenhum veÃ­culo disponÃ­vel na categoria solicitada â€” buscar upgrade pela prÃ³xima categoria (ID maior)
      const categoriasSuperiores = await CategoriaVeiculo.findAll({
        where: { id: { [Op.gt]: reserva.categoriaVeiculoId } },
        order: [["id", "ASC"]],
      });

      let veiculoUpgrade = null;
      for (const cat of categoriasSuperiores) {
        veiculoUpgrade = await Veiculo.findOne({
          where: { categoriaVeiculoId: cat.id, status: "DisponÃ­vel" },
        });
        if (veiculoUpgrade) break;
      }

      if (!veiculoUpgrade)
        throw "NÃ£o hÃ¡ veÃ­culos disponÃ­veis para esta reserva e nÃ£o foi possÃ­vel realizar upgrade de categoria!";

      veiculoFinalId = veiculoUpgrade.id;
    } else {
      // HÃ¡ veÃ­culos na categoria â€” validar o veÃ­culo informado
      if (!veiculoId) throw "Informe o veÃ­culo para realizar o check-in!";

      const veiculoSolicitado = await Veiculo.findByPk(veiculoId);
      if (!veiculoSolicitado) throw "VeÃ­culo nÃ£o encontrado!";
      if (veiculoSolicitado.status !== "DisponÃ­vel")
        throw "O veÃ­culo selecionado nÃ£o estÃ¡ disponÃ­vel!";
      if (veiculoSolicitado.categoriaVeiculoId !== reserva.categoriaVeiculoId)
        throw "O veÃ­culo selecionado nÃ£o pertence Ã  categoria da reserva!";
    }

    const obj = await Checkin.create({
      dataCheckin,
      horarioCheckin,
      cnhCondutor,
      cnhValidade,
      quilometragemCheckin,
      reservaId,
      veiculoId: veiculoFinalId,
      funcionarioId,
    });

    return await Checkin.findByPk(obj.id, { include: { all: true, nested: false } });
  }

  static async update(req) {
    const { id } = req.params;
    const {
      dataCheckin,
      horarioCheckin,
      cnhCondutor,
      cnhValidade,
      quilometragemCheckin,
      reservaId,
      veiculoId,
      funcionarioId,
    } = req.body;

    const obj = await Checkin.findByPk(id, { include: { all: true, nested: false } });
    if (obj == null) throw "Checkin nÃ£o encontrado!";

    const patch = {
      dataCheckin,
      horarioCheckin,
      cnhCondutor,
      cnhValidade,
      quilometragemCheckin,
      reservaId,
      veiculoId,
      funcionarioId,
    };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();

    return await Checkin.findByPk(obj.id, { include: { all: true, nested: false } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Checkin.findByPk(id);
    if (obj == null) throw "Checkin nÃ£o encontrado!";
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "NÃ£o Ã© possÃ­vel remover este checkin pois estÃ¡ vinculado a outros registros.";
    }
  }

}

export { CheckinService };

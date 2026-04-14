import { Op } from "sequelize";
import sequelize from "../config/database-connection.js";
import { Checkout } from "../models/Checkout.js";
import { Checkin } from "../models/Checkin.js";
import { Reserva } from "../models/Reserva.js";
import { Avaria } from "../models/Avaria.js";
import { Veiculo } from "../models/Veiculo.js";

const TAXA_INSPECAO = 150.00;

class CheckoutService {

  static async findAll() {
    const objs = await Checkout.findAll({ include: { all: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Checkout.findByPk(id, { include: { all: true } });
    return obj;
  }

  static async create(req) {
    const { dataCheckout, quilometragemCheckout, nivelCombustivel,
            condicaoPneus, condicaoPalhetas, limpoInternamente, limpoExternamente,
            observacoes, checkinId, funcionarioId, avariaIds } = req.body;

    const checkin = await Checkin.findByPk(checkinId);
    if (!checkin) throw "Check-in não encontrado!";

    // Regra 5: Quilometragem do checkout deve ser maior que a do checkin
    if (parseFloat(quilometragemCheckout) <= parseFloat(checkin.quilometragemCheckin)) {
      throw "A quilometragem de devolução deve ser maior que a quilometragem registrada no check-in!";
    }

    // Regra 6: Taxa de inspeção para clientes com mais de 3 avarias em locações anteriores
    const reserva = await Reserva.findByPk(checkin.reservaId);
    const clienteId = reserva.clienteId;

    // Buscar todos os checkins anteriores deste cliente
    const checkinsAnteriores = await Checkin.findAll({
      include: [{
        model: Reserva,
        as: "reserva",
        required: true,
        where: { clienteId },
        attributes: [],
      }],
      attributes: ["id"],
    });

    const checkinIds = checkinsAnteriores.map((c) => c.id);

    // Contar total de avarias nos checkouts anteriores
    let totalAvariasAnteriores = 0;
    if (checkinIds.length > 0) {
      const checkoutsAnteriores = await Checkout.findAll({
        where: { checkinId: { [Op.in]: checkinIds } },
        include: [{ model: Avaria, as: "avarias" }],
      });
      for (const co of checkoutsAnteriores) {
        totalAvariasAnteriores += co.avarias.length;
      }
    }

    const taxaInspecao = totalAvariasAnteriores > 3 ? TAXA_INSPECAO : 0.00;

    return await sequelize.transaction(async (t) => {
      const obj = await Checkout.create({ dataCheckout, quilometragemCheckout,
              nivelCombustivel, condicaoPneus, condicaoPalhetas, limpoInternamente,
              limpoExternamente, observacoes, checkinId, funcionarioId,
              taxaInspecao }, { transaction: t });

      if (avariaIds) await obj.setAvarias(avariaIds, { transaction: t });

      // Item 10: Atualizar status do veículo para 'Disponível'
      const veiculo = await Veiculo.findByPk(checkin.veiculoId, { transaction: t });
      veiculo.status = 'Disponível';
      await veiculo.save({ transaction: t });

      // Item 11: Atualizar status da reserva para 'Concluída'
      reserva.status = 'Concluída';
      await reserva.save({ transaction: t });

      return await Checkout.findByPk(obj.id, { include: { all: true }, transaction: t });
    });
  }

  static async update(req) {
    const { id } = req.params;
    const { dataCheckout, quilometragemCheckout, nivelCombustivel,
            condicaoPneus, condicaoPalhetas, limpoInternamente, limpoExternamente,
            observacoes, checkinId, funcionarioId, avariaIds } = req.body;

    const obj = await Checkout.findByPk(id, { include: { all: true } });
    if (obj == null) throw 'Checkout não encontrado!';

    // Regra 5: Validar quilometragem se estiver sendo atualizada
    if (quilometragemCheckout !== undefined) {
      const checkinRef = await Checkin.findByPk(checkinId !== undefined ? checkinId : obj.checkinId);
      if (parseFloat(quilometragemCheckout) <= parseFloat(checkinRef.quilometragemCheckin)) {
        throw "A quilometragem de devolução deve ser maior que a quilometragem registrada no check-in!";
      }
    }

    return await sequelize.transaction(async (t) => {
      const patch = {
        dataCheckout,
        quilometragemCheckout,
        nivelCombustivel,
        condicaoPneus,
        condicaoPalhetas,
        limpoInternamente,
        limpoExternamente,
        observacoes,
        checkinId,
        funcionarioId,
      };
      Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
      Object.assign(obj, patch);
      await obj.save({ transaction: t });

      if (avariaIds !== undefined) await obj.setAvarias(avariaIds, { transaction: t });

      return await Checkout.findByPk(obj.id, { include: { all: true }, transaction: t });
    });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Checkout.findByPk(id);
    if (obj == null) throw 'Checkout não encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover este checkout pois ele está vinculado a um checkin!";
    }
  }

}

export { CheckoutService };

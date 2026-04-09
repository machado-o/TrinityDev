import { Op } from "sequelize";
import { Checkout } from "../models/Checkout.js";
import { Checkin } from "../models/Checkin.js";
import { Reserva } from "../models/Reserva.js";
import { Avaria } from "../models/Avaria.js";

const TAXA_INSPECAO = 150.00;

class CheckoutService {

  static async findAll() {
    const objs = await Checkout.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Checkout.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { dataCheckout, horarioCheckout, quilometragemCheckout, nivelCombustivel,
            condicaoPneus, condicaoPalhetas, limpoInternamente, limpoExternamente,
            possuiAvarias, observacoes, checkinId, funcionarioId, avariaIds } = req.body;

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

    const obj = await Checkout.create({ dataCheckout, horarioCheckout, quilometragemCheckout,
            nivelCombustivel, condicaoPneus, condicaoPalhetas, limpoInternamente,
            limpoExternamente, possuiAvarias, observacoes, checkinId, funcionarioId,
            taxaInspecao });

    if (avariaIds) await obj.setAvarias(avariaIds);

    return await Checkout.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { dataCheckout, horarioCheckout, quilometragemCheckout, nivelCombustivel,
            condicaoPneus, condicaoPalhetas, limpoInternamente, limpoExternamente,
            possuiAvarias, observacoes, checkinId, funcionarioId, avariaIds } = req.body;

    const obj = await Checkout.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Checkout não encontrado!';

    // Regra 5: Validar quilometragem se estiver sendo atualizada
    if (quilometragemCheckout !== undefined) {
      const checkinRef = await Checkin.findByPk(checkinId !== undefined ? checkinId : obj.checkinId);
      if (parseFloat(quilometragemCheckout) <= parseFloat(checkinRef.quilometragemCheckin)) {
        throw "A quilometragem de devolução deve ser maior que a quilometragem registrada no check-in!";
      }
    }

    const patch = {
      dataCheckout,
      horarioCheckout,
      quilometragemCheckout,
      nivelCombustivel,
      condicaoPneus,
      condicaoPalhetas,
      limpoInternamente,
      limpoExternamente,
      possuiAvarias,
      observacoes,
      checkinId,
      funcionarioId,
    };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    Object.assign(obj, patch);
    await obj.save();

    if (avariaIds !== undefined) await obj.setAvarias(avariaIds);

    return await Checkout.findByPk(obj.id, { include: { all: true, nested: true } });
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

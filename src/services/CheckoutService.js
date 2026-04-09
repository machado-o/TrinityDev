import { Checkout } from "../models/Checkout.js";

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

    const obj = await Checkout.create({ dataCheckout, horarioCheckout, quilometragemCheckout,
            nivelCombustivel, condicaoPneus, condicaoPalhetas, limpoInternamente,
            limpoExternamente, possuiAvarias, observacoes, checkinId, funcionarioId });

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
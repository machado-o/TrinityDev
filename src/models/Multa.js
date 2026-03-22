import { Model, DataTypes } from 'sequelize';

class Multa extends Model {

  static init(sequelize) {
    super.init({
      valor: { 
        type: DataTypes.FLOAT, 
        allowNull: false,
        validate: {
          notEmpty: { msg: "O valor da multa deve ser preenchido!" },
          min: { args: [0.01], msg: "O valor da multa deve ser maior que zero!" }
        }
      },
      emissaoMulta: { 
        type: DataTypes.DATE, 
        allowNull: false,
        validate: {
          notEmpty: { msg: "A data de emissão da multa deve ser preenchida!" },
          isDate: { msg: "Data de emissão inválida!" }
        }
      }
    }, { sequelize, modelName: 'multa', tableName: 'multas' })
  }

  static associate(models) {
    this.belongsTo(models.Cliente, {
        as: 'cliente',
        foreignKey: {
            name: 'clienteId',
            allowNull: false
        }
    });
  }
}

export { Multa };
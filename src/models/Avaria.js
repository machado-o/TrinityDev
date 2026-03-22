import { Model, DataTypes } from 'sequelize';

class Avaria extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "O nome/descrição da avaria deve ser preenchido!" },
          len: { args: [3, 100], msg: "A descrição da avaria deve ter entre 3 e 100 caracteres!" }
        }
      },
      valor: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: { msg: "O valor da avaria deve ser um número válido!" },
          min: { args: [0], msg: "O valor cobrado pela avaria não pode ser negativo!" }
        }
      }
    }, { sequelize, modelName: 'avaria', tableName: 'avarias' });
  }

  static associate(models) {
    this.belongsTo(models.Checkout, {
      foreignKey: { 
        name: 'checkoutId', 
        allowNull: false
      },
      as: 'checkout'
    });
  }
}

export { Avaria };
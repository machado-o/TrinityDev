//Complemento de Checkout
//Julia, Lorrayne e Henrique
import { Model, DataTypes } from 'sequelize';

class Avaria extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O nome da avaria deve ser preenchido!" },
          notEmpty: { msg: "O nome/descrição da avaria deve ser preenchido!" },
          len: { args: [1, 50], msg: "A descrição da avaria deve ter entre 1 e 50 caracteres!" }
        }
      },
      valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "O valor da avaria deve ser preenchido!" },
          isDecimal: { msg: "O valor da avaria deve ser um número decimal válido!" },
          min: { args: [0], msg: "O valor cobrado pela avaria não pode ser negativo!" }
        }
      }
    }, { sequelize, modelName: 'avaria', tableName: 'avarias' });
  }
  static associate(models) {
    this.belongsToMany(models.checkout, {
      as: 'checkouts',
      through: 'checkout_avaria',
      foreignKey: { 
        name: 'avariaId', 
        allowNull: false,
        validate: {
          notNull: { msg: "A avaria deve estar associada a um checkout!" }
        }
      },
      otherKey: {
        name: 'checkoutId',
        allowNull: false,
        validate: {
          notNull: { msg: "O checkout deve estar associado a uma avaria!" }
        }
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
}

export { Avaria };
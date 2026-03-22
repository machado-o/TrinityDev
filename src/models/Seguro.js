import { Model, DataTypes } from 'sequelize';

class Seguro extends Model {
  static init(sequelize) {
    super.init({
      nomePlano: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "O nome do plano deve ser preenchido!" },
          len: { args: [3, 100], msg: "O nome do plano deve ter entre 3 e 100 caracteres!" }
        }
      },
      empresaSeguradora: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "A empresa seguradora deve ser preenchida!" },
          len: { args: [2, 100], msg: "O nome da seguradora deve ter pelo menos 2 caracteres!" }
        }
      },
      descricao: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "A descrição do seguro não pode ficar vazia!" },
          len: { args: [10, 500], msg: "Forneça uma descrição mais detalhada (mínimo de 10 caracteres)." }
        }
      },
      valorDiarioAdicional: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: { msg: "O valor diário deve ser um número válido!" },
          min: { args: [0], msg: "O valor diário adicional não pode ser negativo!" }
        }
      },
      franquia: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: { msg: "O valor da franquia deve ser um número válido!" },
          min: { args: [0], msg: "O valor da franquia não pode ser negativo!" }
        }
      }
    }, { sequelize, modelName: 'seguro', tableName: 'seguros' });
  }

  static associate(models) {
    this.hasMany(models.Cobertura, {
      foreignKey: {
        name: 'seguroId',
        allowNull: false
      },
      as: 'coberturas'
    });
  }
}

export { Seguro };
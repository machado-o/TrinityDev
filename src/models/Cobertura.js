import { Model, DataTypes } from 'sequelize';

class Cobertura extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "O nome da cobertura deve ser preenchido!" },
          len: { args: [3, 100], msg: "O nome da cobertura deve ter entre 3 e 100 caracteres!" }
        }
      },
      descricao: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "A descrição da cobertura deve ser preenchida!" }
        }
      }
    }, { sequelize, modelName: 'cobertura', tableName: 'coberturas' });
  }

  static associate(models) {
    this.belongsTo(models.Seguro, {
      foreignKey: {
        name: 'seguroId',
        allowNull: false
      },
      as: 'seguro'
    });
  }
}

export { Cobertura };
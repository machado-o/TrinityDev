import { Model, DataTypes } from 'sequelize';

class Cobertura extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O nome da cobertura deve ser preenchido!" },
          notEmpty: { msg: "O nome da cobertura deve ser preenchido!" },
          len: { args: [1, 50], msg: "O nome da cobertura deve ter entre 1 e 50 caracteres!" }
        }
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: { args: [0, 1000], msg: "A descrição da cobertura deve ter no máximo 1000 caracteres!" }
        }
      },
      valorIndenizacaoMax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "O valor máximo de indenização da cobertura deve ser preenchido!" },
          isDecimal: { msg: "O valor máximo de indenização da cobertura deve ser um número decimal válido!" },
          min: { args: [0], msg: "O valor máximo de indenização da cobertura deve ser um número positivo!" }
        }
      }
    }, { sequelize, modelName: 'cobertura', tableName: 'coberturas' });
  }
  static associate(models) {
    this.belongsToMany(models.seguro, {
      as: 'seguros',
      through: 'seguro_cobertura',
      foreignKey: {
        name: 'coberturaId',
        allowNull: false,
        validate: {
          notNull: { msg: "A cobertura deve estar associada a um seguro!" }
        }
      },
      otherKey: {
        name: 'seguroId',
        allowNull: false,
        validate: {
          notNull: { msg: "O seguro deve estar associado a uma cobertura!" }
        }
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
}

export { Cobertura };
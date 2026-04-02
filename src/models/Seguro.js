//Julia
import { Model, DataTypes } from 'sequelize';

class Seguro extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O nome do plano de seguro deve ser preenchido!" },
          notEmpty: { msg: "O nome do plano deve ser preenchido!" },
          len: { args: [1, 50], msg: "O nome do plano deve ter entre 1 e 50 caracteres!" }
        }
      },
      empresaSeguradora: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "A empresa seguradora deve ser preenchida!" },
          notEmpty: { msg: "A empresa seguradora deve ser preenchida!" },
          len: { args: [1, 50], msg: "O nome da empresa seguradora deve ter entre 1 e 50 caracteres!" }
        }
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: { args: [0, 1000], msg: "A descrição do seguro deve ter entre 0 e 1000 caracteres!" }
        }
      },
      valorDiariaAdicional: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "O valor diário adicional do seguro deve ser preenchido!" },
          isDecimal: { msg: "O valor da diária adicional deve ser um número válido!" },
          min: { args: [0], msg: "O valor diário adicional não pode ser negativo!" }
        }
      },
      franquia: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "O valor da franquia do seguro deve ser preenchido!" },
          isDecimal: { msg: "O valor da franquia deve ser um número válido!" },
          min: { args: [0], msg: "O valor da franquia não pode ser negativo!" }
        }
      }
    }, { sequelize, modelName: 'seguro', tableName: 'seguros' });
  }
  static associate(models) {
    this.belongsToMany(models.cobertura, {
      as: 'coberturas',
      through: 'seguro_cobertura',
      foreignKey: {
        name: 'seguroId',
        allowNull: false,
        validate: {
          notNull: { msg: "O seguro deve estar associado a uma cobertura!" }
        }
      },
      otherKey: {
        name: 'coberturaId',
        allowNull: false,
        validate: {
          notNull: { msg: "A cobertura deve estar associada a um seguro!" }
        }
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    this.hasMany(models.reserva, {
      as: 'reservas',
      foreignKey: 'seguroId',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  }
}

export { Seguro };
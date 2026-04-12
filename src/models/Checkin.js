// Lorrayne
import { Model, DataTypes } from 'sequelize';

class Checkin extends Model {
  static init(sequelize) {
    super.init({
      dataCheckin: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "A data/hora do check-in deve ser preenchida!" },
          isDate: { msg: "Data/hora de check-in inválida!" }
        }
      },
      cnhCondutor: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "A CNH do condutor no momento da retirada é obrigatória!" },
          notEmpty: { msg: "A CNH do condutor no momento da retirada é obrigatória!" },
          len: { args: [11, 11], msg: "A CNH do condutor deve conter exatamente 11 caracteres!" },
          is: { args: /^\d{11}$/, msg: "A CNH do condutor deve conter apenas números!" }
        }
      },
      cnhValidade: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: { msg: "A validade da CNH do condutor é obrigatória!" },
          isDate: { msg: "Data de validade da CNH inválida!" },
          isValidDate(value) {
            const hoje = new Date().toISOString().split('T')[0];
            if (value < hoje) {
              throw new Error("A validade da CNH do condutor não pode ser no passado!");
            }
          }
        }
      },
      quilometragemCheckin: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "A quilometragem de saída deve ser preenchida!" },
          isDecimal: { msg: "A quilometragem de saída deve ser um número decimal válido!" },
          min: { args: [0], msg: "A quilometragem de saída não pode ser negativa!" }
        }
      }
    }, { sequelize, modelName: 'checkin', tableName: 'checkins' });
  }
  static associate(models) {
    this.belongsTo(models.reserva, {
      as: 'reserva',
      foreignKey: {
        name: 'reservaId',
        allowNull: false,
        validate: {
          notNull: { msg: "O check-in deve estar associado a uma reserva!" }
        }
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    this.belongsTo(models.veiculo, {
      as: 'veiculo',
      foreignKey: {
        name: 'veiculoId',
        allowNull: false,
        validate: {
          notNull: { msg: "O check-in deve estar associado a um veículo!" }
        }
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    this.belongsTo(models.funcionario, {
      as: 'funcionario',
      foreignKey: {
        name: 'funcionarioId',
        allowNull: false,
        validate: {
          notNull: { msg: "O check-in deve estar associado a um funcionário!" }
        }
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });

    this.hasOne(models.checkout, {
      as: 'checkout',
      foreignKey: 'checkinId',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  }
}

export { Checkin };
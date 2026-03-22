import { Model, DataTypes } from 'sequelize';

class Checkin extends Model {
  static init(sequelize) {
    super.init({
      dataCheckin: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: { msg: "A data do check-in deve ser preenchida!" },
          isDate: { msg: "Data de check-in inválida!" }
        }
      },
      horarioCheckin: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          notEmpty: { msg: "O horário do check-in deve ser preenchido!" }
        }
      },
      cnhCondutor: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "A CNH do condutor no momento da retirada é obrigatória!" }
        }
      },
      cnhValidade: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: { msg: "A validade da CNH do condutor é obrigatória!" },
          isDate: { msg: "Data de validade da CNH inválida!" }
        }
      },
      quilometragemCheckin: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: { args: [0], msg: "A quilometragem de saída não pode ser negativa!" }
        }
      }
    }, { sequelize, modelName: 'checkin', tableName: 'checkins' });
  }

  static associate(models) {
    this.belongsTo(models.Reserva, {
      foreignKey: { name: 'reservaId', allowNull: false },
      as: 'reserva'
    });

    this.belongsTo(models.Veiculo, {
      foreignKey: { name: 'veiculoId', allowNull: false },
      as: 'veiculo'
    });

    this.belongsTo(models.Funcionario, {
      foreignKey: { name: 'funcionarioId', allowNull: false },
      as: 'funcionario'
    });
  }
}

export { Checkin };
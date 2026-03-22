import { Model, DataTypes } from 'sequelize';

class Checkout extends Model {
  static init(sequelize) {
    super.init({
      dataCheckout: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: { msg: "A data do check-out deve ser preenchida!" },
          isDate: { msg: "Data de check-out inválida!" }
        }
      },
      horarioCheckout: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          notEmpty: { msg: "O horário do check-out deve ser preenchido!" }
        }
      },
      quilometragemCheckout: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: { args: [0], msg: "A quilometragem de devolução não pode ser negativa!" }
        }
      },
      nivelCombustivel: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['Baixo', 'Médio', 'Alto', 'Vazio']],
            msg: "O nível de combustível deve ser Baixo, Médio, Alto ou Vazio!"
          }
        }
      },
      condicaoPneus: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "A condição dos pneus deve ser informada!" }
        }
      },
      condicaoPaletas: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "A condição das paletas deve ser informada!" }
        }
      },
      limpoInternamente: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      limpoExternamente: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      possuiAvarias: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    }, { sequelize, modelName: 'checkout', tableName: 'checkouts' });
  }

  static associate(models) {

    this.belongsTo(models.Checkin, {
      foreignKey: { name: 'checkinId', allowNull: false },
      as: 'checkin'
    });

    this.belongsTo(models.Funcionario, {
      foreignKey: { name: 'funcionarioId', allowNull: false },
      as: 'funcionario'
    });
  }
}

export { Checkout };    
//Complemento de Cliente
//Julia, Lorrayne e Henrique
import { Model, DataTypes } from 'sequelize';

class Multa extends Model {
  static init(sequelize) {
    super.init({
      valor: { 
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "O valor da multa deve ser preenchido!" },
          isDecimal: { msg: "O valor da multa deve ser um número decimal válido!" },
          min: { args: [0], msg: "O valor da multa deve ser um número positivo!" }
        }
      },
      dataEmissao: { 
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "A data de emissão da multa deve ser preenchida!" },
          isDate: { msg: "Data de emissão inválida!" },
          isValidDate(value) {
            const hoje = new Date();
            if (value > hoje) {
              throw new Error("A data de emissão da multa não pode ser no futuro!");
            }
          }
        }
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: { args: [0, 1000], msg: "A descrição da multa deve ter entre 0 e 1000 caracteres!" }
        }
      },
      status: {
        type: DataTypes.ENUM('Pendente', 'Paga'),
        allowNull: false,
        defaultValue: 'Pendente',
        validate: {
          notNull: { msg: "O status da multa deve ser preenchido!" },
          isIn: { args: [['Pendente', 'Paga']], msg: "O status da multa deve ser 'Pendente' ou 'Paga'!" }
        }
      }
    }, { sequelize, modelName: 'multa', tableName: 'multas' })
  }
  static associate(models) {
    this.belongsTo(models.cliente, {
      as: 'cliente',
      foreignKey: {
        name: 'clienteId',
        allowNull: false,
        validate: {
          notNull: { msg: "A multa deve estar associada a um cliente!" }
        }
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    this.belongsTo(models.reserva, {
      as: 'reserva',
      foreignKey: {
        name: 'reservaId',
        allowNull: true,
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  }
}

export { Multa };
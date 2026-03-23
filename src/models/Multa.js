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
      }
    }, { sequelize, modelName: 'multa', tableName: 'multas' })
  }
  static associate(models) {
    this.belongsTo(models.Cliente, {
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
  }
}

export { Multa };
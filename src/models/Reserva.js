import { Model, DataTypes } from 'sequelize';

class Reserva extends Model {
  static init(sequelize) {
    super.init({
      dataRetirada: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: { msg: "A data/hora de retirada deve ser preenchida!" },
          isDate: { msg: "Data de retirada inválida!" }
        }
      },
      dataDevolucao: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: { msg: "A data/hora de devolução deve ser preenchida!" },
          isDate: { msg: "Data de devolução inválida!" },
          // Validação customizada e fortíssima:
          isAfterRetirada(value) {
            if (new Date(value) <= new Date(this.dataRetirada)) {
              throw new Error('A data de devolução deve ser posterior à data de retirada!');
            }
          }
        }
      },
      valorDiaria: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: { args: [0.01], msg: "O valor da diária não pode ser zero ou negativo!" }
        }
      },
      qtdDias: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: { args: [1], msg: "A reserva deve ter duração mínima de 1 dia!" },
          isInt: { msg: "A quantidade de dias deve ser um número inteiro!" }
        }
      },
      valorSeguro: {
        type: DataTypes.FLOAT,
        allowNull: true, // Opcional, pois o cliente pode não querer seguro
        defaultValue: 0,
        validate: {
          min: { args: [0], msg: "O valor do seguro não pode ser negativo!" }
        }
      },
      valorFinal: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: { args: [0], msg: "O valor final estimado não pode ser negativo!" }
        }
      }
    }, { sequelize, modelName: 'reserva', tableName: 'reservas' });
  }

  static associate(models) {
    // 1. Cliente da reserva
    this.belongsTo(models.Cliente, {
      foreignKey: { name: 'clienteId', allowNull: false },
      as: 'cliente'
    });

    // 2. Categoria de Veículo reservada
    this.belongsTo(models.CategoriaVeiculo, {
      foreignKey: { name: 'categoriaId', allowNull: false },
      as: 'categoria'
    });

    // 3. Funcionário que registrou a reserva no balcão
    this.belongsTo(models.Funcionario, {
      foreignKey: { name: 'funcionarioId', allowNull: false },
      as: 'funcionario'
    });

    // 4. Seguro contratado (É o único que permite ficar vazio/nulo)
    this.belongsTo(models.Seguro, {
      foreignKey: { name: 'seguroId', allowNull: true },
      as: 'seguro'
    });

    // 5 e 6. As duas Agências (Retirada e Devolução)
    this.belongsTo(models.Agencia, {
      foreignKey: { name: 'agenciaRetiradaId', allowNull: false },
      as: 'agenciaRetirada'
    });

    this.belongsTo(models.Agencia, {
      foreignKey: { name: 'agenciaDevolucaoId', allowNull: false },
      as: 'agenciaDevolucao'
    });
  }
}

export { Reserva };
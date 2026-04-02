import { Model, DataTypes } from 'sequelize';

class Agencia extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O nome da agência deve ser preenchido!" },
          notEmpty: { msg: "O nome da agência deve ser preenchido!" },
          len: { args: [1, 50], msg: "O nome da agência deve ter entre 1 e 50 caracteres!" }
        }
      },
      cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Este CNPJ já está cadastrado no sistema!" },
        validate: {
          notNull: { msg: "O CNPJ deve ser preenchido!" },
          notEmpty: { msg: "O CNPJ deve ser preenchido!" },
          is: { args: ["[0-9]{2}\\.[0-9]{3}\\.[0-9]{3}\\/[0-9]{4}\\-[0-9]{2}"], msg: "CNPJ deve seguir o padrão NN.NNN.NNN/NNNN-NN" }
        }
      },
      endereco: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O endereço da agência deve ser preenchido!" },
          notEmpty: { msg: "O endereço da agência deve ser preenchido!" },
          len: { args: [1, 100], msg: "O endereço da agência deve ter entre 1 e 100 caracteres!" }
        }
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O telefone deve ser preenchido!" },
          notEmpty: { msg: "O telefone deve ser preenchido!" },
          is: { args: ["\\([0-9]{2}\\) [0-9]{4,5}\\-[0-9]{4}"], msg: "Telefone deve seguir o padrão (NN) NNNN-NNNN ou (NN) NNNNN-NNNN" }
        }
      },
      status: {
        type: DataTypes.ENUM('Ativa', 'Inativa'),
        allowNull: false,
        defaultValue: 'Ativa',
        validate: {
          notNull: { msg: "O status deve ser preenchido!" },
          isIn: { args: [['Ativa', 'Inativa']], msg: "O status deve ser 'Ativa' ou 'Inativa'!" }
        }
      }
    }, { sequelize, modelName: 'agencia', tableName: 'agencias' });
  }
  static associate(models) {
    this.hasMany(models.funcionario, {
      as: 'funcionarios',
      foreignKey: 'agenciaId',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    this.hasMany(models.reserva, {
      as: 'reservasRetirada',
      foreignKey: 'agenciaRetiradaId',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    this.hasMany(models.reserva, {
      as: 'reservasDevolucao',
      foreignKey: 'agenciaDevolucaoId',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    this.hasMany(models.veiculo, {
      as: 'veiculos',
      foreignKey: 'agenciaId',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  }
}

export { Agencia };
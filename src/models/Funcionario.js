import { Model, DataTypes } from 'sequelize';

class Funcionario extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "O nome completo deve ser preenchido!" }
        }
      },
      cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Este CPF já está cadastrado no sistema!" },
        validate: {
          notEmpty: { msg: "O CPF deve ser preenchido!" },
          is: { args: ["[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}\\-[0-9]{2}"], msg: "Padrão inválido!" }
        }
      },
      cargo: {
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
          isIn: {
            args: [['Gerente', 'Atendente']],
            msg: "O cargo deve ser Gerente ou Atendente"
          }
        }
      },
      dataNascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: { msg: "Formato de e-mail inválido!" }
        }
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, { sequelize, modelName: 'funcionario', tableName: 'funcionarios' });
  }

  static associate(models) {
    this.belongsTo(models.Agencia, {
      foreignKey: {
        name: 'agenciaId',
        allowNull: false
      },
      as: 'agencia'
    });
  }
}

export { Funcionario };
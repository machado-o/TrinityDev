import { Model, DataTypes } from 'sequelize';

class Funcionario extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O nome do funcionário deve ser preenchido!" },
          notEmpty: { msg: "O nome do funcionário deve ser preenchido!" },
          len: { args: [1, 50], msg: "O nome do funcionário deve ter entre 1 e 50 caracteres!" }
        }
      },
      cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Este CPF já está cadastrado no sistema!" },
        validate: {
          notNull: { msg: "O CPF do funcionário deve ser preenchido!" },
          notEmpty: { msg: "O CPF do funcionário deve ser preenchido!" },
          is: { args: ["[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}\\-[0-9]{2}"], msg: "Padrão inválido!" }
        }
      },
      cargo: {
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
          notNull: { msg: "O cargo do funcionário deve ser preenchido!" },
          notEmpty: { msg: "O cargo do funcionário deve ser preenchido!" },
          isIn: { args: [['Gerente', 'Atendente']], msg: "O cargo deve ser Gerente ou Atendente" }
        }
      },
      dataNascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: { msg: "A data de nascimento do funcionário deve ser preenchida!" },
          isDate: { msg: "A data de nascimento do funcionário deve ser preenchida com uma data válida!" },
          isValidAge(value) {
            const birthDate = new Date(value);
            const today = new Date();
            if (birthDate > today) {
              throw new Error("A data de nascimento não pode ser no futuro!");
            }
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();
            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
              age--;
            }
            if (age < 16) {
              throw new Error("O funcionário deve ter pelo menos 16 anos para se cadastrar!");
            }
          }
        }
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O telefone do funcionário deve ser preenchido!" },
          notEmpty: { msg: "O telefone do funcionário deve ser preenchido!" },
          is: { args: ["\\(\\d{2}\\) \\d{4,5}\\-\\d{4}"], msg: "Telefone do funcionário deve seguir o padrão (NN) NNNN-NNNN ou (NN) NNNNN-NNNN!" }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Este e-mail já está cadastrado no sistema!" },
        validate: {
          isEmail: { msg: "Formato de e-mail inválido!" },
          notNull: { msg: "O e-mail do funcionário deve ser preenchido!" },
          notEmpty: { msg: "O e-mail do funcionário deve ser preenchido!" }
        }
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "A senha do funcionário deve ser preenchida!" },
          notEmpty: { msg: "A senha do funcionário deve ser preenchida!" },
          len: { args: [8, 100], msg: "A senha do funcionário deve ter entre 8 e 100 caracteres!" }
        }
      }
    }, { sequelize, modelName: 'funcionario', tableName: 'funcionarios' });
  }
  static associate(models) {
    this.belongsTo(models.agencia, {
      as: 'agencia',
      foreignKey: {
        name: 'agenciaId',
        allowNull: false,
        validate: {
          notNull: { msg: "O funcionário deve estar associado a uma agência!" }
        }
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  }
}

export { Funcionario };
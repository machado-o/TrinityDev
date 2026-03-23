import { Model, DataTypes } from 'sequelize';

class Cliente extends Model {

  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
          notNull: { msg: "O nome do Cliente deve ser preenchido!" },
          notEmpty: { msg: "Nome do Cliente deve ser preenchido!" },
          len: { args: [1, 50], msg: "Nome do Cliente deve ter entre 1 e 50 letras!" }
        }
      },
      cpf: { 
        type: DataTypes.STRING, 
        allowNull: false,
        unique: { msg: "Este CPF já está cadastrado no sistema!" },
        validate: {
          notNull: { msg: "O CPF do Cliente deve ser preenchido!" },
          notEmpty: { msg: "CPF do Cliente deve ser preenchido!" },
          is: { args: ["[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}\\-[0-9]{2}"], msg: "CPF do Cliente deve seguir o padrão NNN.NNN.NNN-NN!" }
        }
      },
      dataNascimento: { 
        type: DataTypes.DATEONLY, 
        allowNull: false,
        validate: {
          notNull: { msg: "A data de nascimento do Cliente deve ser preenchida!" },
          isDate: { msg: "Data de nascimento do Cliente deve ser preenchida!" },
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
            if (age < 18) {
              throw new Error("O Cliente deve ter pelo menos 18 anos para se cadastrar!");
            }
          }
        }
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O telefone do Cliente deve ser preenchido!" },
          notEmpty: { msg: "Telefone do Cliente deve ser preenchido!" },
          is: { args: ["\\(\\d{2}\\) \\d{4,5}\\-\\d{4}"], msg: "Telefone do Cliente deve seguir o padrão (NN) NNNN-NNNN ou (NN) NNNNN-NNNN!" }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Este e-mail já está cadastrado no sistema!" },
        validate: {
          notNull: { msg: "O e-mail do Cliente deve ser preenchido!" },
          notEmpty: { msg: "O e-mail do Cliente deve ser preenchido!" },
          isEmail: { msg: "Formato de e-mail inválido!" }
        }
      },
      cnh: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Esta CNH já está cadastrada no sistema!" },
        validate: {
          notNull: { msg: "O número da CNH deve ser preenchido!" },
          notEmpty: { msg: "O número da CNH deve ser preenchido!" },
          len: { args: [11, 11], msg: "O número da CNH deve conter exatamente 11 caracteres!" },
          is: { args: ["\\d{11}"], msg: "O número da CNH deve conter apenas números!" }
        }
      },
      categoriaCnh: {
        type: DataTypes.ENUM('A', 'B', 'AB', 'C', 'D', 'E', 'AC', 'AD', 'AE'),
        allowNull: false,
        validate: {
          notNull: { msg: "A categoria da CNH deve ser preenchida!" },
          isIn: { args: [['A', 'B', 'AB', 'C', 'D', 'E', 'AC', 'AD', 'AE']], msg: "Categoria da CNH inválida!" }
        }
      },
      validadeCnh: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: { msg: "A validade da CNH deve ser preenchida!" },
          notEmpty: { msg: "A validade da CNH deve ser preenchida!" },
          isDate: { msg: "A validade da CNH deve ser preenchida com uma data válida!" }
        }
      },
      endereco: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O endereço do Cliente deve ser preenchido!" },
          notEmpty: { msg: "O endereço do Cliente deve ser preenchido!" },
          len: { args: [1, 100], msg: "O endereço do Cliente deve ter entre 1 e 100 caracteres!" }
        }
      }
    }, { sequelize, modelName: 'cliente', tableName: 'clientes' })
  }
  static associate(models) {
    this.hasMany(models.reserva, {
      as: 'reservas',
      foreignKey: 'clienteId',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });

    this.hasMany(models.multa, {
      as: 'multas',
      foreignKey: 'clienteId',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  }
}

export { Cliente };
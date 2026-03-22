import { Model, DataTypes } from 'sequelize';

class Cliente extends Model {

  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
          notEmpty: { msg: "Nome do Cliente deve ser preenchido!" },
          len: { args: [2, 50], msg: "Nome do Cliente deve ter entre 2 e 50 letras!" }
        }
      },
      cpf: { 
        type: DataTypes.STRING, 
        allowNull: false,
        unique: { msg: "Este CPF já está cadastrado no sistema!" },
        validate: {
          notEmpty: { msg: "CPF do Cliente deve ser preenchido!" },
          is: { args: ["[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}\\-[0-9]{2}"], msg: "CPF do Cliente deve seguir o padrão NNN.NNN.NNN-NN!" },
        }
      },
      dataNascimento: { 
        type: DataTypes.DATEONLY, 
        allowNull: false,
        validate: {
          isDate: { msg: "Data de nascimento do Cliente deve ser preenchida!" },
          is: { args: ["[0-9]{4}\\-[0-9]{2}\\-[0-9]{2}"], msg: "Data de Nascimento do Cliente deve seguir o padrão yyyy-MM-dd!" }
        }
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Telefone do Cliente deve ser preenchido!" }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "E-mail do Cliente deve ser preenchido!" },
          isEmail: { msg: "Formato de e-mail inválido!" }
        }
      },
      cnh: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "O número da CNH deve ser preenchido!" }
        }
      },
      categoriaCnh: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "A categoria da CNH deve ser preenchida!" },
          isIn: {
            args: [['A', 'B', 'AB', 'C', 'D', 'E', 'AC', 'AD', 'AE']], msg: "Categoria da CNH inválida!"
          }
        }
      },
      validadeCnh: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: "A validade da CNH deve ser preenchida com uma data válida!" }
        }
      },
      endereco: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "O endereço deve ser preenchido!" }
        }
      }
    }, { sequelize, modelName: 'cliente', tableName: 'clientes' })
  }
}

export { Cliente };
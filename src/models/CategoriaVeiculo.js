import { Model, DataTypes } from 'sequelize';

class CategoriaVeiculo extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "O nome da categoria deve ser preenchido!" }
        }
      },
      descricao: {
        type: DataTypes.STRING,
        allowNull: false
      },
      valorDiaria: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: { args: [0.01], msg: "O valor da diária deve ser maior que zero!" }
        }
      },
      tipoCarroceria: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['Sedan', 'Hatch', 'SUV', 'Picape']],
            msg: "Tipo de carroceria inválido!"
          }
        }
      },
      propulsao: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['Elétrico', 'Híbrido', 'Combustão']],
            msg: "Tipo de propulsão inválida!"
          }
        }
      },
      cambio: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['Automático', 'Manual']],
            msg: "O câmbio deve ser Automático ou Manual!"
          }
        }
      },
      arCondicionado: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      capacidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: { args: [1], msg: "A capacidade deve ser de pelo menos 1 passageiro!" }
        }
      }
    }, { sequelize, modelName: 'categoriaVeiculo', tableName: 'categorias_veiculos' });
  }

  static associate(models) {
  }
}

export { CategoriaVeiculo };
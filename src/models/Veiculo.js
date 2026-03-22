import { Model, DataTypes } from 'sequelize';

class Veiculo extends Model {
  static init(sequelize) {
    super.init({
      placa: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Esta placa já está cadastrada no sistema!" },
        validate: {
          notEmpty: { msg: "A placa deve ser preenchida!" }
        }
      },
      chassi: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Este chassi já está cadastrado no sistema!" },
        validate: {
          notEmpty: { msg: "O chassi deve ser preenchido!" }
        }
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['Disponível', 'Reservado', 'Manutenção']],
            msg: "Status inválido!"
          }
        }
      },
      marca: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['Toyota', 'Jeep', 'Honda', 'Fiat', 'KIA', 'Ford', 'BYD', 'Chevrolet', 'Hyundai']],
            msg: "Marca não permitida pelo sistema!"
          }
        }
      },
      modelo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "O modelo deve ser preenchido!" }
        }
      },
      cor: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['Branco', 'Preto', 'Cinza', 'Prata', 'Outra']],
            msg: "Cor inválida!"
          }
        }
      },
      anoFabricacao: {
        type: DataTypes.STRING,
        allowNull: false
      },
      quilometragem: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: { args: [0], msg: "A quilometragem não pode ser negativa!" }
        }
      }
    }, { sequelize, modelName: 'veiculo', tableName: 'veiculos' });
  }

  static associate(models) {
    this.belongsTo(models.CategoriaVeiculo, {
      foreignKey: {
        name: 'categoriaId',
        allowNull: false
      },
      as: 'categoria'
    });
  }
}

export { Veiculo };
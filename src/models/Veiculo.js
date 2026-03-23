import { Model, DataTypes } from 'sequelize';

class Veiculo extends Model {
  static init(sequelize) {
    super.init({
      placa: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Esta placa já está cadastrada no sistema!" },
        validate: {
          notNull: { msg: "A placa deve ser preenchida!" },
          notEmpty: { msg: "A placa deve ser preenchida!" },
          is: { args: [/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/], msg: "A placa deve seguir o padrão LLLNLNN ou LLLNNNN!" }
        }
      },
      chassi: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Este chassi já está cadastrado no sistema!" },
        validate: {
          notNull: { msg: "O chassi deve ser preenchido!" },
          notEmpty: { msg: "O chassi deve ser preenchido!" },
          is: { args: [/^[A-HJ-NPR-Z0-9]{17}$/], msg: "O chassi deve conter exatamente 17 caracteres alfanuméricos (excluindo I, O e Q)!" }
        }
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O status do veículo deve ser preenchido!" },
          notEmpty: { msg: "O status do veículo deve ser preenchido!" },
          isIn: { args: [['Disponível', 'Reservado', 'Manutenção']], msg: "Status inválido!" }
        }
      },
      marca: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "A marca do veículo deve ser preenchida!" },
          notEmpty: { msg: "A marca do veículo deve ser preenchida!" },
          isIn: { args: [['Toyota', 'Jeep', 'Honda', 'Fiat', 'KIA', 'Ford', 'BYD', 'Chevrolet', 'Hyundai', 'Volkswagen', 'Nissan', 'Mazda', 'Subaru', 'Renault', 'BMW', 'Mercedes-Benz', 'Audi', 'Volvo']], msg: "Marca não reconhecida pelo sistema!" }
        }
      },
      modelo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O modelo do veículo deve ser preenchido!" },
          notEmpty: { msg: "O modelo deve ser preenchido!" },
          len: { args: [1, 50], msg: "O modelo do veículo deve ter entre 1 e 50 caracteres!" }
        }
      },
      cor: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "A cor do veículo deve ser preenchida!" },
          notEmpty: { msg: "A cor do veículo deve ser preenchida!" },
          isIn: { args: [['Branco', 'Preto', 'Cinza', 'Prata', 'Outra']], msg: "Cor inválida!" }
        }
      },
      anoFabricacao: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O ano de fabricação do veículo deve ser preenchido!" },
          notEmpty: { msg: "O ano de fabricação do veículo deve ser preenchido!" },
          is: { args: [/^(19|20)\d{2}$/], msg: "O ano de fabricação deve ser um ano válido entre 1900 e 2099!" },
          isValidYear(value) {
            const currentYear = new Date().getFullYear();
            if (value > currentYear) {
              throw new Error("O ano de fabricação não pode ser no futuro!");
            }
          }
        }
      },
      quilometragem: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "A quilometragem do veículo deve ser preenchida!" },
          isDecimal: { msg: "A quilometragem deve ser um número decimal válido!" },
          min: { args: [0], msg: "A quilometragem não pode ser negativa!" }
        }
      }
    }, { sequelize, modelName: 'veiculo', tableName: 'veiculos' });
  }
  static associate(models) {
    this.belongsTo(models.CategoriaVeiculo, {
      as: 'categoria',
      foreignKey: {
        name: 'categoriaVeiculoId',
        allowNull: false,
        validate: {
          notNull: { msg: "O veículo deve estar associado a uma categoria!" }
        }
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  }
}

export { Veiculo };
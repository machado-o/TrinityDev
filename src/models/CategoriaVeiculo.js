import { Model, DataTypes } from 'sequelize';

class CategoriaVeiculo extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O nome da categoria deve ser preenchido!" },
          notEmpty: { msg: "O nome da categoria deve ser preenchido!" },
          len: { args: [1, 50], msg: "O nome da categoria deve ter entre 1 e 50 caracteres!" }
        }
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: { args: [0, 1000], msg: "A descrição da categoria deve ter no máximo 1000 caracteres!" }
        }
      },
      valorDiaria: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "O valor da diária deve ser preenchido!" },
          min: { args: [0], msg: "O valor da diária não pode ser negativo!" },
          isDecimal: { msg: "O valor da diária deve ser um número decimal válido!" }
        }
      },
      tipoCarroceria: {
        type: DataTypes.ENUM('Sedan', 'Hatch', 'SUV', 'Picape'),
        allowNull: false,
        validate: {
          notNull: { msg: "O tipo de carroceria deve ser preenchido!" },
          isIn: { args: [['Sedan', 'Hatch', 'SUV', 'Picape']], msg: "Tipo de carroceria inválido!" }
        }
      },
      propulsao: {
        type: DataTypes.ENUM('Elétrico', 'Híbrido', 'Combustão'),
        allowNull: false,
        validate: {
          notNull: { msg: "O tipo de propulsão deve ser preenchido!" },
          isIn: { args: [['Elétrico', 'Híbrido', 'Combustão']], msg: "Tipo de propulsão inválida!" }
        }
      },
      cambio: {
        type: DataTypes.ENUM('Automático', 'Manual'),
        allowNull: false,
        validate: {
          notNull: { msg: "O tipo de câmbio deve ser preenchido!" },
          isIn: { args: [['Automático', 'Manual']], msg: "O câmbio deve ser Automático ou Manual!" }
        }
      },
      arCondicionado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: { msg: "A informação sobre ar-condicionado deve ser preenchida!" },
          isIn: { args: [[true, false]], msg: "O campo de ar-condicionado deve ser verdadeiro ou falso!" }
        }
      },
      capacidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "A capacidade deve ser preenchida!" },
          isInt: { msg: "A capacidade deve ser um número inteiro!" },
          min: { args: [1], msg: "A capacidade deve ser de pelo menos 1 passageiro!" }
        }
      }
    }, { sequelize, modelName: 'categoriaVeiculo', tableName: 'categoriasVeiculos' });
  }
  static associate(models) {
    this.hasMany(models.veiculo, {
      as: 'veiculos',
      foreignKey: 'categoriaVeiculoId',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });

    this.hasMany(models.reserva, {
      as: 'reservas',
      foreignKey: 'categoriaVeiculoId',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  }
}

export { CategoriaVeiculo };
//Julia
import { Model, DataTypes } from 'sequelize';

class Checkout extends Model {
  static init(sequelize) {
    super.init({
      dataCheckout: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: { msg: "A data do check-out deve ser preenchida!" },
          isDate: { msg: "Data de check-out inválida!" }
        }
      },
      horarioCheckout: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          notNull: { msg: "O horário do check-out deve ser preenchido!" },
          is: { args: /^([01]\d|2[0-3]):([0-5]\d)$/, msg: "Horário de check-out inválido! Use o formato HH:mm." }
        }
      },
      quilometragemCheckout: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "A quilometragem de devolução deve ser preenchida!" },
          isDecimal: { msg: "A quilometragem de devolução deve ser um número decimal válido!" },
          min: { args: [0], msg: "A quilometragem de devolução não pode ser negativa!" }
        }
      },
      nivelCombustivel: {
        type: DataTypes.ENUM('Alto', 'Médio', 'Baixo', 'Vazio'),
        allowNull: false,
        validate: {
          notNull: { msg: "O nível de combustível deve ser informado!" },
          isIn: { args: [['Alto', 'Médio', 'Baixo', 'Vazio']], msg: "O nível de combustível deve ser Baixo, Médio, Alto ou Vazio!" }
        }
      },
      condicaoPneus: {
        type: DataTypes.ENUM('Bom', 'Regular', 'Ruim', 'Furado'),
        allowNull: false,
        validate: {
          notNull: { msg: "A condição dos pneus deve ser informada!" },
          isIn: { args: [['Bom', 'Regular', 'Ruim', 'Furado']], msg: "A condição dos pneus deve ser Bom, Regular, Ruim ou Furado!" }
        }
      },
      condicaoPalhetas: {
        type: DataTypes.ENUM('Boas', 'Ressecadas', 'Quebradas', 'Ausentes'),
        allowNull: false,
        validate: {
          notNull: { msg: "A condição das palhetas deve ser informada!" },
          isIn: { args: [['Boas', 'Ressecadas', 'Quebradas', 'Ausentes']], msg: "A condição das palhetas deve ser Boas, Ressecadas, Quebradas ou Ausentes!" }
        }
      },
      limpoInternamente: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: { msg: "A informação sobre limpeza interna deve ser preenchida!" },
          isIn: { args: [[true, false]], msg: "O campo de limpeza interna deve ser verdadeiro ou falso!" }
        }
      },
      limpoExternamente: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: { msg: "A informação sobre limpeza externa deve ser preenchida!" },
          isIn: { args: [[true, false]], msg: "O campo de limpeza externa deve ser verdadeiro ou falso!" }
        }
      },
      possuiAvarias: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: { msg: "A informação sobre avarias deve ser preenchida!" },
          isIn: { args: [[true, false]], msg: "O campo de avarias deve ser verdadeiro ou falso!" }
        }
      },
      observacoes: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: { args: [0, 1000], msg: "As observações do check-out devem ter no máximo 1000 caracteres!" }
        }
      }
    }, { sequelize, modelName: 'checkout', tableName: 'checkouts' });
  }
  static associate(models) {
    this.belongsTo(models.checkin, {
      as: 'checkin',
      foreignKey: {
        name: 'checkinId',
        allowNull: false,
        validate: {
          notNull: { msg: "O check-out deve estar associado a um check-in!" }
        }
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    this.belongsTo(models.funcionario, {
      as: 'funcionario',
      foreignKey: {
        name: 'funcionarioId',
        allowNull: false,
        validate: {
          notNull: { msg: "O check-out deve estar associado a um funcionário!" }
        }
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    this.belongsToMany(models.avaria, {
      as: 'avarias',
      through: 'checkout_avaria',
      foreignKey: { 
        name: 'checkoutId',
        allowNull: false,
        validate: {
          notNull: { msg: "O checkout deve estar associado a uma avaria!" }
        }
      },
      otherKey: {
        name: 'avariaId',
        allowNull: false,
        validate: {
          notNull: { msg: "A avaria deve estar associada a um checkout!" }
        }
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
}

export { Checkout };    
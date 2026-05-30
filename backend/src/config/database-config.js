/*
// Configuração do banco de dados no ambiente de teste
export const databaseConfig = {
  dialect: 'sqlite',
  storage: 'database.sqlite',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  }
};
*/

/*
// Configuração do banco de dados no ambiente de desenvolvimento
export const databaseConfig = {
  dialect: 'postgres',
  host: 'db',
  username: 'admin',
  password: 'admin123',
  database: 'sav_trinitydev',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  }
};
*/

export const databaseConfig = {
  dialect: 'postgres',
  host:     process.env.DB_HOST || 'dpg-d8d3kvt7vvec73ftakb0-a.oregon-postgres.render.com',
  username: process.env.DB_USER || 'sav_trinitydev_db_user',
  password: process.env.DB_PASS || 'ppETReCruy5tVrHk8poCezdIbN94GLb4',
  database: process.env.DB_NAME || 'sav_trinitydev_db',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  },
  ...(!process.env.DB_HOST && { dialectOptions: { ssl: { rejectUnauthorized: false } } })
};


/*
Passo a passo pgadmin

Login:
  email: admin@admin.com
  password: admin

Add new server
  General:
    Name: Banco Trinity
  Connection:
    Host: db
    Port: 5432
    Maintenance database: sav_trinitydev
    Username: admin
    Password: admin123
*/
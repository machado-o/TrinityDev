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

//ADICIONAR CONFIGURAÇÃO DO BANCO DE DADOS PARA O AMBIENTE DE PRODUÇÃO NO RENDER
// Configuração do banco de dados no ambiente de produção
export const databaseConfig = {
  dialect: 'postgres',
  host: 'dpg-d8c70lmrnols739koiug-a.oregon-postgres.render.com',
  username: 'sav_trinitydev_db_user',
  password: 'OqGbMK162JIRckf6J9BesA08hNs7aF9M',
  database: 'sav_trinitydev_db',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  },
  dialectOptions: {
    ssl: true
  }
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
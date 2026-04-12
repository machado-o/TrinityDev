const usePostgres = Boolean(process.env.DB_HOST);

// Usa Postgres quando as variáveis de ambiente do Docker estão presentes.
export const databaseConfig = usePostgres
  ? {
      dialect: 'postgres',
      host: process.env.DB_HOST || 'db',
      username: process.env.DB_USER || 'admin',
      password: process.env.DB_PASS || 'admin123',
      database: process.env.DB_NAME || 'sav_trinitydev',
      define: {
        timestamps: true,
        freezeTableName: true,
        underscored: true,
      },
    }
  : {
      dialect: 'sqlite',
      storage: 'database.sqlite',
      define: {
        timestamps: true,
        freezeTableName: true,
        underscored: true,
      },
    };

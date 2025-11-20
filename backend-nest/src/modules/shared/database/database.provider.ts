import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mysql, { Pool } from 'mysql2/promise';

export const DATABASE_POOL = 'DATABASE_POOL';

export const DatabaseProvider: Provider = {
  provide: DATABASE_POOL,
  inject: [ConfigService],
  useFactory: async (config: ConfigService): Promise<Pool> => {
    const dbConfig = config.get('db');

    const pool = mysql.createPool({
      ...dbConfig,
    });

    return pool;
  },
};

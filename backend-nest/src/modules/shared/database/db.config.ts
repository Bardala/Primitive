// src/modules/shared/database/db.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_ROOT_PASSWORD,
  connectionLimit: process.env.NODE_ENV === 'prod' ? 50 : 20,
  multipleStatements: true,
}));

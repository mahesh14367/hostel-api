import mysql from 'mysql2';
import { appConfig } from './app';


const pool = mysql.createPool({
    host: appConfig.mysqlHost,
    user: appConfig.mysqlUser,
    password: appConfig.mysqlPassword,
    database: appConfig.mysqlDatabase,
    port: Number(appConfig.mysqlPort)
});

export default pool.promise();

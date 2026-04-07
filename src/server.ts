import app from "./app";
import { appConfig } from "./config/app";
import mysql from "mysql2";
import { testConnection } from "./scripts/test-db";

const PORT = appConfig.port;


const connection = mysql.createConnection({
    host: appConfig.mysqlHost,
    user: appConfig.mysqlUser,
    password: appConfig.mysqlPassword,
    database: appConfig.mysqlDatabase,
    port: Number(appConfig.mysqlPort)
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        process.exit(1);
    }
    console.log('✅ Database connected successfully');
    testConnection();
});


app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌐 API available at http://localhost:${PORT}/api`);
});
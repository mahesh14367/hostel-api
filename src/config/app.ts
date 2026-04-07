import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    mysqlPassword: process.env.DB_PASSWORD || "password",
    mysqlUser: process.env.DB_USER || "root",
    mysqlHost: process.env.DB_HOST || "localhost",
    mysqlDatabase: process.env.DB_NAME || "hostel",
    mysqlPort: process.env.DB_PORT || 3306,
};

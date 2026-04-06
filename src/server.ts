import app from "./app";
import { appConfig } from "./config/app";

const PORT = appConfig.port;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌐 API available at http://localhost:${PORT}/api`);
});
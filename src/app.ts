import express,{Request, Response} from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";

const app = express();

app.use(helmet());

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));


app.use('/api', routes);
app.get('/api', (req: Request, res: Response) => {
    res.send('Hi,You are in the right place!');
});

export default app;
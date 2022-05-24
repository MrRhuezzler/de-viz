import express, { NextFunction, Request, Response, Router } from 'express';
import UserRouter from './routes/UserRouter';
import AuthRouter from './routes/AuthRouter';
import pool, { initTables } from './database';
import cookieSession from 'cookie-session';

export class App {

    private app: express.Application;
    private api: Router;

    constructor() {
        this.app = express();
        this.api = Router();

        this.config();
        this.dbConfig();
        this.routes();
    }

    private config() {
        this.app.set('trust proxy', true);
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json({ limit: '1mb' }));
        this.app.use(cookieSession({
            signed: false,
            secure: false
        }))
    }

    private dbConfig() {
        initTables(pool);
    }

    private routes() {

        // Registering api router
        this.app.use('/api', this.api);

        // Register userRouter
        this.api.use('/user', UserRouter);
        this.api.use('/auth', AuthRouter);

        this.api.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.log(err);
            return res.status(500).json({ 'message': 'Internal Server error' });
        })

    }

    public start(port: number) {
        return new Promise<number>((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err) => { reject(err); });
        });
    }

}
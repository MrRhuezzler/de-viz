import express, { Router } from 'express';
import UserRouter from './routes/UserRouter';

export class App {

    private app: express.Application;
    private api: Router;

    constructor() {
        this.app = express();
        this.config();

        // defining the api router
        this.api = Router();
        this.routes();
    }

    private config() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json({ limit: '1mb' }));
    }

    private routes() {

        // Registering api router
        this.app.use('/api', this.api);

        // Register userRouter
        this.api.use('/user', UserRouter);

    }

    public start(port: number) {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err) => { reject(err); });
        });
    }

}
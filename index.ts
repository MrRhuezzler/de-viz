import { App } from "./src/app";
import 'dotenv/config';

const PORT = parseInt(process.env.PORT || '3000');

new App().start(PORT).then((port) => {
    console.log(`Server started on port ${port}`);
}).catch((err) => {
    console.log(err);
});
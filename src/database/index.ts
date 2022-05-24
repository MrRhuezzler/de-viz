import { Pool } from "pg";

const pool = new Pool({
    user: 'dev',
    host: 'localhost',
    database: 'de-viz',
    password: 'abcabc123',
    port: 5432,
});

export default pool;
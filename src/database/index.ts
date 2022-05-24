import { Pool } from "pg";
import { QueryRepo } from "./repositories/QueryRepo";
import { UserRepo } from "./repositories/UserRepo";

const pool = new Pool({
    user: 'dev',
    host: 'localhost',
    database: 'de-viz',
    password: 'abcabc123',
    port: 5432,
});

// initialize all tables
export const initTables = (pool: Pool) => {
    new UserRepo(pool, true, false);
    new QueryRepo(pool, true, false);
}

export default pool;
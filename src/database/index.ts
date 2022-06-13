import { Pool } from "pg";
import { DataSourceRepo } from "./repositories/DataSourceRepo";
import { QueryRepo } from "./repositories/QueryRepo";
import { UserRepo } from "./repositories/UserRepo";

const pool = new Pool({
  user: "dev",
  host: "localhost",
  database: "de-viz",
  password: "abcabc123",
  port: 5432,
});

const initProceduresFunctions = async (pool: Pool) => {
  try {
    const result = await pool.query(`CREATE OR REPLACE 
      FUNCTION isTypeDefined(IN typeName VARCHAR(255)) 
      RETURNS boolean AS $$
      BEGIN
      RETURN EXISTS (SELECT *
      FROM pg_type typ
        INNER JOIN pg_namespace nsp
        ON nsp.oid = typ.typnamespace
        WHERE nsp.nspname = current_schema() AND typ.typname = typeName);
      END;
      $$
      LANGUAGE plpgsql;
    `);
  } catch (err) {
    throw err;
  }
};

// initialize all tables
export const initTables = async (pool: Pool) => {
  try {
    await initProceduresFunctions(pool);
    new UserRepo(pool, true, false);
    new QueryRepo(pool, true, false);
    new DataSourceRepo(pool, true, false);
  } catch (err) {
    throw err;
  }
};

export default pool;

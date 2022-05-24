import { Pool } from "pg";

export interface Query {
    id: string;
    sqlQuery: string;
    userEmail: string;
}

export class QueryRepo {

    private tableName: string = 'query';
    private sequenceName: string = 'query_id_seq';
    private idPrefix: string = 'QUERY_';

    constructor(
        private pool: Pool,
        initTable: boolean = false,
        force: boolean = false
    ) {
        if (initTable) this.createTable(force);

        // binA
    }

    private async createTable(force: boolean = false) {

        if (force) {
            await this.pool.query(`DROP TABLE IF EXISTS "${this.tableName}"`);
        }

        await this.pool.query(`CREATE TABLE IF NOT EXISTS "${this.tableName}" (
            id VARCHAR(255) PRIMARY KEY,
            sqlQuery VARCHAR(255),
            userEmail VARCHAR(255) 
        )`);

        await this.pool.query(`CREATE SEQUENCE IF NOT EXISTS "${this.sequenceName}"`);

    }

    private async getNextId() {
        try {
            const result = await this.pool.query(`SELECT nextval("${this.sequenceName}")`);
            const count = result.rows[0].nextval as string;
            return `${this.idPrefix}${count.toString().padStart(10, '0')}`;
        } catch (err) {
            throw err;
        }
    }

    async getAQuer(id: string): Promise<Query> {
        try {
            const result = await this.pool.query(`SELECT * FROM "${this.tableName}" WHERE id = $1`, [id]);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    }

    async getAllQueriesOfAUser(email: string): Promise<Query[]> {
        try {
            const result = await this.pool.query(`SELECT * FROM "${this.tableName} WHERE userEmail = $1"`, [email]);
            return result.rows;
        } catch (err) {
            throw err;
        }
    }

    async insertQuery(sqlQuery: string, email: string) {

        try {
            const nextId = await this.getNextId();
            const result = await this.pool.query(`INSERT INTO "${this.tableName}" (id, sqlQuery, userEmail) VALUES ($1, $2, $3)`, [nextId, sqlQuery, email]);
            return result.rows;
        } catch (err) {
            throw err;
        }

    }

}
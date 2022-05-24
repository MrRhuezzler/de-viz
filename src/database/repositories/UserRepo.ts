import { Pool } from "pg";

export interface User {
    email: string;
    password: string;
    isVerified: boolean;
}

export class UserRepo {

    constructor(
        private pool: Pool,
        private tableName: string = 'user'
    ) { }

    async getAllUsers(): Promise<User[]> {
        try {
            const result = await this.pool.query(`SELECT * FROM ${this.tableName}`);
            return result.rows;
        } catch (err) {
            throw err;
        }
    }

    async insertUser(email: string, password: string, isVerified = false) {

        try {
            const result = await this.pool.query(`INSERT INTO ${this.tableName} (email, password, isVerified) VALUES ($1, $2, $3)`, [email, password, isVerified]);
            return result.rows;
        } catch (err) {
            throw err;
        }

    }

}
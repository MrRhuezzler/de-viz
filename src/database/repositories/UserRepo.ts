import { Pool } from "pg";

export interface User {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
}

export class UserRepo {
  private tableName: string = "user";

  constructor(
    private pool: Pool,
    initTable: boolean = false,
    force: boolean = false
  ) {
    if (initTable) this.createTable(force);
  }

  private async createTable(force: boolean = false) {
    if (force) {
      await this.pool.query(`DROP TABLE IF EXISTS "${this.tableName}"`);
    }

    await this.pool.query(
      `CREATE TABLE IF NOT EXISTS "${this.tableName}" (email VARCHAR(255) PRIMARY KEY, name VARCHAR(255), password VARCHAR(255), isVerified BOOLEAN)`
    );
  }

  async getAUser(email: string): Promise<User> {
    try {
      const result = await this.pool.query(
        `SELECT * FROM "${this.tableName}" WHERE email = $1`,
        [email]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const result = await this.pool.query(`SELECT * FROM "${this.tableName}"`);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async insertUser(
    email: string,
    name: string,
    password: string,
    isVerified = false
  ) {
    try {
      const result = await this.pool.query(
        `INSERT INTO "${this.tableName}" (email, name, password, isVerified) VALUES ($1, $2, $3, $4)`,
        [email, name, password, isVerified]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }
}

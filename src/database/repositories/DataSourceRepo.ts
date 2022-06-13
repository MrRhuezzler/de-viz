import { Pool } from "pg";

export enum DataSourceType {
  POSTGRESQL = "POSTGRESQL",
}

export interface DataSource {
  id: string;
  connectionname: string;
  type: string;
  db_host: string;
  db_port: number;
  db_database: string;
  db_user: string;
  db_password: string;
  useremail: string;
}

export class DataSourceRepo {
  private tableName: string = "datasource";
  private sequenceName: string = "datasource_id_seq";
  private typeEnum: string = "datasource_type";
  private idPrefix: string = "DATASRC_";

  constructor(
    private pool: Pool,
    initTable: boolean = false,
    force: boolean = false
  ) {
    if (initTable) this.createTable(force);
  }

  private isTypeDefined = async (typeName: string) => {
    const result = await this.pool.query(`SELECT isTypeDefined('${typeName}')`);
    return result.rows[0].istypedefined as boolean;
  };

  private async createTable(force: boolean = false) {
    if (force) {
      await this.pool.query(`DROP TABLE IF EXISTS "${this.tableName}"`);
      await this.pool.query(`DROP SEQUENCE IF EXISTS "${this.sequenceName}"`);
      await this.pool.query(`DROP TYPE IF EXISTS "${this.typeEnum}"`);
    }

    if (!(await this.isTypeDefined(this.typeEnum))) {
      await this.pool.query(
        `CREATE TYPE "${this.typeEnum}" AS ENUM('${DataSourceType.POSTGRESQL}')`
      );
    }

    await this.pool.query(`CREATE TABLE IF NOT EXISTS "${this.tableName}" (
            id VARCHAR(255),
            name VARCHAR(255),
            type "${this.typeEnum}",
            db_host VARCHAR(255),
            db_port INTEGER,
            db_name VARCHAR(255),
            db_username VARCHAR(255),
            db_password VARCHAR(255),
            userEmail VARCHAR(255),
            PRIMARY KEY (id),
            CONSTRAINT fk_userEmail
              FOREIGN KEY (userEmail)
              REFERENCES "user"(email)
        )`);

    await this.pool.query(
      `CREATE SEQUENCE IF NOT EXISTS "${this.sequenceName}"`
    );
  }

  private getNextId = async () => {
    try {
      const result = await this.pool.query(
        `SELECT nextval('${this.sequenceName}')`
      );
      const count = result.rows[0].nextval as string;
      return `${this.idPrefix}${count.toString().padStart(8, "0")}`;
    } catch (err) {
      throw err;
    }
  };

  public getAllDataSourcesOfAUser = async (
    email: string
  ): Promise<DataSource[]> => {
    try {
      const result = await this.pool.query(
        `SELECT * FROM "${this.tableName}" WHERE userEmail = $1`,
        [email]
      );
      return result.rows;
    } catch (err) {
      throw err;
    }
  };

  public getADataSource = async (id: string): Promise<DataSource> => {
    try {
      const result = await this.pool.query(
        `SELECT * FROM "${this.tableName}" WHERE id = $1`,
        [id]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  };

  public insertDataSource = async (
    name: string,
    type: DataSourceType,
    db_host: string,
    db_port: number,
    db_name: string,
    db_username: string,
    db_password: string,
    userEmail: string
  ): Promise<DataSource> => {
    try {
      const id = await this.getNextId();
      const result = await this.pool.query(
        `INSERT INTO "${this.tableName}" 
          (id, name, type, db_host, db_port, db_name, db_username, db_password, userEmail) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          id,
          name,
          type,
          db_host,
          db_port,
          db_name,
          db_username,
          db_password,
          userEmail,
        ]
      );
      return this.getADataSource(id);
    } catch (err) {
      throw err;
    }
  };

  public updateDataSource = async (
    id: string,
    name: string,
    type: DataSourceType,
    db_host: string,
    db_port: number,
    db_name: string,
    db_username: string,
    db_password: string
  ): Promise<DataSource> => {
    try {
      const result = await this.pool.query(
        `UPDATE "${this.tableName}"
          SET name = $1, type = $2, db_host = $3, db_port = $4, db_name = $5, db_username = $6, db_password = $7
          WHERE id = $8`,
        [name, type, db_host, db_port, db_name, db_username, db_password, id]
      );
      return this.getADataSource(id);
    } catch (err) {
      throw err;
    }
  };

  public deleteDataSource = async (id: string): Promise<void> => {
    try {
      const result = await this.pool.query(
        `DELETE FROM "${this.tableName}" WHERE id = $1`,
        [id]
      );
    } catch (err) {
      throw err;
    }
  };
}

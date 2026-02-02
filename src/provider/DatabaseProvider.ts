import { QuickDB } from "quick.db";

interface Databases {
  servers: QuickDB;
}

export class DatabaseProvider {
  private static database: Databases;

  static set(data: Databases) {
    this.database = data;
  }

  static get(): Databases {
    return this.database;
  }

  static servers(): QuickDB {
    return this.database.servers;
  }
}

import { MongoClient, Db } from 'mongodb';

interface DatabaseInitOptions {
  connectionString: string,
  databaseName: string
}

const DEFAULT_OPTIONS : DatabaseInitOptions = {
  connectionString: process.env.MONGODB_URL,
  databaseName: process.env.MONGODB_DB_NAME
}

export class Database {

  static _db: Db;

  static async connect(options: DatabaseInitOptions = DEFAULT_OPTIONS) : Promise<Db> {
    if(this._db) {
      return this._db;
    }

    const client = new MongoClient(options.connectionString);
    await client.connect();
    return client.db(options.databaseName);
  }
}
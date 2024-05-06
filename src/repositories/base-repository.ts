/* eslint-disable @typescript-eslint/no-unused-vars */
import { EntityFactory } from '@entities/entity-factory';
import {Collection, OptionalUnlessRequiredId, ObjectId, Filter, UpdateFilter, WithoutId, FindOptions} from 'mongodb';
import { Database } from '@database';

export abstract class BaseRepository<T> {

  protected _collection: Collection<T>;
  protected readonly _factory: EntityFactory<T>;

  protected constructor(collectionName: string, entityFactory: EntityFactory<T>) {
    this._factory = entityFactory;
    this.initializeCollection(collectionName);
  }

  private async initializeCollection(collectionName: string) {
    const db = await Database.connect();
    this._collection = db.collection<T>(collectionName);
  }

  async find(query: object, options?: FindOptions<T>): Promise<T[]> {
    const items = await (this._collection.find(query, options)).toArray();
    if(!items.length) { return []; }
    return items.map(i => this._factory.toEntity(i));
  }

  async findOne(query: object): Promise<T> {
    const found = await this._collection.findOne(query);
    return found ? this._factory.toEntity(found) : null;
  }

  findById(id: string): Promise<T> {
    return this.findOne({_id: new ObjectId(id)});
  }

  async create(item: T): Promise<string|null> {
    const dbItem = this._factory.toDatabase(item);
    const inserted = await this._collection.insertOne(dbItem as OptionalUnlessRequiredId<T>);
    return inserted.acknowledged ? inserted.insertedId.toString() : null;
  }

  async updateOne(id: string, update: UpdateFilter<T>) {
    const filter : Filter<T> = {_id: new ObjectId(id)} as Filter<T>;
    await this._collection.findOneAndUpdate(filter, update);
  }

  async updateMany(filter: Filter<T>, update: UpdateFilter<T>, options?: FindOptions<T>) {
    return this._collection.updateMany(filter, update, options);
  }

  async replaceOne(id: string, entity: T) {
    const filter : Filter<T> = {_id: new ObjectId(id)} as Filter<T>;
    const dbEntity = this._factory.toDatabase(entity) as WithoutId<T>;
    await this._collection.replaceOne(filter, dbEntity);
  }
}

import { WithId } from 'mongodb';
import { IToDatabase, IToEntity } from '../../interfaces';

export abstract class EntityFactory<T> implements IToDatabase<T>, IToEntity<T> {
  toDatabase(_t: T): object {
    throw new Error('Method not implemented.');
  }
  toEntity(_object: WithId<T>): T {
    throw new Error('Method not implemented.');
  }
}

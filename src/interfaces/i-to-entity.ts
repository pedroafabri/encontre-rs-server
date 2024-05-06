import { WithId } from 'mongodb';

export interface IToEntity<T> {
  toEntity(object: WithId<T>|T): T;
}
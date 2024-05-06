export interface IToDatabase<T> {
  toDatabase(t: T): object;
}
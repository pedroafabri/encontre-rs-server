import {BaseRepository} from "../base-repository";
import {FoundPerson, FoundPersonFactory} from "@entities/found-person";

class FoundPersonRepository extends BaseRepository<FoundPerson> {
  constructor() {
    super('FoundPeople', new FoundPersonFactory());
  }

  async count() {
    return this._collection.countDocuments({});
  }

  async findPaginated(query, skip, limit) {
    const items = await this._collection.find(query).skip(skip).limit(limit).toArray();
    if(!items.length) { return []; }
    return items.map(i => this._factory.toEntity(i));
  }
}

export default new FoundPersonRepository();

import {BaseRepository} from "../base-repository";
import {FoundPerson, FoundPersonFactory} from "@entities/found-person";
import {User} from "@entities";
import {ObjectId} from "mongodb";

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

  async updateFoundBy(id: string, user: User) {
    return this.updateMany(
        {"foundBy._id": new ObjectId(id)},
        {$set: {foundBy: user}}
    )
  }
}

export default new FoundPersonRepository();

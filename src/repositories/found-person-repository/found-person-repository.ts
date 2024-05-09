import {BaseRepository} from "../base-repository";
import {FoundPerson, FoundPersonFactory} from "@entities/found-person";

class FoundPersonRepository extends BaseRepository<FoundPerson> {
  constructor() {
    super('FoundPeople', new FoundPersonFactory());
  }
}

export default new FoundPersonRepository();

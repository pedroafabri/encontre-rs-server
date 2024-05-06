import {User, UserFactory} from "@entities";
import {BaseRepository} from "../base-repository";

class UserRepository extends BaseRepository<User> {
  constructor() {
    super('Users', new UserFactory());
  }
}

export default new UserRepository();

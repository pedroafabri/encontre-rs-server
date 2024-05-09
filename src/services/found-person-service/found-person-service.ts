import { User } from "@entities";
import {FoundPerson} from "@entities/found-person";
import {ImageMissingError} from "@errors";
import { FoundPersonRepository } from "../../repositories";
import {AWSS3} from "@utils";

export class FoundPersonService {
    static async createFoundPerson(name: string, description: string, foundBy: User, image: Express.Multer.File ) {
        if(!image) { throw new ImageMissingError(); }

        const foundPerson = new FoundPerson({name, description, foundBy});
        await FoundPersonRepository.create(foundPerson);

        await AWSS3.instance.uploadBuffer(foundPerson.id, image.buffer, image.mimetype);
    }

    static async getAllFoundPeople(): Promise<FoundPerson[]> {
        const people = await FoundPersonRepository.find({});

        for(const person of people) {
            person.imageLink = AWSS3.instance.getObjectSignedURL(person.id);
        }

        return people;
    }
}

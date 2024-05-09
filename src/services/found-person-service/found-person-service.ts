import { User } from "@entities";
import {FoundPerson} from "@entities/found-person";
import {EntityNotFoundError, ImageMissingError} from "@errors";
import { FoundPersonRepository } from "../../repositories";
import {AWSS3} from "@utils";
import {PaginatedResult} from "@types";

type SearchParameters = {
    search?: string,
    page?: number,
    limit?: number,
}

export class FoundPersonService {
    static async createFoundPerson(name: string, description: string, foundBy: User, image: Express.Multer.File ) {
        if(!image) { throw new ImageMissingError(); }

        const foundPerson = new FoundPerson({name, description, foundBy});
        await FoundPersonRepository.create(foundPerson);

        await AWSS3.instance.uploadBuffer(foundPerson.id, image.buffer, image.mimetype);
    }

    static async getAllFoundPeople(params: SearchParameters): Promise<PaginatedResult<FoundPerson>> {

        const totalPeople = await FoundPersonRepository.count();
        const totalPages = Math.ceil(totalPeople / params.limit);
        const skip = (params.page - 1) * params.limit;

        const query = params.search
            ? {$text: {$search: params.search, $caseSensitive: false, $diacriticSensitive: false }}
            : {};

        const people = await FoundPersonRepository.findPaginated(query, skip, params.limit);

        for(const person of people) {
            person.imageLink = AWSS3.instance.getObjectSignedURL(person.id);
        }

        return {
            results: people,
            currentPage: params.page,
            totalPages,
            totalPeople
        };
    }

    static async getFoundPerson(id: string): Promise<FoundPerson> {
        const foundPerson = await FoundPersonRepository.findById(id);
        if(!foundPerson) {throw new EntityNotFoundError(); }
        return foundPerson;
    }

    static async updateFoundPerson(id: string, name: string, description: string, image: Express.Multer.File ) {
        const found = await FoundPersonRepository.findById(id);
        if(!found) {throw new EntityNotFoundError(`FoundPerson of ID "${id}" not found.`)}

        found.name = name ?? found.name;
        found.description = description ?? found.description;

        if(image) {
            await AWSS3.instance.deleteObject(found.id);
            await AWSS3.instance.uploadBuffer(found.id, image.buffer, image.mimetype)
            found.imageLink = AWSS3.instance.getObjectSignedURL(found.id);
        }

        await FoundPersonRepository.replaceOne(found.id, found);
        return found;
    }
}

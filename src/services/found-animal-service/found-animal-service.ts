import { User } from "@entities";
import {EntityNotFoundError, ImageMissingError, UnauthorizedError} from "@errors";
import {AWSS3, Telegram} from "@utils";
import {PaginatedResult} from "@types";
import {FoundAnimal} from "@entities/found-animal";
import {FoundAnimalRepository} from "../../repositories/found-animal-repository";

type SearchParameters = {
    search?: string,
    page?: number,
    limit?: number,
}

export class FoundAnimalService {
    static async createFoundAnimal(name: string, description: string, foundBy: User, image: Express.Multer.File, animalType: string ) {
        if(!image) { throw new ImageMissingError(); }

        const foundAnimal = new FoundAnimal({name, description, foundBy, animalType});
        await FoundAnimalRepository.create(foundAnimal);

        await AWSS3.instance.uploadBuffer(foundAnimal.id, image.buffer, image.mimetype);
        foundAnimal.imageLink = AWSS3.instance.getObjectSignedURL(foundAnimal.id);
        Telegram.instance.notifyNewFoundAnimal(foundAnimal);
    }

    static async getAllFoundAnimals(params: SearchParameters): Promise<PaginatedResult<FoundAnimal>> {

        const totalCount = await FoundAnimalRepository.count();
        const totalPages = Math.ceil(totalCount / params.limit);
        const skip = (params.page - 1) * params.limit;

        const query = params.search
            ? {$text: {$search: params.search, $caseSensitive: false, $diacriticSensitive: false }}
            : {};

        const animals = await FoundAnimalRepository.findPaginated(query, skip, params.limit);

        for(const animal of animals) {
            animal.imageLink = AWSS3.instance.getObjectSignedURL(animal.id);
        }

        return {
            results: animals,
            currentPage: params.page,
            totalPages,
            totalPeople: totalCount
        };
    }

    static async getFoundAnimal(id: string): Promise<FoundAnimal> {
        const foundAnimal = await FoundAnimalRepository.findById(id);
        if(!foundAnimal) {throw new EntityNotFoundError(); }
        foundAnimal.imageLink = AWSS3.instance.getObjectSignedURL(foundAnimal.id);
        return foundAnimal;
    }

    static async updateFoundAnimal(id: string, name: string, description: string, animalType: string, image : Express.Multer.File, user: User ) {
        const found = await FoundAnimalRepository.findById(id);
        if(!found) {throw new EntityNotFoundError(`FoundAnimal of ID "${id}" not found.`)}
        if(found.foundBy.id !== user.id) {throw new UnauthorizedError('FoundAnimal not owned by user.')}

        found.name = name ?? found.name;
        found.description = description ?? found.description;
        found.animalType = animalType ?? found.animalType;

        if(image) {
            await AWSS3.instance.deleteObject(found.id);
            await AWSS3.instance.uploadBuffer(found.id, image.buffer, image.mimetype)
            found.imageLink = AWSS3.instance.getObjectSignedURL(found.id);
        }

        await FoundAnimalRepository.replaceOne(found.id, found);
        return found;
    }

    static async deleteFoundAnimal(id: string, user: User) {
        const found = await FoundAnimalRepository.findById(id);
        if(!found) {throw new EntityNotFoundError(`FoundAnimal of ID "${id}" not found.`)}
        if(found.foundBy.id !== user.id) {throw new UnauthorizedError('FoundAnimal not owned by user.')}

        await FoundAnimalRepository.deleteById(id);
    }
}

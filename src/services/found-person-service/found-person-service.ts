import { User } from "@entities";
import {FoundPerson} from "@entities/found-person";
import {ImageMissingError} from "@errors";
import { FoundPersonRepository } from "../../repositories";
import AWS, {Credentials} from 'aws-sdk';

export class FoundPersonService {
    static async createFoundPerson(name: string, description: string, foundBy: User, image: Express.Multer.File ) {
        if(!image) { throw new ImageMissingError(); }

        const foundPerson = new FoundPerson({name, description, foundBy});
        await FoundPersonRepository.create(foundPerson);

        let extArray = image.mimetype.split("/");
        let extension = extArray[extArray.length - 1];

        await this.uploadImageToS3(`${foundPerson.id}.${extension}`, image.buffer);
    }

    private static async uploadImageToS3(userId: string, image: Buffer) {
        const credentials = new Credentials({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY,
            secretAccessKey: process.env.AWS_S3_SECRET,
        });
        AWS.config.update({
            credentials,
            region: process.env.AWS_S3_REGION,
        });

        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: userId,
            Body: image,
        };

        const s3 = new AWS.S3();

        await s3.upload(params).promise();
    }
}

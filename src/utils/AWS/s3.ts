import AWS, {Credentials, S3} from "aws-sdk";

export class AWSS3 {
    private static _instance: AWSS3 = null;
    private readonly _s3: S3;

    constructor() {
        const credentials = new Credentials({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY,
            secretAccessKey: process.env.AWS_S3_SECRET,
        });
        AWS.config.update({
            credentials,
            region: process.env.AWS_S3_REGION,
        });

        this._s3 = new AWS.S3();
    }

    static initialize() {
        if(this.instance !== null) {
            throw new Error('AWS S3 already initialized. Are you calling AWSS3.initialize() twice?');
        }
        this.instance = new AWSS3();
    }

    static get instance(): AWSS3 {
        return this._instance;
    }

    static set instance(value: AWSS3) {
        this._instance = value;
    }

    async uploadBuffer(key: string, buffer: Buffer, contentType: string) {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        };

        return this._s3.putObject(params).promise();
    }

    getObjectSignedURL(key: string): string {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
        }

        return this._s3.getSignedUrl('getObject', params);
    }
}

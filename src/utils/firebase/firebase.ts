import {App, cert, initializeApp} from "firebase-admin/app";
import {getAuth, DecodedIdToken, UserRecord} from "firebase-admin/auth";
import * as console from "node:console";

export class Firebase {
    private static _instance: Firebase = null;

    private app: App = null;

    static get instance(): Firebase {
        return this._instance;
    }

    constructor() {
        const buffer = Buffer.from(process.env.FIREBASE_CONFIG_BASE64, 'base64')
        const credential = JSON.parse(buffer.toString('ascii'));
        this.app = initializeApp({credential: cert(credential)});
    }

    public static initialize() {
        if(Firebase._instance !== null) {
            throw new Error("Firebase already initialized. Are you calling Firebase.initialize() twice?");
        }
        Firebase._instance = new Firebase();
    }

    public validateIDToken(token: string) : Promise<DecodedIdToken> {
        return new Promise((resolve, reject) => {
            getAuth(this.app)
                .verifyIdToken(token)
                .then(resolve)
                .catch(reject);
        })
    }

    public getUser(id: string) : Promise<UserRecord> {
        return new Promise((resolve, reject) => {
            getAuth(this.app)
                .getUser(id)
                .then(resolve)
                .catch(reject);
        })
    }
}

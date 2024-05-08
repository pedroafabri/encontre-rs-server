import jwt, { JwtPayload } from 'jsonwebtoken';
import * as process from "node:process";

const JWT_SECRET = process.env.JWT_SECRET || '';

export class JWT {
  static Sign(payload: object) : string {
    return jwt.sign(payload, JWT_SECRET);
  }

  static Verify(token: string) : boolean {
    try {
      jwt.verify(token, JWT_SECRET);
      return true;
    } catch(e) {
      console.error(e);
      return false;
    }
  }

  static Decode(token: string) : string | JwtPayload {
    return jwt.decode(token);
  }
}

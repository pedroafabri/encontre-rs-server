import Server from '@server';
import * as process from "node:process";
import {Firebase, AWSS3} from "@utils";

const PORT = Number(process.env.PORT) || 4000;

Firebase.initialize();
AWSS3.initialize();
Server.listen(PORT);

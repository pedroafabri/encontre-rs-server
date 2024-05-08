import Server from '@server';
import * as process from "node:process";
import {Firebase} from "@utils";

const PORT = Number(process.env.PORT) || 4000;

Firebase.initialize();

Server.listen(PORT);

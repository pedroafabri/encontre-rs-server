import Server from '@server';

const PORT = Number(process.env.SERVER_PORT) || 4000;

Server.listen(PORT);

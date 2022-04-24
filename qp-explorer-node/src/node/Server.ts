import { DaemonHttp } from './DaemonHttp';

const port = Number(process.env.PORT || '8089');

DaemonHttp.run(port);
console.log(`running on ${port}.....`);

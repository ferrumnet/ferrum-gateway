import { Container, ValidationUtils } from "ferrum-plumbing";
import { Lazy } from "types/dist/Lazy";
import http from "http";
import { LambdaGlobalContext } from "aws-lambda-helper";
import { NodeModule } from "./NodeModule";
import { Utils } from "types";
import { QpNode } from "./QpNode";

const containerLazy = Lazy.forAsync<Container>(async () => {
  try {
    const container = await LambdaGlobalContext.container();
    await container.registerModule(new NodeModule());
    return container;
  } catch(e) {
    console.error('Error initializing the container', e);
    throw e;
  }
});

function sendError(res: http.ServerResponse, message: string) {
  res.writeHead(400, {});
  res.end(message);
}

function sendOk(res: http.ServerResponse, message: string) {
  res.writeHead(200, {});
  res.end(message);
}

async function syncForNetwork(
  network: string,
): Promise<string> {
  ValidationUtils.isTrue(!!network, '"network" is required');
  const c = await containerLazy.getAsync();
  const node = c.get<QpNode>(QpNode);
  await node.process(network);
  return "Request submitted";
}

console.log("Running dawmonHttp for the qp explorer node");
/**
 * This is to be only run on a local docker container with no external access.
 *  */
export class DaemonHttp {
  static run(port: number) {
    http
      .createServer(async (req, res) => {
        const { headers, method, url } = req;
        let body: any = [];
        req
          .on("error", (err) => {
            console.error(err);
          })
          .on("data", (chunk) => {
            body.push(chunk);
          })
          .on("end", async () => {
            const command = Utils._getQueryparam(url, "command");
            const network = Utils._getQueryparam(url, "network");
            console.log(`${url}?command=${command}&network=${network}`);

            try {
              let output: string = "";
              switch (command) {
                case "sync":
                  output = await syncForNetwork(
                    network,
                  );
                  break;
                default:
                  sendError(res, "Bad command: " + command);
              }

              sendOk(res, output);
            } catch (e) {
              console.error(e as Error);
              sendError(res, (e as Error).toString());
            }

            res.on("error", (err) => {
              console.error(err);
            });
          });
      })
      .listen(port);
  }
}

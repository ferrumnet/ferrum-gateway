import { Container, ValidationUtils } from "ferrum-plumbing";
import { Lazy } from "types/dist/Lazy";
import http from "http";
import { LambdaGlobalContext } from "aws-lambda-helper";
import { NodeModule } from "./NodeModule";
import { BridgeNodeV1 } from "./BridgeNodeV1";
import { Utils } from "types";
import { PrivateKeyProvider } from "../common/PrivateKeyProvider";

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
  txId?: string,
  lookBackBlocks?: string,
  lookBackSeconds?: string
): Promise<string> {
  ValidationUtils.isTrue(!!network, '"network" is required');
  const c = await containerLazy.getAsync();
  const node = c.get<BridgeNodeV1>(BridgeNodeV1);
  if (!!txId) {
    await node.processFromTx(network as any, txId!);
    return "Request submitted";
  } else {
    await node.processFromHistory(network as any);
    return "Request submitted";
  }
}

async function init(twoFa: string): Promise<string> {
  if (process.env.NODE_ENV === 'production' && process.env.NO_TWO_FA !== 'true') {
    ValidationUtils.isTrue(!!twoFa, '"twoFa" is required');
  }
  const c = await containerLazy.getAsync();
  const node = c.get<BridgeNodeV1>(BridgeNodeV1);
  await node.init(twoFa);
  return "done";
}

async function printSigner(): Promise<string> {
  const c = await containerLazy.getAsync();
  const node = c.get<PrivateKeyProvider>(PrivateKeyProvider);
  return node.address();
}

console.log("Running dawmonHttp for the bridge");
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
            const txId = Utils._getQueryparam(url, "txId");
            const lookBackBlocks = Utils._getQueryparam(url, "lookBackBlocks");
            const lookBackSeconds = Utils._getQueryparam(
              url,
              "lookBackSeconds"
            );
            const twoFa = Utils._getQueryparam(url, "2fa") || Utils._getQueryparam(url, "twoFa");
            console.log(`${url}?command=${command}&network=${network}&txId=${txId}`);

            try {
              let output: string = "";
              switch (command) {
                case "init":
                  output = await init(twoFa);
                  break;
                case "sync":
                  output = await syncForNetwork(
                    network,
                    txId,
                    lookBackBlocks,
                    lookBackSeconds
                  );
                  break;
                case "printSigner":
                  output = await printSigner();
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

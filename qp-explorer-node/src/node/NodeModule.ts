import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Container, LoggerFactory, Module, ValidationUtils } from "ferrum-plumbing";
import { AppConfig, CommonBackendModule } from "common-backend";
import { QpExplorerNodeConfig } from "../QpExplorerNodeConfig";
import { QpNode } from "./QpNode";

export class NodeModule implements Module {
  async configAsync(container: Container) {
    const conf: QpExplorerNodeConfig = AppConfig.instance().fromFile().get<QpExplorerNodeConfig>();
	ValidationUtils.isTrue(!!conf.providers, 'Error: no provider is configured for a chain');
	const configedChains = Object.keys(conf.providers);
	console.log('Following networks are configured in the config file: ', configedChains);
	ValidationUtils.isTrue(!!configedChains.length, 'Error: no provider is configured for a chain');
    (await AppConfig.instance().forChainProviders('', configedChains)
	).chainsRequired('', configedChains);

	await container.registerModule(new CommonBackendModule());

	container.registerSingleton(QpNode,
		c => new QpNode(
			c.get(LoggerFactory),
			c.get(EthereumSmartContractHelper),
			conf,
		));

	await container.get<QpNode>(QpNode).init(conf as any);
  }
}

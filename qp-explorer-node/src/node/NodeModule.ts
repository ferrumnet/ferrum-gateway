import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Container, LoggerFactory, Module, ValidationUtils } from "ferrum-plumbing";
import { AppConfig, CommonBackendModule } from "common-backend";
import { QpExplorerNodeConfig } from "../QpExplorerNodeConfig";
import { QpNode } from "./QpNode";
import { MongooseConfig } from "aws-lambda-helper";

export class NodeModule implements Module {
  async configAsync(container: Container) {
	await AppConfig.instance().forChainProviders();
    await AppConfig.instance().fromSecret('', 'QP_EXPLORER');
    // const conf: QpExplorerNodeConfig = AppConfig.instance().fromFile().get<QpExplorerNodeConfig>();
	// ValidationUtils.isTrue(!!conf.providers, 'Error: no provider is configured for a chain');
	// const configedChains = Object.keys(conf.providers);
	// console.log('Following networks are configured in the config file: ', configedChains);
	// ValidationUtils.isTrue(!!configedChains.length, 'Error: no provider is configured for a chain');
    // (await AppConfig.instance().forChainProviders('', configedChains)
	// ).chainsRequired('', configedChains);

	await container.registerModule(new CommonBackendModule());

	const conf = {

		providers: AppConfig.instance().getChainProviders(),
	} as QpExplorerNodeConfig;
	container.registerSingleton(QpNode,
		c => new QpNode(
			c.get(LoggerFactory),
			c.get(EthereumSmartContractHelper),
			conf,
		));
	const db = AppConfig.instance().get('database') as MongooseConfig;
	await container.get<QpNode>(QpNode).init(db);
  }
}

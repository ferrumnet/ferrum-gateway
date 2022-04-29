import { EthereumSmartContractHelper, } from "aws-lambda-helper/dist/blockchain";
import { AuthTokenParser, } from 'aws-lambda-helper';
import { Container, Module, LoggerFactory, ConsoleLogger } from "ferrum-plumbing";
import { AppConfig, CommonBackendModule, WithDatabaseConfig, WithJwtRandomBaseConfig } from "common-backend";
import { CommonRpcHttpHandler } from 'common-backend/dist/app/CommonRpcHttpHandler';
import { QpExplorerNodeConfig } from "../QpExplorerNodeConfig";
import { QuantumPortalExplorerRequestProcessor } from "./QuantumPortalExplorerRequestProcessor";
import { QpExplorerService } from "./QpExplorerService";

export class QpBackendModule implements Module {
  static async configuration() {
    AppConfig.instance().orElse('', () => ({
    }));
  }

  async configAsync(container: Container) {
    await AppConfig.instance().forChainProviders();
    await AppConfig.instance().fromSecret('', 'QP_EXPLORER');
    AppConfig.instance().orElse('', () => ({
      database: {
        connectionString: AppConfig.env('MONGOOSE_CONNECTION_STRING')
      },
      cmkKeyId: AppConfig.env('CMK_KEY_ID'),
      jwtRandomBase: AppConfig.env('JWT_RANDOM_KEY'),
    }));

    AppConfig.instance()
      .required<WithDatabaseConfig&WithJwtRandomBaseConfig>('', c => ({
        'MONGOOSE_CONNECTION_STRING': c.database.connectionString!,
        'JWT_RANDOM_KEY': c.jwtRandomBase,
      }));

    container.register(LoggerFactory, () => new LoggerFactory(n => new ConsoleLogger(n)));

    container.registerSingleton(QpExplorerService,
      c => new QpExplorerService(
        c.get(LoggerFactory),
        c.get(EthereumSmartContractHelper),
        conf,
      ));

	  container.registerSingleton(QuantumPortalExplorerRequestProcessor,
      c => new QuantumPortalExplorerRequestProcessor(
        c.get(QpExplorerService),
      ));

    container.registerSingleton(
      "LambdaHttpHandler",
      (c) =>
        new CommonRpcHttpHandler(
          [c.get(QuantumPortalExplorerRequestProcessor)],
          c.get(AuthTokenParser),
          c.get(LoggerFactory),
        )
    );

    await container.registerModule(new CommonBackendModule());

    const conf = AppConfig.instance().get<QpExplorerNodeConfig>();
		await container.get<QpExplorerService>(QpExplorerService).init(conf.database);
  }
}

import { WithDatabaseConfig } from "common-backend";
import { NetworkedConfig } from "ferrum-plumbing";
import { QuantumPortalContracts } from "qp-explorer-commons";

export interface QpExplorerNodeConfig extends WithDatabaseConfig {
	providers: NetworkedConfig<string>;
	contracts: NetworkedConfig<QuantumPortalContracts>;
}
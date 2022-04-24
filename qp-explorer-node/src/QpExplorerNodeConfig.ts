import { WithDatabaseConfig } from "common-backend";
import { NetworkedConfig } from "ferrum-plumbing";

export interface QpExplorerNodeConfig extends WithDatabaseConfig {
	providers: NetworkedConfig<string>;
}
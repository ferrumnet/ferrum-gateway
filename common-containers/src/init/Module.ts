import { ConsoleLogger, Container, LoggerFactory, Module, NetworkedConfig } from "ferrum-plumbing";
import { ApiClient } from "../clients/ApiClient";
import { Web3RetrofitModule } from "unifyre-extension-web3-retrofit";
import { Web3ModalProvider } from 'unifyre-extension-web3-retrofit/dist/contract/Web3ModalProvider';
import { ClientModule, UnifyreExtensionKitClient } from "unifyre-extension-sdk";
import { GitHubConstants } from "../clients/GitHubConstants";
import { StandaloneClient } from "../clients/StandaloneClient";
import { StandaloneErc20 } from "../clients/StandaloneErc20";

class DummyStorage {}

export class CommonModule implements Module {
    constructor(private apiUrl: string) { }

    async configAsync(c: Container): Promise<void> {
        c.register(LoggerFactory, () => new LoggerFactory(n => new ConsoleLogger(n)));
        c.register('JsonStorage', () => new DummyStorage());
        await c.registerModule(new ClientModule('http://', 'BASE'));
        await c.registerModule(new Web3RetrofitModule('BASE', []));

        c.registerSingleton(GitHubConstants, c => new GitHubConstants());
        c.registerSingleton(StandaloneClient, c => new StandaloneClient([], c.get(GitHubConstants), c.get(UnifyreExtensionKitClient)));
        c.registerSingleton(StandaloneErc20, c => new StandaloneErc20(c.get(StandaloneClient)));

        c.registerSingleton(ApiClient, c => new ApiClient(this.apiUrl, c.get(UnifyreExtensionKitClient)));
        const client = c.get<ApiClient>(ApiClient);
        const {providers,} = await client.loadBackendConstants();
        c.registerSingleton('Web3ModalProvider', () => new Web3ModalProvider(providers));

        // c.registerSingleton(UserPreferenceService, () => new UserPreferenceService());
        // IntlManager.instance.load([stringsEn], 'en-US');
        // IocModule._container = c;

        // init other dependencies
        // c.get<UserPreferenceService>(UserPreferenceService).init(dispatch);

        // PairAddressService
    }
}
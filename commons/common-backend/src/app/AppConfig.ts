import { AwsEnvs, MongooseConfig, SecretsProvider } from "aws-lambda-helper";
import { Fetcher, NetworkedConfig, ValidationUtils } from "ferrum-plumbing";
import { loadConfigFromFile } from "../dev/DevConfigUtils";
import { BackendConstants } from 'types';

require('dotenv').config()

export interface WithJwtRandomBaseConfig {
    jwtRandomBase: string;
}

export interface WithDatabaseConfig {
    database: MongooseConfig,
}

export interface WithKmsConfig {
    cmkKeyId: string,
}

/**
 * Configuratio for the app.
 * Examples:
 * const c = AppConfig.instance();
 * (await c.fromSecret('CHAIN_CLIENTS')).
 *   .orElse(() => return ({
 *     ETHEREUM: AppConfig.fromEnv('ETHEREUM_ENDPOINT'),
 *   }))
 *   .required<Web3EndpointConfig>(c => ({
 *      'Eth Endpoint required': c.ETHEREUM,
 *   }))
 *   .get<Web3EndpointConfig>();
 */
export class AppConfig {
    private static _instance: AppConfig;
    private static DEFAULT_CONSTANTS = 'https://raw.githubusercontent.com/ferrumnet/ferrum-token-list/main/bridge/constants.json';
    private static CONFIG_FILE_PREFIX = 'CONFIG_FILE_';
    static instance() {
        if (!AppConfig._instance) {
            AppConfig._instance = new AppConfig();
        }
        return AppConfig._instance;
    }

    static env(e: string, def?: string): string|undefined {
        if (e) {
            return process.env[e] || def;
        }
    }

    static awsRegion(): string {
        return (
        process.env.AWS_REGION ||
        process.env[AwsEnvs.AWS_DEFAULT_REGION] ||
        "us-east-2"
        );
    }

    private conf: any = {};
    private _constants: BackendConstants = {} as any;

    get<T>(field?: string): T {
        if (field) {
            return this.conf[field] as T;
        }
        return this.conf as T;
    }

    fromFile(field?: string, path?: string) {
        const conf = loadConfigFromFile<any>(path);
        if (field) {
            this.conf[field] = {
                ...(this.conf[field] || {}),
                ...conf,
            };
        } else {
            this.conf = {
                ...this.conf,
                ...conf,
            }
        }
        return this;
    }

    /**
     * Loads configuration from secret. If secret not configured, it will check the config file.
     */
    async fromSecret(
        field: string,
        secretSuffix: string,
    ) {
      const region = AppConfig.awsRegion();
      const confArn = process.env[AwsEnvs.AWS_SECRET_ARN_PREFIX + secretSuffix];
      const confFilePath = process.env[AppConfig.CONFIG_FILE_PREFIX + secretSuffix];
        if (confArn) {
            const conf = await new SecretsProvider(region, confArn).get();
            if (!!field) {
                this.conf[field] = {
                    ...(this.conf[field] || {}),
                    ...conf
                };
            } else {
                this.conf = {
                    ...this.conf,
                    ...conf,
                };
            }
        } else if (!!confFilePath) {
            this.fromFile(field, confFilePath);
        }
        return this;
    }

    async loadConstants(path?: string) {
        const fetcher = new Fetcher(undefined);
        this._constants = await fetcher.fetch(path || AppConfig.DEFAULT_CONSTANTS, undefined) || {} as any;
    }
    
    constants() {
        return this._constants;
    }

    /**
     * Configs chain providers. By default it expects the providers field in the config
     * file.
     * If the chain config file exists the following environment variables must be provided:
     * CONFIG_FILE_CHAIN_CONFIG="..."
     */
    async forChainProviders(field?: string, supportedChains?: string[]) {
        return (await this.fromSecret(field || 'providers', 'CHAIN_CONFIG'));
    }

    getChainProviders(field?: string): NetworkedConfig<string> {
        return this.get<NetworkedConfig<string>>(field || 'providers');
    }

    orElse(field: string, setter: () => any) {
        const res = setter();
        if (field) {
            this.conf[field] = {
                ...res,
                ...(this.conf[field] || {}),
            };
        } else {
            this.conf = {
                ...res,
                ...this.conf,
            };
        }
        return this;
    }

    set(field: string, setter: () => any) {
        const res = setter();
        if (field) {
            this.conf[field] = {
                ...(this.conf[field] || {}),
                ...res,
            };
        } else {
            this.conf = {
                ...this.conf,
                ...res,
            };
        }
        return this;
    }

    required<T>(field: string, selector: (c: T) => any) {
        const res = selector(field ? this.conf[field] : this.conf);
        Object.keys(res).forEach(k => {
            ValidationUtils.isTrue(res[k] !== undefined, k);
        });
        return this;
    }

    chainsRequired(field: string, chains: string[]) {
        return this.required<NetworkedConfig<string>>(field || 'providers', c => {
            const rv = {} as any;
            chains.forEach(c => {
                rv[c] = ((field ? this.conf[field] : this.conf['providers']) || {})[c];
            });
            return rv;
        })
    }
}
import { ValidationUtils } from "ferrum-plumbing";

const STAGING_PREFIXES = ['dev','qa','uat','staging'];

export type AppUiStage = 'local' | 'dev' | 'qa' | 'uat' | 'staging' | 'prod';

export type UiStageEndpoint = { [k in AppUiStage]: string };

export class Environment {
	static DEFAULT_ENDPOINTS: UiStageEndpoint = {
		local: 'http://localhost:8080',
		dev: 'https://api-gateway.dev.svcs.ferrumnetwork.io/gateway-backend-dev',
		qa: 'https://api-gateway.dev.svcs.ferrumnetwork.io/gateway-backend-dev',
		uat: 'https://api-gateway.dev.svcs.ferrumnetwork.io/gateway-backend-dev',
		staging: 'https://api-gateway.stage.svcs.ferrumnetwork.io/gateway-backend-staging',
		prod: 'https://api-gateway.svcs.ferrumnetwork.io/gateway-backend-prod',
	};

	static uiStage(): AppUiStage {
		if (!!process.env.OVERRIDE_UI_STAGE) {
			return process.env.OVERRIDE_UI_STAGE as any;
		}
		// @ts-ignore
		const base = (window.location?.origin || '').toLowerCase();
		const isCompiled = process.env.NODE_ENV === 'production';
		if (!isCompiled) {
			return 'local';
		}
		const prefix = STAGING_PREFIXES.find(p => base.includes(`-${p}`||`https://${p}`));
		if (prefix) {
			console.log(prefix,'current-prefix')
			return prefix as AppUiStage;
		}
		return 'prod';
	}

	static defaultEndPoint(): string {
		const ep = Environment.DEFAULT_ENDPOINTS[Environment.uiStage()];
		ValidationUtils.isTrue(!!ep, `No endpoint for "${Environment.uiStage()}"`);
		return ep!;
	}
}
import { ValidationUtils } from "ferrum-plumbing";

const STAGING_PREFIXES = ['https://staging'];

export type AppUiStage = 'dev' | 'staging' | 'prod';

export type UiStageEndpoint = { [k in AppUiStage]: string };

export class Environment {
	static DEFAULT_ENDPOINTS: UiStageEndpoint = {
		dev: 'http://localhost:8080',
		staging: 'https://an54zzyt9h.execute-api.ap-south-1.amazonaws.com/default/test',
		prod: 'https://sij6ulh6gc.execute-api.us-east-2.amazonaws.com/default/prod-gateway-backend',
	};

	static uiStage(): AppUiStage {
		if (!!process.env.OVERRIDE_UI_STAGE) {
			return process.env.OVERRIDE_UI_STAGE as any;
		}
		// @ts-ignore
		const base = (window.location?.origin || '').toLowerCase();
		const isCompiled = process.env.NODE_ENV === 'production';
		if (!isCompiled) {
			return 'dev';
		}
		if (STAGING_PREFIXES.find(p => base.startsWith(p))) {
			return 'staging';
		}
		return 'prod';
	}

	static defaultEndPoint(): string {
		const ep = Environment.DEFAULT_ENDPOINTS[Environment.uiStage()];
		ValidationUtils.isTrue(!!ep, `No endpoint for "${Environment.uiStage()}"`);
		return ep!;
	}
}
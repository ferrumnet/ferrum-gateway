import { NetworkedConfig } from "types";
import fs from 'fs';
import { ValidationUtils } from "ferrum-plumbing";

export function networkEnvConfig<T>(networks: string[], prefix: string, fun: (v: string) => T): NetworkedConfig<T>|undefined {
	const rv: NetworkedConfig<T> = {};
	let anyValue: boolean = false;
	networks.forEach(net => {
		const env = process.env[prefix + '_' + net] || process.env[prefix + '_DEFAULT'] || '';
		const value = fun(env);
		rv[net] = value;
		anyValue = anyValue || !!value;
	});
	console.log('Network ENV config for ' + prefix + ':', rv);
	return  anyValue ? rv : undefined;
}

export function loadConfigFromFile<T>(): T {
	let configFiles = ['/config.json'].concat( (process.env.CONFIG_FILES || '').split(',') );
	let rv: T|undefined = undefined;
	configFiles.filter(f => fs.existsSync(f))
		.forEach(f => {
			const conf = JSON.parse(fs.readFileSync(f).toString('utf-8'));
			rv = {...(rv || {}), ...conf};
		});
	ValidationUtils.isTrue(!!rv, 'No config file was found. Consider setting CONFIG_FILES env');
	return rv!;
}
import { Injectable,ValidationUtils } from "ferrum-plumbing";
import { SwapProtocol,DefaultTokenPriceConfig,SwapProtocolConfigs, Utils,USD_PAIR } from "types";
import { OneInchClient } from './OneInchClient';

export class OneInchPricingService implements Injectable{
    constructor(
        private oneInchClient: OneInchClient
    ){}

    __name__() { return 'OneInchPricingService'; }

    async getPairQuote(protocol: SwapProtocol[], from: string, to:string, amount: string){
        try {    
            const quote = await this.oneInchClient.quote(from, to, amount, protocol)
            if(!!quote){
                return quote
            }
        } catch (e) {
            console.log(e)
        }
    
    }

    private async protocolConfigForCur(protocol: string, currency: string) {
		// TODO Try to get from database
		const config = DefaultTokenPriceConfig[currency] || {};
		return config[protocol] || config['DEFAULT'] || {};
	}

	//to be refactored to use oneinch protocols
	private protocols  = {
		"RINKEBY": 'ETHEREUM:UNISWAP_V2',
		"ETHEREUM": 'ETHEREUM:UNISWAP_V2',
		"BSC": 'BSC:APESWAP'
	}

    async usdPrice(fromCurrency: string) {
		try {
			const [network, _] = Utils.parseCurrency(fromCurrency)
			const protocol = await this.oneInchClient.protocols(network);
			ValidationUtils.isTrue(!!protocol,`Protocol ${protocol} is not cofigured for network`);
		    //@ts-ignore
			return this.getPairQuote([this.protocols[network.toUpperCase()] as any],fromCurrency , USD_PAIR[network] , '1');
		} catch (e) {
			console.error('price request error', e as Error);
			return '';
		}
	}

}

export class Service extends MogooseConnection implements Injectable {
    private model: Model<Winner&Document>|undefined;
    constructor(
        private helper: EthereumSmartContractHelper,
        private endpoints: NetworkedConfig<string>,
        private contractAddress: NetworkedConfig<string>,
    ) {
        super();
    }

    __name__() { return 'Service'; }

    init(c: Connection) {
        this.model = new WinnersModel(c);
    }

    async getWinners() {
        this.verifyInit();
        const ws = this.model.find({}).exec();
        return ws.map(w => w.toJSON());
    }

    async getLastWinner(network: string) {
        const c = await this.contract(network);
        const w = await c.methods.winner().call();
        return w.toString();
    }

    async getBuyTransaction(network: string, from: string) {
        const c = await this.contract(network);
        const w = await c.methods.buy();
        const nonce = await this.helper.web3(w.sendNetwork).getTransactionCount(from, 'pending');
        return EthereumSmartContractHelper.callRequest(this.contractAddress[network],
                '',
                from,
                w.encodeABI(),
                undefined,
                nonce,
                `Buy`);
    }

    async contract(network: string) {
        const web3 = await this.helper.web3(network);

        return new web3.Contract(abi, this.contractAddress[network]);
    }
}

const abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "winner",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "buy",
        "outputs": [],
        "stateMutability": "",
        "type": "function"
    }
];

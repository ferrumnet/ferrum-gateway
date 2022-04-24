import { Service } from "./Service";

export class RequestProcessor
  extends HttpRequestProcessor
  implements Injectable
{
	__name__() { return 'RequestProcessor'; }

  constructor(private svc: Service) {
    super();

    this.registerProcessorAuth("getBuyTransaction",
        (req, auth) => this.svc.getBuyTransaction(req.data.network, auth.userId));
    this.registerProcessorAuth("lastWinner",
        (req, auth) => this.svc.getLastWinner(req.data.network));
    this.registerProcessorAuth("winners",
        (req, auth) => this.svc.getWinners());
  }
}
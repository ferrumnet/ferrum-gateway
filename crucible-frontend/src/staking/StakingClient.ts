import { ApiClient } from 'common-containers';
import { Injectable } from 'ferrum-plumbing';

export class StakingClient implements Injectable {
	constructor(
		private api: ApiClient,
	) { }

	__name__() { return 'StakingClient'; }
}
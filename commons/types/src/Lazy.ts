import { ValidationUtils } from "ferrum-plumbing";

export class Lazy<T> {
	private isSet: boolean = false;
	private val: T | undefined;
	private p: Promise<T|undefined> | undefined;
	private constructor(
		private fun: () => (T|undefined) | Promise<T|undefined>) {}
	static forAsync<T2>(fun: () => Promise<T2>) {
		return new Lazy(fun);
	}
	static for<T2>(fun: () => T2) {
		return new Lazy(fun);
	}

	get(): T|undefined {
		if (!this.isSet) {
			this.val = this.fun() as T;
			this.isSet = true;
		}
		return this.val;
	}

	async getAsync(): Promise<T|undefined> {
		if (!this.isSet) {
			if (this.p) {
				await this.p;
				ValidationUtils.isTrue(this.isSet, "Pending lazy promise did not set our value!");
			} else {
				this.p = this.fun() as Promise<T|undefined>;
				this.val = await this.p;
				this.isSet = true;
			}
		}
		return this.val;
	}
}
import { Container } from "ferrum-plumbing";

function injectMany(...args: any[]): any[] {
    return args.map(t => IocModule.container().get(t)) as any;
}

export function inject<T1>(...args: any[]): T1 {
    return (injectMany(...args) as any)[0];
}

export function inject2<T1, T2>(...args: any[]): [T1, T2] {
    return injectMany(...args) as any;
}

export function inject3<T1, T2, T3>(...args: any[]): [T1, T2, T3] {
    return injectMany(...args) as any;
}

export function inject4<T1, T2, T3, T4>(...args: any[]): [T1, T2, T3, T4] {
    return injectMany(...args) as any;
}

export function inject5<T1, T2, T3, T4, T5>(...args: any[]): [T1, T2, T3, T4, T5] {
    return injectMany(...args) as any;
}

export class IocModule {
    private static _container: Container;
    static async init() {
        if (!!IocModule._container) {
            return IocModule._container;
        }
        const c = new Container();
        IocModule._container = c;
        return c;
    }
    static container() {
        return IocModule._container;
    }
}
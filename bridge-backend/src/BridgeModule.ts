import { Container, Module } from "ferrum-plumbing";

export class BridgeModule implements Module {
    configAsync(c: Container): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
import { ValidationUtils } from "ferrum-plumbing";

export type AuthenticationTokenType = "json" | "ecdsa" | "hmac" | "none";

export interface AuthTokens {
  authType: AuthenticationTokenType;
  userId?: string;
  hmacPublicKey?: string;
  ecdsaAddress?: string;
}

export interface HttpRequestData {
  command: string;
  data: any;
  userId?: string;
}

export type RequestProcessorFunction = (
  req: HttpRequestData,
  userId?: string,
) => Promise<any>;

export type RequestProcessorFunctionAuth = (
  req: HttpRequestData,
  auth: AuthTokens
) => Promise<any>;

export type RequestProcessorMap = { [k: string]: RequestProcessorFunction };
export type RequestProcessorMapAuth = { [k: string]: RequestProcessorFunctionAuth };

export abstract class HttpRequestProcessor {
  private processor: RequestProcessorMap = {};
  private processorAuth: RequestProcessorMapAuth = {};
  protected registerProcessor(command: string, fun: RequestProcessorFunction) {
    ValidationUtils.isTrue(
        !this.processorAuth[command] && !this.processor[command],
        `Command '${command}' already registered`,
    );
    this.processor[command] = fun;
  }

  protected registerProcessorAuth(command: string, fun: RequestProcessorFunctionAuth) {
    ValidationUtils.isTrue(
        !this.processorAuth[command] && !this.processor[command],
        `Command '${command}' already registered`,
    );
    this.processorAuth[command] = fun;
  }

  for(command: string): RequestProcessorFunction | undefined {
    return this.processor[command] || this.processorAuth[command];
  }

  static authType(token: string): AuthenticationTokenType {
    if (!token) {
      return "none";
    }
    if (token.startsWith("hmac/")) {
      return "hmac";
    }
    if (token.startsWith("ecdsa/")) {
      return "ecdsa";
    }
    return "json";
  }
}

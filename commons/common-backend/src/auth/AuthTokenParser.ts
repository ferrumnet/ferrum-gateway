import {
  LambdaHttpHandlerHelper,
  LambdaHttpRequest,
  UnifyreBackendProxyService,
} from "aws-lambda-helper";
import { EcdsaAuthProvider } from "aws-lambda-helper/dist/security/EcdsaAuthProvider";
import { HmacApiKeyStore } from "aws-lambda-helper/dist/security/HmacApiKeyStore";
import { HmacAuthProvider } from "aws-lambda-helper/dist/security/HmacAuthProvider";
import { Injectable, ValidationUtils } from "ferrum-plumbing";
import { AuthTokens, HttpRequestProcessor } from 'types';

export class AuthTokenParser implements Injectable {
  constructor(
    private uniBack: UnifyreBackendProxyService,
    private hmacApiKeyStore: HmacApiKeyStore
  ) {}

  __name__(): string {
    return "AuthTokenParser";
  }

  async authTokens(request: LambdaHttpRequest): Promise<AuthTokens> {
    const headers = request.headers as any;
    const token = (headers.authorization || headers.Authorization || "").split(
      " "
    )[1];
    const authType = HttpRequestProcessor.authType(token);
    // Get extra auth data
    if (authType === "hmac") {
      const auth = new HmacAuthProvider(
        "", // TODO: use the url to avoid cross-service
        request.body,
        0,
        undefined,
        undefined,
        this.hmacApiKeyStore.publicToSecret
      );
      const [valid, reason] = await auth.isValidAsync(request.headers);
      ValidationUtils.isTrue(valid, "Authentication failed: " + reason);
      return {
        authType,
        hmacPublicKey: auth.getAuthSession(),
      } as AuthTokens;
    }

    if (authType === "ecdsa") {
      const auth = new EcdsaAuthProvider(
        "", // TODO: use the url to avoid cross-service
        request.body,
        undefined,
        undefined,
        async (a) => true
      );
      const [valid, reason] = await auth.isValidAsync(request.headers);
      ValidationUtils.isTrue(valid, "Authentication failed: " + reason);
      return {
        authType,
        ecdsaAddress: auth.getAuthSession(),
      } as AuthTokens;
    }

    if (authType === "json") {
      const userId = this.uniBack.signInUsingToken(token);
      return { authType, userId } as AuthTokens;
    }

    return {
      authType,
    } as AuthTokens;
  }
}
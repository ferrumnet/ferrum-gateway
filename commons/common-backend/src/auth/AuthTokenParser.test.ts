import { LambdaHttpRequest } from 'aws-lambda-helper';
import { HmacApiKeyStore } from 'aws-lambda-helper/dist/security/HmacApiKeyStore';
import { HmacAuthProvider } from 'aws-lambda-helper/dist/security/HmacAuthProvider';
import { mocked } from 'ts-jest/utils';
import { AuthTokenParser } from "./AuthTokenParser";
import { Ecdsa, AddressFromPublicKey } from "ferrum-crypto";
import { EcdsaAuthProvider } from 'aws-lambda-helper/dist/security/EcdsaAuthProvider';

jest.mock('aws-lambda-helper/dist/security/HmacApiKeyStore', () => {
  return {
    HmacApiKeyStore: jest.fn().mockImplementation(() => {
      return {
        publicToSecret: async (k: string) => {
            return 'private-' + k
        },
      };
    })
  };
});

test('AuthTokenParser...', async () => {
    const apiKeyStore = (mocked(HmacApiKeyStore, true) as any)();
    const pub = 'PUBLIC_KEY'
    const auther = new HmacAuthProvider(
        '', 'MY BODY', Date.now(), 'private-' + pub, pub
    );
    const headers = auther.asHeader();
    console.log('Header becomes: ', headers);

    const parser = new AuthTokenParser(
        {} as any,
        apiKeyStore as any,
    );
    const testReq = {
        body: 'MY BODY',
        headers: {
            [headers.key]: headers.value,
        },
    } as any as LambdaHttpRequest;
    const tok = await parser.authTokens(testReq);
    console.log('Token is ', tok);
    expect(tok.hmacPublicKey).toBe(pub);
});

test('AuthTokenParser with ecdsa...', async () => {
    const SK = '0x4b6614c1e982fcf8dcf7f4afe1ce83b13c4d9a66c1c55cdbcab7caf805bbcbfc';
    const pub = Ecdsa.publicKey(SK);
    const address = new AddressFromPublicKey().forNetwork('ETHEREUM',
        pub.substring(0, 66), pub).address;
    const auther = new EcdsaAuthProvider(
        '', 'MY BODY', Date.now(), SK, async (a: string) => {
            console.log('Address was ', a);
            return true;
        });
    const headers = auther.asHeader();
    console.log('Header becomes: ', headers);

    const parser = new AuthTokenParser(
        {} as any,
        {} as any,
    );
    const testReq = {
        body: 'MY BODY',
        headers: {
            [headers.key]: headers.value,
        },
    } as any as LambdaHttpRequest;
    const tok = await parser.authTokens(testReq);
    console.log('Token is ', tok);
    expect(tok.ecdsaAddress).toBe(address);

    const testReq2 = {
        body: 'MY BODY 2',
        headers: {
            [headers.key]: headers.value,
        },
    } as any as LambdaHttpRequest;
    try {
        await parser.authTokens(testReq2);
    } catch (e) {
        if ((e as Error).toString().indexOf('Authentication failed: Invalid signature') < 0) {
            throw new Error('Unexpected error: ' + (e as Error).toString());
        }
    }
});

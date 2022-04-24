import { BasicHandlerFunction } from 'aws-lambda-helper';
import { QpBackendModule } from './QpBackendModule';

const handlerClass = new BasicHandlerFunction(new QpBackendModule());

export const handler = handlerClass.handler;

import {handler} from './src/index';
import {SimulateLamdba} from 'aws-lambda-helper';

SimulateLamdba.run(8080, handler);
console.log("running on 8080.....");

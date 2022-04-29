var r = require("ts-node").register();
var { handler } = require("./index");
var { SimulateLamdba } = require("aws-lambda-helper");

SimulateLamdba.run(8080, handler);
console.log("running on 8080.....");

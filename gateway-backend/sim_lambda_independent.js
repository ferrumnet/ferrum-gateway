var { handler, SimulateLamdba } = require("./target/index");

SimulateLamdba.run(8080, handler);
console.log("running on 8080.....");

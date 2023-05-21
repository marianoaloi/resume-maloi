let fs = require("fs");

let fileJson = process.argv[2]

let thefile = fs.readFileSync(fileJson);
console.log(fileJson);
let jsonO = JSON.parse(thefile);
delete jsonO["devDependencies"]
delete jsonO["dependencies"]
// jsonO.dependencies = {}
// jsonO.dependencies["electron-context-menu"] = "^3.6.1"

fs.writeFileSync(fileJson, JSON.stringify(jsonO, null, 4));



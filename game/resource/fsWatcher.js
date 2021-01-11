"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import watch from 'node-watch';
var watch = require("node-watch");
var completeData = {};
var watcher = watch(["./data", "./localizationCompiler.js"], { recursive: true });
watcher.on("change", function (eventType, filePath) {
    if (!filePath)
        return;
    var match = /(.*[\/|\\](\w+)).js/g.exec(filePath);
    if (eventType == "update" && filePath && match) {
        var path_1 = match[1];
        var file = require(".\\" + path_1 + ".js");
        console.log(path_1);
        if (file["GenerateLocalizationData"]) {
            var localizationArr = file["GenerateLocalizationData"]();
            completeData[path_1] = localizationArr;
        }
    }
});
// not really neccessarry: 
watcher.on("error", function (error) {
    console.log(error);
});
watcher.on("ready", function () {
    console.log("Ready!");
});
// let compiler = loadCompiler();
// doCompile();
// let fsWait: NodeJS.Timeout | false = false;
// fs.watch(filepath, (event: any , filename: string | undefined) =>
// {
//     if (filename && event ==='change')
//     {
//         if (fsWait) return;
//         fsWait = setTimeout(() =>
//         {
//             fsWait = false;
//         }, 100);
//         // Create a new compiler class
//         compiler = loadCompiler();
//         compiler.OnLocalizationDataChanged();
//     }
// });
function doCompile() {
    console.log("Data changed, compiling");
    // compiler.OnLocalizationDataChanged();
    // console.log("Data finished compilation.");
}
function loadCompiler() {
    // Clear require cache
    delete require.cache[require.resolve("./localizationCompiler")];
    delete require.cache[require.resolve("./localizationData")];
    // Require latest compiler version
    var compilerClass = require("./localizationCompiler").LocalizationCompiler;
    return new compilerClass();
}

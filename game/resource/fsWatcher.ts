import * as fs from 'fs';
import path from 'path';
import { LocalizationCompiler } from './localizationCompiler';
// import watch from 'node-watch';
const watch = require("node-watch");
import { LocalizationData } from './localizationInterfaces';

let completeData: {[path: string]: LocalizationData} = {};

let watcher = watch("./data", {recursive: true})
watcher.on("change", (eventType ?: 'update' | 'remove' | undefined, filePath ?: string) => {
	if (!filePath) return;
	let match = /(.*[\/|\\](\w+)).js/g.exec(filePath);
	if (eventType == "update" && filePath && match) {
		let path = match[1];
        let file = require(".\\" + path + ".js");
        console.log(path);
		if (file["GenerateLocalizationData"]) {
			let localizationArr: LocalizationData = file["GenerateLocalizationData"]();
			completeData[path] = localizationArr;
		}
	}
})

// not really neccessarry: 
watcher.on("error", (error: Error) => {
	console.log(error);
})

watcher.on("ready", () => {
	console.log("Ready!");
})

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

function doCompile()
{
    console.log("Data changed, compiling");
    // compiler.OnLocalizationDataChanged();
    // console.log("Data finished compilation.");
}

function loadCompiler(): LocalizationCompiler
{
    // Clear require cache
    delete require.cache[require.resolve("./localizationCompiler")]
    delete require.cache[require.resolve("./localizationData")]
    // Require latest compiler version
    const compilerClass: new () => LocalizationCompiler = require("./localizationCompiler").LocalizationCompiler;
    return new compilerClass();
}
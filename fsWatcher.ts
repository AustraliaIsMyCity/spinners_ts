import * as fs from 'fs';
const path = require('path');
import { LocalizationCompiler } from './game/resource/localizationCompiler';
import { AbilityLocalization, HeroTalents, LocalizationData, ModifierLocalization, StandardLocalization, Weapons } from './game/resource/localizationInterfaces';
// import watch from 'node-watch';
const watch = require("node-watch");

let completeData: {[path: string]: LocalizationData} = {};

let watcher = watch(["./game/resource/localization", "./game/resource/localizationCompiler.js"], {recursive: true})
watcher.on("change", (eventType ?: 'update' | 'remove' | undefined, filePath ?: string) => {
	if (!filePath) return;
	if (filePath.includes("localizationCompiler.js")) {
		compiler = loadCompiler();
	}
	let match = /(.*[\/|\\](\w+)).js/g.exec(filePath);
	if (eventType == "update" && filePath && match) {
		const curpath = match[1];
		const data = getDataFromFile(".\\" + curpath + ".js");
		if (data) {
			completeData[curpath] = data;
			combineData();
		}
	} else if (eventType == "remove" && match) {
		if (completeData.hasOwnProperty(match[1])) {
			delete completeData[match[1]];
			combineData();
		}
	}
})

// not really neccessarry: 
watcher.on("error", (error: Error) => {
	console.log("Something went wrong!");
	console.log(error);
})

watcher.on("ready", () => {
	console.log("Ready!");
})

let compiler = loadCompiler();

function getDataFromFile(filePath: string): LocalizationData | undefined {
	if (!fs.existsSync(filePath)){
		return;
	}
	delete require.cache[require.resolve(filePath)]
	let file = require(filePath);
	if (file["GenerateLocalizationData"]) {
		const localizationArr: LocalizationData = file["GenerateLocalizationData"]();
		return localizationArr;
	}
	return; 
}

function combineData() {
	let Abilities: Array<AbilityLocalization> = new Array<AbilityLocalization>();
    let Modifiers: Array<ModifierLocalization> = new Array<ModifierLocalization>();
    let StandardTooltips: Array<StandardLocalization> = new Array<StandardLocalization>();
    let Talents: Array<HeroTalents> = new Array<HeroTalents>();
	let Weapons: Array<Weapons> = new Array<Weapons>();

	const localization_info: LocalizationData =
    {
        AbilityArray: Abilities,
        ModifierArray: Modifiers,
        StandardArray: StandardTooltips,
        TalentArray: Talents,
        WeaponsArray: Weapons,
    };

	for (const [key, data] of Object.entries(completeData)) {
		if (data.AbilityArray) {
			Array.prototype.push.apply(Abilities, data.AbilityArray); 
		}
		if (data.ModifierArray) {
			Array.prototype.push.apply(Modifiers, data.ModifierArray); 
		}
		if (data.StandardArray) {
			Array.prototype.push.apply(StandardTooltips, data.StandardArray); 
		}
		if (data.TalentArray) {
			Array.prototype.push.apply(Talents, data.TalentArray); 
		}
		if (data.WeaponsArray) {
			Array.prototype.push.apply(Weapons, data.WeaponsArray); 
		}
	}

	compiler.OnLocalizationDataChanged(localization_info);
}

function loadCompiler(): LocalizationCompiler
{
    // Clear require cache
    delete require.cache[require.resolve("./game/resource/localizationCompiler")]
    // Require latest compiler version
    const compilerClass: new () => LocalizationCompiler = require("./game/resource/localizationCompiler").LocalizationCompiler;
    return new compilerClass();
}

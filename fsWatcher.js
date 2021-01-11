"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require('path');
// import watch from 'node-watch';
var watch = require("node-watch");
var completeData = {};
var watcher = watch(["./game/resource/localization", "./game/resource/localizationCompiler.js"], { recursive: true });
watcher.on("change", function (eventType, filePath) {
    if (!filePath)
        return;
    if (filePath.includes("localizationCompiler.js")) {
        compiler = loadCompiler();
    }
    var match = /(.*[\/|\\](\w+)).js/g.exec(filePath);
    if (eventType == "update" && filePath && match) {
        var curpath = match[1];
        var data = getDataFromFile(".\\" + curpath + ".js");
        if (data) {
            completeData[curpath] = data;
            combineData();
        }
    }
    else if (eventType == "remove" && match) {
        if (completeData.hasOwnProperty(match[1])) {
            delete completeData[match[1]];
            combineData();
        }
    }
});
// not really neccessarry: 
watcher.on("error", function (error) {
    console.log("Something went wrong!");
    console.log(error);
});
watcher.on("ready", function () {
    console.log("Ready!");
});
var compiler = loadCompiler();
function getDataFromFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return;
    }
    delete require.cache[require.resolve(filePath)];
    var file = require(filePath);
    if (file["GenerateLocalizationData"]) {
        var localizationArr = file["GenerateLocalizationData"]();
        return localizationArr;
    }
    return;
}
function combineData() {
    var Abilities = new Array();
    var Modifiers = new Array();
    var StandardTooltips = new Array();
    var Talents = new Array();
    var Weapons = new Array();
    var localization_info = {
        AbilityArray: Abilities,
        ModifierArray: Modifiers,
        StandardArray: StandardTooltips,
        TalentArray: Talents,
        WeaponsArray: Weapons
    };
    for (var _i = 0, _a = Object.entries(completeData); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], data = _b[1];
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
function loadCompiler() {
    // Clear require cache
    delete require.cache[require.resolve("./game/resource/localizationCompiler")];
    // Require latest compiler version
    var compilerClass = require("./game/resource/localizationCompiler").LocalizationCompiler;
    return new compilerClass();
}

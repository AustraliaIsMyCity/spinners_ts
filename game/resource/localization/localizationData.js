"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateLocalizationData = void 0;
function GenerateLocalizationData() {
    // This section can be safely ignored, as it is only logic.
    //#region Localization logic
    // Arrays
    var Abilities = new Array();
    var Modifiers = new Array();
    var StandardTooltips = new Array();
    // Create object of arrays
    var localization_info = {
        AbilityArray: Abilities,
        ModifierArray: Modifiers,
        StandardArray: StandardTooltips,
    };
    //#endregion
    // Enter localization data below!
    StandardTooltips.push({
        classname: "speech_kobold_greetings",
        name: "Welcome to my Arena!<wait><br>What did you bring you here? An adventure, treasures?"
    });
    StandardTooltips.push({
        classname: "speech_kobold_greetings2",
        name: "Anyways, I just tell you that it isn't going to be easy!<br>I bet you won't even see the first boss, <slow>hahahahah!</slow><wait><br><br>Ok, I give you a little help at least, choose wisely!<wait>"
    });
    StandardTooltips.push({
        classname: "preset_fire_chaos",
        name: "Fire Chaos"
    });
    StandardTooltips.push({
        classname: "preset_ice_storm",
        name: "Icy Storm"
    });
    StandardTooltips.push({
        classname: "preset_powerful_spark",
        name: "Conductivity"
    });
    StandardTooltips.push({
        classname: "preset_colorful_addiction",
        name: "Color Addiction"
    });
    StandardTooltips.push({
        classname: "preset_winter_night",
        name: "Winter Night"
    });
    StandardTooltips.push({
        classname: "preset_ying_yang",
        name: "Ying Yang"
    });
    StandardTooltips.push({
        classname: "preset_contact_anxiety",
        name: "Contact Anxiety"
    });
    StandardTooltips.push({
        classname: "preset_hellfire",
        name: "Hellfire"
    });
    // Return data to compiler
    return localization_info;
}
exports.GenerateLocalizationData = GenerateLocalizationData;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateLocalizationData = void 0;
function GenerateLocalizationData() {
    // This section can be safely ignored, as it is only logic.
    //#region Localization logic
    // Arrays
    var Abilities = new Array();
    // Create object of arrays
    var localization_info = {
        AbilityArray: Abilities,
    };
    Abilities.push({
        ability_classname: "test_ability",
        name: "Test Ability",
        description: "This is an test ability!",
    });
    return localization_info;
}
exports.GenerateLocalizationData = GenerateLocalizationData;

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
    var Talents = new Array();
    var Weapons = new Array();
    // Create object of arrays
    var localization_info = {
        AbilityArray: Abilities,
        ModifierArray: Modifiers,
        StandardArray: StandardTooltips,
        TalentArray: Talents,
        WeaponsArray: Weapons,
    };
    //#endregion
    // Enter localization data below!
    //#region Generic localization
    StandardTooltips.push({
        classname: "addon_game_name",
        name: "Spinners"
    });
    StandardTooltips.push({
        classname: "npc_dota_hero_spinner",
        name: "Spinner"
    });
    Weapons.push({
        class_name: "basic_fire",
        name: "Fireball",
        description: "A powerful fireball projectile that deals splash damage in an area.",
    });
    Weapons.push({
        class_name: "basic_ice",
        name: "Ice Shards",
        description: "Fast icy projectile that slows enemies hit.",
    });
    //#endregion
    // Return data to compiler
    return localization_info;
}
exports.GenerateLocalizationData = GenerateLocalizationData;

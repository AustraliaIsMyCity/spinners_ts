import { AbilityLocalization, HeroTalents, LocalizationData, ModifierLocalization, StandardLocalization, Weapons } from "./localizationInterfaces";

export function GenerateLocalizationData(): LocalizationData
{
    // This section can be safely ignored, as it is only logic.
    //#region Localization logic
    // Arrays
    const Abilities: Array<AbilityLocalization> = new Array<AbilityLocalization>();
    const Modifiers: Array<ModifierLocalization> = new Array<ModifierLocalization>();
    const StandardTooltips: Array<StandardLocalization> = new Array<StandardLocalization>();
    const Talents: Array<HeroTalents> = new Array<HeroTalents>();
    const Weapons: Array<Weapons> = new Array<Weapons>();

    // Create object of arrays
    const localization_info: LocalizationData =
    {
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
    })

    Weapons.push({
        class_name: "basic_fire",
        name: "Fireball",
        description: "A powerful fireball projectile that deals splash damage in an area.",
    })

    Weapons.push({
        class_name: "basic_ice",
        name: "Ice Shards",
        description: "Fast icy projectile that slows enemies hit.",
    })

    //#endregion

    // Return data to compiler
    return localization_info;
}
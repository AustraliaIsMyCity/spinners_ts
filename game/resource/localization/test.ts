import { AbilityLocalization, LocalizationData } from "../localizationInterfaces";

export function GenerateLocalizationData(): LocalizationData
{
    // This section can be safely ignored, as it is only logic.
    //#region Localization logic
    // Arrays
    const Abilities: Array<AbilityLocalization> = new Array<AbilityLocalization>();

    // Create object of arrays
    const localization_info: LocalizationData =
    {
        AbilityArray: Abilities,
	};

	Abilities.push({
		ability_classname: "test_ability",
		name: "Test Ability",
		description: "This is an test ability!",
	})

	return localization_info;
	
}
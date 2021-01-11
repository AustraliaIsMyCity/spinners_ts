import { AbilityLocalization, LocalizationData } from "@localization/localizationInterfaces";

export function GenerateLocalizationData(): LocalizationData
{
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
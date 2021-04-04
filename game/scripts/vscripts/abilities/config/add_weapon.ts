import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter";
import { BaseWeapon, WeaponData } from "../../core/weapon_base";
import { WeaponManager } from "../../core/weapon_manager";
import { GetRandomElement } from "../../lib/util";

@registerAbility()
export class add_weapon extends BaseAbility {

	isInnate = true;
	possibleWeapons = [
		"basic_fire",
		"basic_ice",
		"basic_electricity",
		"basic_chaos",
		"basic_order",
		"basic_wind",
		"basic_water",
	]
	// possibleWeapons = [
	// 	"basic_fire",
	// ]

	OnSpellStart() {
		let caster = this.GetCaster();
		let weaponName = GetRandomElement(this.possibleWeapons);
		if (caster.IsHero()) {
			let weaponData = WeaponManager.GetWeaponDataByName(weaponName);
			if (!weaponData) { return; }
			let weapon = WeaponManager.GetWeaponFromData(caster, weaponData!);
			if (!weapon) { return; }
			WeaponManager.RegisterWeapon(weapon);
			let playerID = caster.GetPlayerID();
			// let player = PlayerResource.GetPlayer(playerID)!;
			// let name = weapon.wGetRawName();
			// let id = weapon.wGetID();
			// let icon = weapon.wGetIcon();
			// let color = weapon.wGetColor();
			// CustomGameEventManager.Send_ServerToPlayer(player, "add_weapon", {name: name, icon: icon, color: color, id: id})
			WeaponManager.AddWeapon(playerID, weapon);
		}
	}
}

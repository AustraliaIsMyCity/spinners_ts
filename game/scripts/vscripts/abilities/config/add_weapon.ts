import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter";
import { BaseWeapon, WeaponData } from "../../core/weapon_base";
import { WeaponManager } from "../../core/weapon_manager";

@registerAbility()
export class add_weapon extends BaseAbility {

	isInnate = true;

	OnSpellStart() {
		let caster = this.GetCaster();
		if (caster.IsHero()) {
			let weaponData = WeaponManager.GetWeaponDataByName("basic_fire");
			if (!weaponData) { return; }
			let weapon = WeaponManager.GetWeaponFromData(caster, weaponData!);
			if (!weapon) { return; }
			WeaponManager.RegisterWeapon(weapon);
			let playerID = caster.GetPlayerID();
			let player = PlayerResource.GetPlayer(playerID)!;
			let name = weapon.wGetName();
			let id = weapon.wGetID();
			let icon = weapon.wGetIcon();
			let color = weapon.wGetColor();
			CustomGameEventManager.Send_ServerToPlayer(player, "add_weapon", {name: name, icon: icon, color: color, id: id})
		}
	}
}
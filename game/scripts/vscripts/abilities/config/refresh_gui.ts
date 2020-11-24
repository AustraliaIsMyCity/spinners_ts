import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter";
import * as WeaponManager from "../../core/weapon_manager";
import { WeaponData } from "../../core/weapon_base";

@registerAbility()
export class refresh_gui extends BaseAbility {

	isInnate = true;

	OnSpellStart() {
		// let caster = this.GetCaster();
		// if (caster.IsHero()) {
		// 	let playerID = caster.GetPlayerID();
		// 	let player = PlayerResource.GetPlayer(playerID)!;
		// 	CustomGameEventManager.Send_ServerToPlayer(player, "refresh_gui", {})
		// }
	}
}
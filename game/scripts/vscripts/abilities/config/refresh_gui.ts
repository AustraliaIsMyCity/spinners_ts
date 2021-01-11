import { Arena } from "../../core/arena";
import { GameModeManager } from "../../core/game_mode_manager";
import { WeaponManager } from "../../core/weapon_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter";

@registerAbility()
export class refresh_gui extends BaseAbility {

	isInnate = true;

	OnSpellStart() {
		let caster = this.GetCaster();
		if (caster.IsHero()) {
			print("Refresh!");
			let playerID = caster.GetPlayerID();
			WeaponManager.ClearStorage(playerID);
			// let player = PlayerResource.GetPlayer(playerID)!;
			// let casterLoc = caster.GetAbsOrigin();
			// CustomGameEventManager.Send_ServerToPlayer(player, "show_speech_bubble", {
			// 	locX: casterLoc.x,
			// 	locY: casterLoc.y,
			// 	locZ: casterLoc.z,
			// 	text: "#speech_kobold_greetings",
			// 	duration: 2})
			// Arena.ShowBubble();
			// GameModeManager.SendWelcome();
		}
	}
}
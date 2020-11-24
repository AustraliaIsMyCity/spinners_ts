import { WeaponManager } from "./core/weapon_manager";
import { reloadable } from "./lib/tstl-utils";

const heroSelectionTime = 10;

declare global {
	interface CDOTAGamerules {
		Addon: GameMode;
	}
}

// import { BaseAbility } from "./lib/dota_ts_adapter";

// declare module "./lib/dota_ts_adapter" {
// 	interface BaseAbility {
// 		IsInnate(): boolean;
// 	}
// }

@reloadable
export class GameMode {
	public static Precache(this: void, context: CScriptPrecacheContext) {
		PrecacheResource("particle", "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf", context);
		PrecacheResource("soundfile", "soundevents/game_sounds_heroes/game_sounds_meepo.vsndevts", context);
	}

	public static Activate(this: void) {
		GameRules.Addon = new GameMode();
	}

	constructor() {
		this.configure();
		ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
		ListenToGameEvent("npc_spawned", event => this.OnNpcSpawned(event), undefined);
	}

	private configure(): void {
		GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 3);
		GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 3);

		GameRules.SetShowcaseTime(0);
		GameRules.SetHeroSelectionTime(heroSelectionTime);
	}

	public OnStateChange(): void {
		const state = GameRules.State_Get();

		// Add 4 bots to lobby in tools
		if (IsInToolsMode() && state == GameState.CUSTOM_GAME_SETUP) {
			for (let i = 0; i < 4; i++) {
				Tutorial.AddBot("npc_dota_hero_lina", "", "", false);
			}
		}

		// Start game once pregame hits
		if (state == GameState.PRE_GAME) {
			Timers.CreateTimer(0.2, () => this.StartGame());
		}
	}

	private StartGame(): void {
		print("Game starting!");

		WeaponManager.RegisterListener();
		// Do some stuff here
	}

	// Called on script_reload
	public Reload() {
		print("Script reloaded!");

		// Do some stuff here
	}

	private OnNpcSpawned(event: NpcSpawnedEvent) {
		const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC;
		for (let i = 0; i < 10; i++) {
			let ability: CDOTABaseAbility | undefined = unit.GetAbilityByIndex(i);
			if (ability !== undefined) {
				if (IsInnateAbility(ability)) {
					ability.SetLevel(1);
				}
			}
		}
	}
}

function IsInnateAbility(ability: CDOTABaseAbility):boolean {
	if ((ability as any).isInnate === true) {
		return true;
	}
	return false;
}
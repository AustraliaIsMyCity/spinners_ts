import * as Arena from "./core/arena";
import * as GameModeManager from "./core/game_mode_manager";
import * as WaveManager from "./core/wave_manager";
import { WeaponManager } from "./core/weapon_manager";
import { reloadable } from "./lib/tstl-utils";

const heroSelectionTime = 10;

declare global {
	interface CDOTAGamerules {
		Addon: GameMode;
	}
}

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

		// Start game once pregame hits
		if (state == GameState.PRE_GAME) {
			Timers.CreateTimer(0.2, () => this.StartGame());
		}
	}

	private StartGame(): void {
		print("Game starting!");

		Arena.Init();
		WeaponManager.Init();
		WaveManager.Init();
		GameModeManager.Init();
		// Do some stuff here
	}

	// Called on script_reload
	public Reload() {
		print("Script reloaded!");

		// Do some stuff here
		Arena.Init();
		WeaponManager.Init();
		WaveManager.Init();
		GameModeManager.Init();
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
		if (unit.IsRealHero() && unit.GetUnitName() == "npc_dota_hero_wisp") {
			Timers.CreateTimer(1, () => GameModeManager.SendWelcome());
			let playerID = unit.GetPlayerID();
			WeaponManager.InitForPlayer(playerID);
		}
	}
}

function IsInnateAbility(ability: CDOTABaseAbility):boolean {
	if ((ability as any).isInnate === true) {
		return true;
	}
	return false;
}

import { Arena } from "./core/arena";
import { GameModeManager } from "./core/game_mode_manager";
import { WaveManager } from "./core/wave_manager";
import { WeaponManager } from "./core/weapon_manager";
import { reloadable } from "./lib/tstl-utils";

declare global {
    interface CDOTAGamerules {
        Addon: GameMode;
    }
}

@reloadable
export class GameMode {

    Game: CDOTABaseGameMode = GameRules.GetGameModeEntity();

    public static Precache(this: void, context: CScriptPrecacheContext) {
        // PrecacheResource("particle", "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf", context);
        // PrecacheResource("soundfile", "soundevents/game_sounds_heroes/game_sounds_meepo.vsndevts", context);
    }

    public static Activate(this: void) {
        GameRules.Addon = new GameMode();
    }

    constructor() {
        this.configure();
        this.registerEvents()
        this.registerFilters()
    }

    private configure(): void {
        // Player/teams rules
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 3);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 3);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_1, 3);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_2, 3);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_3, 3);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_4, 3);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_5, 3);

        // Game launch rules
        GameRules.EnableCustomGameSetupAutoLaunch(true);
        GameRules.SetCustomGameSetupAutoLaunchDelay(0);
        GameRules.SetShowcaseTime(0);
        GameRules.SetStrategyTime(0);
        GameRules.SetPreGameTime(0);
        this.Game.SetAnnouncerDisabled(true);
        this.Game.SetCustomGameForceHero("npc_dota_hero_wisp");
        GameRules.SetStartingGold(0);

        // Leveling rules
        // +1 exp = 1 level, to make it easy to level up our hero in code later.
        // No natural experience gain.
        const expTable: Record<number, number> = {};
        for (let i = 0; i < 30; i++) {
            expTable[i] = i;
        }
        this.Game.SetCustomXPRequiredToReachNextLevel(expTable);
        this.Game.SetUseCustomHeroLevels(true);
    }

    private registerEvents() {
        ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
        ListenToGameEvent("npc_spawned", event => this.OnNpcSpawned(event), undefined);
    }

    private registerFilters() {
        this.Game.SetModifyExperienceFilter(event => this.ModifyXPExperienceFilter(event), this)
    }

    private ModifyXPExperienceFilter(event: ModifyExperienceFilterEvent): boolean {
        return false
    }

    public OnStateChange(): void {
        const state = GameRules.State_Get();

        // Start game once pregame hits
        if (state == GameState.PRE_GAME) {
            Timers.CreateTimer(0.2, () => this.StartGame());
        }
    }

    private StartGame() {
        print("Game starting!");

        // Game rules
        this.Game.SetLoseGoldOnDeath(false);
        this.Game.SetBuybackEnabled(false);
        this.Game.SetCustomDireScore(0);
        this.Game.SetAllowNeutralItemDrops(false);
        GameRules.SetTimeOfDay(0.5); // morning!
        this.Game.SetDaynightCycleDisabled(true);

        Arena.Init();
        WeaponManager.Init();
        WaveManager.Init();
        GameModeManager.Init();


        // GameModeManager.SendWelcome();
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
            // Timers.CreateTimer(1, () => GameModeManager.SendWelcome());
            let playerID = unit.GetPlayerID();
            WeaponManager.InitForPlayer(playerID);
        }
    }
}

function IsInnateAbility(ability: CDOTABaseAbility): boolean {
    if ((ability as any).isInnate === true) {
        return true;
    }
    return false;
}

import { GetRandomElement } from "../lib/util";
import * as Arena from "./arena";
import { BaseAI } from "./wave_manager_modifier";

let started: boolean = false;
let curWave: number = 1;
let hero: CDOTA_BaseNPC;

let curUnits: CDOTA_BaseNPC[] = [];
let spawnLocs: Vector[] = [];

let gameModeEnt: CDOTABaseGameMode;

export function Init():void {
    CustomGameEventManager.RegisterListener("next_wave", (_, event) => OnNextWaveClick(event));
    let gameMode:CDOTABaseGameMode = GameRules.GetGameModeEntity()
    spawnLocs = Arena.GetPossibleSpawnLocations("all", 40);
    // gameMode.SetContextThink("OnThink", think, spawnInterval);
    gameModeEnt = gameMode;
    let info: WaveInfo = {
        waveCount: 0,
        killCount: 0,
        maxCount: 40,
        maxWaveCount: 10,
        spawnCount: 999,
        spawnInterval: 1,

    }
    gameModeEnt.waveInfo = info;
}

function OnNextWaveClick(event: {
    PlayerID: PlayerID,
}) {
    print("Next Wave!");
    let player = PlayerResource.GetPlayer(event.PlayerID)!;
    hero = PlayerResource.GetSelectedHeroEntity(event.PlayerID)!;

    GetWaveInfos(curWave);
    curWave += 1;

    gameModeEnt.waveInfo.waveCount = 0;
    gameModeEnt.waveInfo.killCount = 0;
    gameModeEnt.waveInfo.spawnCount = 0;
    gameModeEnt.waveTimer = Timers.CreateTimer(() => think());
}

function GetWaveInfos(index: number) {
    let waves = LoadKeyValues("scripts/npc/waves.kv") as any;
    let values: any = waves[tostring(index)];
    gameModeEnt.waveInfo.name = values["Name"];
    gameModeEnt.waveInfo.maxCount = values["UnitCount"];
    gameModeEnt.waveInfo.maxWaveCount = values["WaveUnitCount"];
    gameModeEnt.waveInfo.spawnInterval = values["Interval"];
    let unitValues: any = values["Unit"];
    gameModeEnt.waveInfo.modelName = unitValues["UnitName"];
    gameModeEnt.waveInfo.moveSpeed = unitValues["MoveSpeed"];
    gameModeEnt.waveInfo.health = unitValues["Health"];
}

function think():number | undefined {
    if (gameModeEnt.waveInfo.spawnCount >= gameModeEnt.waveInfo.maxCount) {
        return;
    }
    if (gameModeEnt.waveInfo.waveCount >= gameModeEnt.waveInfo.maxWaveCount) {
        return gameModeEnt.waveInfo.spawnInterval;
    }
    gameModeEnt.waveInfo.waveCount++;
    gameModeEnt.waveInfo.spawnCount++;
    let loc = GetRandomElement(spawnLocs);
    let unit = SpawnNewUnit(loc);
    curUnits.push(unit);

    return gameModeEnt.waveInfo.spawnInterval;
}

function OnWaveComplete() {
    print("Complete!");
    CustomGameEventManager.Send_ServerToAllClients("wave_complete", {});
}

function SpawnNewUnit(loc: Vector):CDOTA_BaseNPC {
    let unit = CreateUnitByName(gameModeEnt.waveInfo.modelName!, loc, true, undefined, undefined, DotaTeam.BADGUYS);
    unit.SetMaxHealth(gameModeEnt.waveInfo.health!);
    unit.SetHealth(gameModeEnt.waveInfo.health!);
    unit.SetBaseMoveSpeed(gameModeEnt.waveInfo.moveSpeed!);

    let unitAI = unit.AddNewModifier(hero, undefined, "UnitAI", {}) as BaseAI;
    unitAI.SetTarget(hero);
    return unit;
}

export function RegisterDeath(unit?: CDOTA_BaseNPC) {
    let gameMode:CDOTABaseGameMode = GameRules.GetGameModeEntity()
    gameMode.waveInfo.waveCount -= 1;
    gameMode.waveInfo.killCount += 1;
    let percentage = gameMode.waveInfo.killCount / gameMode.waveInfo.maxCount;

    // Timers.RemoveTimer(gameMode.waveTimer);
    // gameMode.waveTimer = Timers.CreateTimer(think);

    CustomGameEventManager.Send_ServerToAllClients("update_wave_progress", {percentage});
    if (gameMode.waveInfo.killCount == gameMode.waveInfo.maxCount) {
        OnWaveComplete();
    }
}

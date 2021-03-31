import { BaseModifier, registerAbility, registerModifier } from "../lib/dota_ts_adapter";
import { GetRandomElements } from "../lib/util";
import * as Arena from "./arena";
import { BaseWeapon } from "./weapon_base";
import { WeaponManager } from "./weapon_manager";


let presetData: PresetData[] = [];
let currentPresets: {[index: number]: {name: string, weapons: BaseWeapon[]}} = {};

export function Init() {
    CustomGameEventManager.RegisterListener("select_preset", (_, event) => ConfirmPreset(event));
    CustomGameEventManager.RegisterListener("spend_gold", (_, event) => SpendGold(event));
    const presets = LoadKeyValues("scripts/npc/presets.kv") as any;
    for (let [name, presetInfo] of Object.entries(presets)) {
        let content: PresetDataContent[] = [];
        for (let [_, value] of Object.entries(presetInfo as any)) {
            let itemInfo = value as any
            let item: PresetDataContent = {
                name: itemInfo.name as string,
                level: itemInfo.level as number,
                count: itemInfo.count as number,
            }
            content.push(item);
        }
        let newData: PresetData = {name: name, content: content};
        presetData.push(newData);
    }
}

function SpendGold(event: {
    amount: number,
    PlayerID: PlayerID,
}) {
    PlayerResource.SpendGold(event.PlayerID, event.amount, ModifyGoldReason.UNSPECIFIED);
}

export function SendWelcome() {
    let koboldKing = Arena.GetKobold()
    let casterLoc = (koboldKing.GetAbsOrigin() +  Vector(80,0,260)) as Vector;
    let owner = Arena.GetArenaOwner();
    return;
    owner.AddNewModifier(owner, undefined, "CutSceneStun", {});
    let playerID = (owner as CDOTA_BaseNPC_Hero).GetPlayerID();
    let player = PlayerResource.GetPlayer(playerID)!;
    Arena.MoveCameraToLocation(casterLoc);
    Timers.CreateTimer(1, () => {
        Arena.ShowBubble(casterLoc, "#speech_kobold_greetings", 8);
    });
    Timers.CreateTimer(10, () => {
        Arena.ShowBubble(casterLoc, "#speech_kobold_greetings2", 9);
    });
    Timers.CreateTimer(18, () => {
        ShowPresets();
    });
    owner.RemoveModifierByName("CutSceneStun");
}

function FirstPerk() {
    let koboldKing = Arena.GetKobold()
    let casterLoc = (koboldKing.GetAbsOrigin() +  Vector(80,0,260)) as Vector;
    let owner = Arena.GetArenaOwner();
    owner.AddNewModifier(owner, owner.FindAbilityByName("hero_spin"), "modifier_cut_scene_stun", {});
    let playerID = (owner as CDOTA_BaseNPC_Hero).GetPlayerID();
    let player = PlayerResource.GetPlayer(playerID)!;
    Arena.MoveCameraToLocation(casterLoc);
    Timers.CreateTimer(1, () => {
        Arena.ShowBubble(casterLoc, "#speech_kobold_shadow_perk", 9);
    });
    Timers.CreateTimer(10, () => {
        let particle = ParticleManager.CreateParticle("particles/hud/new_perk/new_perk_hold.vpcf", ParticleAttachment.CUSTOMORIGIN, koboldKing);
        DoEntFire("Kobold_King", "SetAnimation", "overboss_throne_throw_coin", 0, koboldKing, koboldKing);
        let deltaTime = 0;
        Timers.CreateTimer(() => {
            let attachment = koboldKing.ScriptLookupAttachment("coin_toss_point")
            let startLoc = koboldKing.GetAttachmentOrigin(attachment);
            ParticleManager.SetParticleControl(particle, 3, startLoc);
            if (deltaTime < 1.5) {
                deltaTime += 1/30;
                return 1/30;
            }
            ParticleManager.DestroyParticle(particle, true);
            return;
        });
        Timers.CreateTimer(1.5, () => {
            let attachment = koboldKing.ScriptLookupAttachment("coin_toss_point")
            let startLoc = koboldKing.GetAttachmentOrigin(attachment);
            CustomGameEventManager.Send_ServerToPlayer(player, "play_perk_effect", {
                startX: startLoc.x,
                startY: startLoc.y,
                startZ: startLoc.z,
            });
            Timers.CreateTimer(1.2, () => {
                CustomGameEventManager.Send_ServerToPlayer(player, "add_perk", {
                    name: "shadow",
                    color: "purple",
                });
            });
        });
    });
    owner.RemoveModifierByName("CutSceneStun");
}

function ShowPresets() {
    print("Show Presets!");
    const presets = GetRandomElements(presetData, 4);
    for (let index = 1; index <= presets.length; index++) {
        const element = presets[index - 1];
        let weapons: BaseWeapon[];
        let eventData: EventWeaponData[];
        [eventData, weapons] = GetWeaponsFromContent(element.content);
        CustomGameEventManager.Send_ServerToAllClients("load_preset", {
            presetID: index,
            presetName: element.name,
            weapons: eventData,
        });
        currentPresets[index] = {
            name: element.name,
            weapons: weapons,
        }
    }
}

function ConfirmPreset(event: {
    presetID: number,
    PlayerID: PlayerID,
}) {
    let preset = currentPresets[event.presetID];
    print("Selected Preset: ", event.presetID, " -> ", preset.name);
    for (let index = 0; index < preset.weapons.length; index++) {
        const weapon = preset.weapons[index];
        WeaponManager.AddWeapon(event.PlayerID, weapon);
    }
    Arena.MoveCameraToLocation(Arena.GetCenter());
}

function GetWeaponsFromContent(content: PresetDataContent[]):[EventWeaponData[], BaseWeapon[]] {
    let hero = Arena.GetArenaOwner() as CDOTA_BaseNPC_Hero;
    let eventData: EventWeaponData[]  = [];
    let weapons: BaseWeapon[] = [];
    content.forEach(element => {
        for (let index = 0; index < element.count; index++) {
            let weaponData = WeaponManager.GetWeaponDataByName(element.name);
            if (!weaponData) { return; }
            let weapon = WeaponManager.GetWeaponFromData(hero, weaponData!);
            if (!weapon) { return; }
            WeaponManager.RegisterWeapon(weapon);
            eventData.push({
                name: weapon.wGetRawName(),
                level: weapon.wGetLevel(),
                icon: weapon.wGetIcon(),
                color: weapon.wGetColor(),
                id: weapon.wGetID(),
            });
            weapons.push(weapon);
        }
    });
    return [eventData, weapons];
}

interface PresetData {
	name: string;
	content: PresetDataContent[];
}

interface PresetDataContent {
	name: string;
	level: number;
	count: number;
}

@registerModifier()
export class modifier_cut_scene_stun extends BaseModifier {

	IsDebuff() {return true;}
	IsHidden() {return false;}

	GetAttributes() {
		return ModifierAttribute.MULTIPLE;
	}

	OnCreated() {
		if (IsClient()) {return;}
		let caster = this.GetParent();
		caster.Stop();
	}

	CheckState() {
		return {
			[ModifierState.COMMAND_RESTRICTED]: true,
			[ModifierState.STUNNED]: true,
		}
	}
}

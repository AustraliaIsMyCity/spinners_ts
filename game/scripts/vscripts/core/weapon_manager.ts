import { clearTable, getFileScope } from "../lib/dota_ts_adapter";
import { BaseWeapon, WeaponData, WeaponValue } from "./weapon_base";
// import * as classImport from "./../weapons/basic_fire";

export namespace WeaponManager {
	
	let IDs: WeaponID[] = [];
	let curID: WeaponID = 0;
	let lookupTable: {[id: number]: BaseWeapon} = {};
	let allData: {[name: string] : object} = {};

	export function RegisterListener():void {
		CustomGameEventManager.RegisterListener("weapon_change", (_, event) => OnWeaponChange(event));
		CustomGameEventManager.RegisterListener("weapon_inventory_change", (_, event) => OnWeaponInventoryChange(event));
	}
	
	function OnWeaponChange(event: {
		oldSlot: number,
		newSlot: number,
		id: number,
		PlayerID: PlayerID,
	}) {
		let weapon = GetWeaponByID(event.id);
		if (!weapon) {
			print("No data for weapon :(");
			return;
		}
		if (event.oldSlot >= 0) {
			weapon?.wUnload();
		}
		if (event.newSlot >= 0) {
			weapon?.wLoadIntoSlot(event.newSlot);
		}
	}

	function OnWeaponInventoryChange(event: {
		removed: 0 | 1,
		id: number,
		originID: string,
		PlayerID: PlayerID,
	}) {
		let player = PlayerResource.GetPlayer(event.PlayerID)!;
		if (event.removed == 0) {
			let weapon = GetWeaponByID(event.id);
			if (!weapon) {
				print("No data for weapon :(");
				return;
			}
			let name = weapon.wGetName();
			let id = weapon.wGetID();
			let icon = weapon.wGetIcon();
			let color = weapon.wGetColor();
			CustomGameEventManager.Send_ServerToPlayer(player, "add_weapon", {name: name, icon: icon, color: color, id: id, originID: event.originID});
		} else {
			CustomGameEventManager.Send_ServerToPlayer(player, "remove_weapon", {id: event.id});
		}
	}
	
	export function RegisterWeapon(weapon: BaseWeapon): void {
		let newID = curID;
		curID++;
	
		lookupTable[newID] = weapon;
		weapon.setID(newID);
	}

	function toDotaClassInstanceCustom(instance: any, table: any) {
		let { prototype } = table;
		while (prototype) {
			for (const key in prototype) {
				// Using hasOwnProperty to ignore methods from metatable added by ExtendInstance
				// https://github.com/SteamDatabase/GameTracking-Dota2/blob/7edcaa294bdcf493df0846f8bbcd4d47a5c3bd57/game/core/scripts/vscripts/init.lua#L195
				if (!instance.hasOwnProperty(key)) {
					instance[key] = prototype[key];
				}
			}
	
			prototype = getmetatable(prototype);
		}
	}
	
	export function GetWeaponByID(id: WeaponID):BaseWeapon | undefined {
		return lookupTable[id];
	}
	
	export function GetWeaponDataByName(name: string): WeaponData | undefined {
		if (!allData.hasOwnProperty(name)) {
			FetchWeaponKV();
		}
		if (!allData.hasOwnProperty(name)) {
			return undefined;
		}
		let weaponData = allData[name] as any;
		let newData: WeaponData = {
			name: name,
			script: weaponData["ScriptName"] as string || "",
			baseCost: weaponData["BaseCost"] as number || 0,
			costIncrease: weaponData["CostIncrease"] as number || 0,
			icon: weaponData["Icon"] as string || "",
			color: weaponData["Color"] as string || "black",
			values: {},
		};
	
		for (let [key, value] of Object.entries(weaponData["Values"] || [])) {
			let valueData = value as any;
			let weaponValue: WeaponValue = {
				name: key,
				base: valueData["base_val"] || 0,
				increase: valueData["inc"] || 0,
				minLevel:  valueData["min_level"],
				minVal: valueData["min_val"],
				maxVal: valueData["max_val"],
			}
			newData.values[key] = weaponValue;
		}
		return newData;
	}
	
	export function FetchWeaponKV():void {
		let values = LoadKeyValues("scripts/npc/weapons/all_weapons.kv");
		for (let [key, value] of Object.entries(values)) {
			allData[key] = value;
		}
	}
	
	export function GetWeaponFromData(caster: CDOTA_BaseNPC_Hero, data: WeaponData): BaseWeapon | undefined {
		print("Get Weapon!");
		let script = data.script;
		if (script == "") {return undefined; }
		let classImport = require("weapons/" + script);
		let newWeapon = new BaseWeapon(caster, data);
		toDotaClassInstanceCustom(newWeapon, classImport["basic_fire"]);
		return newWeapon;
	}
}
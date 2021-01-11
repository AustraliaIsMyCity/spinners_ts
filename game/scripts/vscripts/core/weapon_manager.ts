import { TableToArray } from "../lib/util";
import { BaseWeapon, WeaponData, WeaponValue } from "./weapon_base";

export module WeaponManager {
	
	let IDs: WeaponID[] = [];
	let curID: WeaponID = 0;
	let lookupTable: {[id: number]: BaseWeapon} = {};
	let allData: {[name: string] : object} = {};

	export function Init():void {
		CustomGameEventManager.RegisterListener("weapon_change", (_, event) => OnWeaponChange(event));
		CustomGameEventManager.RegisterListener("weapon_inventory_change", (_, event) => OnWeaponInventoryChange(event));
		CustomGameEventManager.RegisterListener("weapon_upgrade", (_, event) => OnWeaponUpgrade(event));
		CustomGameEventManager.RegisterListener("request_shop_weapon_sync", (_, event) => OnShopSync(event));
	}

	export function InitForPlayer(playerID: PlayerID) {
		CustomNetTables.SetTableValue("weapon_storage", ""+playerID, {weapons: []});
	}
	
	function OnWeaponChange(event: {
		oldSlot: number,
		newSlot: number,
		id: WeaponID,
		PlayerID: PlayerID,
	}) {
		let weapon = GetWeaponByID(event.id);
		if (!weapon) {
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
		id: WeaponID,
		originID: string,
		PlayerID: PlayerID,
	}) {
		let player = PlayerResource.GetPlayer(event.PlayerID)!;
		let table = CustomNetTables.GetTableValue("weapon_storage", ""+event.PlayerID);
		let weaponArr = TableToArray(table.weapons);
		if (event.removed == 0) {
			let weapon = GetWeaponByID(event.id);
			if (!weapon) {
				return;
			}
			let name = weapon.wGetName();
			let id = weapon.wGetID();
			let icon = weapon.wGetIcon();
			let color = weapon.wGetColor();
			if (weaponArr.indexOf(event.id) < 0) {
				weaponArr.push(event.id);
			}
			CustomGameEventManager.Send_ServerToPlayer(player, "add_weapon", {name: name, icon: icon, color: color, id: id, originID: event.originID});
		} else {
			weaponArr = weaponArr.filter(id => id !== event.id);
			CustomGameEventManager.Send_ServerToPlayer(player, "remove_weapon", {id: event.id});
		}
		CustomNetTables.SetTableValue("weapon_storage", ""+event.PlayerID, {weapons: weaponArr});
	}

	function OnWeaponUpgrade(event: {
		id: WeaponID,
		amount: number,
		PlayerID: PlayerID,
	}) {
		let weapon = GetWeaponByID(event.id);
		if (!weapon) {
			return;
		}
		let level = weapon.wGetLevel()
		weapon.wSetLevel(level + event.amount);
	}

	function OnShopSync(event: {
		PlayerID: PlayerID,
	}) {
		let player = PlayerResource.GetPlayer(event.PlayerID)!;
		let table = CustomNetTables.GetTableValue("weapon_storage", ""+event.PlayerID);
		let weaponArr = TableToArray(table.weapons);
		DeepPrintTable(weaponArr);
		for (const weaponID of weaponArr) {
			let weapon = GetWeaponByID(weaponID);
			if (!weapon) {
				return;
			}
			let name = weapon.wGetName();
			let id = weapon.wGetID();
			let icon = weapon.wGetIcon();
			let color = weapon.wGetColor();
			CustomGameEventManager.Send_ServerToPlayer(player, "add_weapon_shop_only", {name: name, icon: icon, color: color, id: id});
		}
	}

	export function AddWeapon(playerID: PlayerID, weapon: BaseWeapon) {
		let player = PlayerResource.GetPlayer(playerID)!;
		let name = weapon.wGetRawName();
		let id = weapon.wGetID();
		let icon = weapon.wGetIcon();
		let color = weapon.wGetColor();
		CustomGameEventManager.Send_ServerToPlayer(player, "add_weapon", {name: name, icon: icon, color: color, id: id});

		let table = CustomNetTables.GetTableValue("weapon_storage", ""+playerID);
		let weaponArr = TableToArray(table.weapons);
		weaponArr.push(id);
		CustomNetTables.SetTableValue("weapon_storage", ""+playerID, {weapons: weaponArr});
		let table2 = CustomNetTables.GetTableValue("weapon_storage", ""+playerID);
		let weaponArr2 = TableToArray(table.weapons);
	}

	export function ClearStorage(playerID: PlayerID) {
		let player = PlayerResource.GetPlayer(playerID)!;
		print(playerID);
		let table = CustomNetTables.GetTableValue("weapon_storage", ""+playerID);
		let weaponArr = TableToArray(table.weapons);
		for (const weaponID of weaponArr) {
			CustomGameEventManager.Send_ServerToPlayer(player, "remove_weapon", {id: weaponID});
		}
		CustomNetTables.SetTableValue("weapon_storage", ""+playerID, {weapons: []});
	}
	
	export function RegisterWeapon(weapon: BaseWeapon) {
		let newID = curID;
		curID++;
	
		lookupTable[newID] = weapon;
		weapon.setID(newID);

		// print("Registered new Weapon: ", weapon.wGetName());
	}

	export function UnregisterWeapon(weapon: BaseWeapon) {
		delete lookupTable[weapon.wGetID()];
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
		// print("Try get weapon data: ", name);
		if (!allData.hasOwnProperty(name)) {
			FetchWeaponKV();
		}
		if (!allData.hasOwnProperty(name)) {
			print("No property?");
			DeepPrintTable(allData);
			return undefined;
		}
		let weaponData = allData[name] as any;
		let element: WeaponElement = GetElementFromString(weaponData["Element"] as string);
		let newData: WeaponData = {
			name: name,
			script: weaponData["ScriptName"] as string || "",
			baseCost: weaponData["BaseCost"] as number || 0,
			costIncrease: weaponData["CostIncrease"] as number || 0,
			icon: weaponData["Icon"] as string || "",
			color: weaponData["Color"] as string || "black",
			element: element,
			values: {},
		};
	
		for (let [key, value] of Object.entries(weaponData["Values"] || [])) {
			let valueData = value as any;
			let weaponValue: WeaponValue = {
				name: key,
				base: valueData["base_val"] || 0,
				increase: valueData["inc"] || 0,
				step_val: valueData["step_val"],
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
		let script = data.script;
		if (script == "") {return undefined; }
		let classImport = require("weapons/" + script);
		print("CLASS IMPORT");
		print(classImport);
		let newWeapon = new BaseWeapon(caster, data, script);
		toDotaClassInstanceCustom(newWeapon, classImport[script]);
		return newWeapon;
	}

	function GetElementFromString(name: string):WeaponElement {
		switch (name) {
			case "WATER": return WeaponElement.WATER;
			case "FIRE": return WeaponElement.FIRE;
			case "FROST": return WeaponElement.FROST;
			case "WIND": return WeaponElement.WIND;
			case "EARTH": return WeaponElement.EARTH;
			case "ELECTRICITY": return WeaponElement.ELECTRICITY;
			case "CHAOS": return WeaponElement.CHAOS;
			case "ORDER": return WeaponElement.ORDER;
			default: return WeaponElement.NONE;
		}
	}	
}
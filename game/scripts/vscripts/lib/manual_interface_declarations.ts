interface CustomGameEventDeclarations {
	show_center_hud: {};
	add_weapon: {name: string, icon: string, color: string, id: WeaponID, originID?: string};
	remove_weapon: {id: WeaponID};
	refresh_gui: {};
	weapon_change: {oldSlot: number, newSlot: number, id: WeaponID};
	weapon_inventory_change: {removed: boolean, id: WeaponID, originID: string};
	weapon_upgrade: {id: WeaponID, amount: number};
	wave_complete: {};
	next_wave: {};
	update_wave_progress: {percentage: number};
	load_preset: {presetID: number, presetName: string, weapons: EventWeaponData[]};
	select_preset: {presetID: number};
	show_speech_bubble: {locX: number, locY: number, locZ: number, text: string, duration: number};
	zoom_to_location: {locX: number, locY: number, locZ: number};
	confirm_movement: {};
	play_perk_effect: {startX: number, startY: number, startZ: number};
	add_perk: {name: string, color: string};
	spend_gold: {amount: number};
	request_shop_weapon_sync: {};
	add_weapon_shop_only: {name: string, icon: string, color: string, id: WeaponID};
}

interface CustomNetTableDeclarations {
	weapon_data: {
		[weapon_id: string]: {
			raw_name: string;
			name: string;
			level: number;
			element: WeaponElement;
			upgrade_cost: number[],
			worth: number,
			values: CurrentWeaponValue[];
		};
	};
	weapon_storage: {
		[player_id: string]: {
			weapons: WeaponID[];
		}
	}
}

interface CurrentWeaponValue {
	name: string;
	cur_val: number;
	next_val: number;
}

interface WaveInfo {
	name?: string;
	waveCount: number;
	killCount: number;
	maxCount: number;
	maxWaveCount: number;
	spawnCount: number;
	spawnInterval: number;
	modelName?: string;
	health?: number;
	moveSpeed?: number;
}

interface CDOTABaseGameMode
{
	waveInfo: WaveInfo;
	waveTimer: string;
}

interface EventWeaponData {
	name: string;
	level: number;
	icon: string;
	color: string;
	id: WeaponID;
}

interface CDOTA_BaseNPC {
	custom_variable?: number;
}

interface CustomGameEventDeclarations 
{
	show_center_hud: {};
	add_weapon: {name: string, icon: string, color: string, id: WeaponID, originID?: string};
	remove_weapon: {id: WeaponID};
	refresh_gui: {};
	weapon_change: {oldSlot: number, newSlot: number, id: WeaponID};
	weapon_inventory_change: {removed: boolean, id: WeaponID, originID: string};
}
import { SpinModifier } from "./hero_spin";
import { WeaponManager } from "./weapon_manager";
// import * as WeaponManager from "../core/weapon_manager";

export interface WeaponValue {
	name: string;
	base: number;
	increase: number;
	minLevel?: number;
	minVal?: number;
	maxVal?: number;
}

export interface WeaponData {
	name: string;
	script: string;
	baseCost: number;
	costIncrease: number;
	icon: string;
	color: string;
	values: {[name: string]: WeaponValue};
}

export class BaseWeapon {

	protected caster: CDOTA_BaseNPC_Hero;
	private id: WeaponID = -1;
	private data: WeaponData;

	private level: number = 0;
	private maxLevel: number = 20;
	private slot?: number;

	constructor(owner: CDOTA_BaseNPC_Hero, data: WeaponData) {
		this.caster = owner;
		this.data = data;
	}

	setID(id: WeaponID) {
		this.id = id;
	}

	wGetID(): WeaponID {
		return this.id;
	}

	wGetIcon(): string {
		return this.data.icon;
	}

	wGetColor(): string {
		return this.data.color;
	}

	wGetName(): string {
		return this.data.name;
	}

	wGetController():SpinModifier {
		return this.caster.FindModifierByName("spin_passive") as SpinModifier;
	}

	wGetLevel(): number {
		return this.level;
	}

	wSetLevel(level:number) {
		if (level > this.maxLevel) {
			level = this.maxLevel;
		}
		this.level = level;
	}

	wGetSpecialValueFor(name:string):number {
		let level = this.wGetLevel();
		let value = this.data.values[name] || {base: 0, increase: 0} as WeaponValue;
		return value.base + value.increase * level;
	}

	wGetModel():string {
		return "models/heroes/leshrac/mesh/discoball_model.vmdl";
	}

	wGetModelScale():number {
		if (this.wGetModel() == "models/heroes/leshrac/mesh/discoball_model.vmdl") {
			return 0;
		}
		return 1;
	}

	wGetAttackInterval():number {
		return 1;
	}

	wOnAttack(pos: Vector, direction: Vector):void {
		// do stuff here

	}

	wLoadIntoSlot(slot: number) {
		let controller: SpinModifier = this.wGetController();
		controller.LoadWeapon(this, slot);
		this.slot = slot;
	}

	wUnload() {
		if (this.slot) {
			let controller: SpinModifier = this.wGetController();
			controller.UnloadWeapon(this.slot);
		}
	}

	OnProjectileHit(target: CDOTA_BaseNPC | undefined, loc: Vector | undefined):boolean  {
		// do stuff here

		return true;
	}

	GetAbilityTargetTeam(): UnitTargetTeam {
		return UnitTargetTeam.ENEMY;
	}

	GetAbilityTargetFlags(): UnitTargetFlags {
		return UnitTargetFlags.NONE;
	}

	GetAbilityTargetType(): UnitTargetType {
		return UnitTargetType.HERO + UnitTargetType.BASIC;
	}

}
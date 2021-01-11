import { BaseAbility } from "../lib/dota_ts_adapter";
import { SpinModifier } from "./hero_spin";
import { WeaponManager } from "./weapon_manager";
// import * as WeaponManager from "../core/weapon_manager";

export interface WeaponValue {
	name: string;
	base: number;
	increase: number;
	step_val?: number;
}

export interface WeaponData {
	name: string;
	script: string;
	baseCost: number;
	costIncrease: number;
	icon: string;
	color: string;
	element: WeaponElement;
	values: {[name: string]: WeaponValue};
}

export class BaseWeapon {

	protected caster: CDOTA_BaseNPC_Hero;
	private id: WeaponID = -1;
	private data: WeaponData;

	private level: number = 0;
	private maxLevel: number = 20;
	private upgradeCosts: number[] = [];
	private slot?: number;

	private rawName: string;

	protected baseAbility?: CDOTABaseAbility;

	constructor(owner: CDOTA_BaseNPC_Hero, data: WeaponData, rawName: string) {
		this.caster = owner;
		this.data = data;
		this.rawName = rawName;
		for (let index = 0; index <= this.maxLevel; index++) {
			let upgradeCost = this.wGetLevelUpgradeCost(index);
			this.upgradeCosts.push(upgradeCost);
		}
		this.baseAbility = owner.FindAbilityByName("hero_spin");
	}

	updateWeaponData() {
		if(this.id < 0) {
			return;
		}
		let values: CurrentWeaponValue[] = [];
		for (let key of Object.keys(this.data.values)) {
			let newWeaponValue: CurrentWeaponValue = {
				name: key,
				cur_val: this.wGetSpecialValueFor(key),
				next_val: this.wGetLevelSpecialValueFor(key, this.wGetLevel() + 1),
			}
			values.push(newWeaponValue);
		}
		CustomNetTables.SetTableValue("weapon_data", "" + this.id, {
			raw_name: this.rawName, 
			name: this.wGetName(),
			level: this.wGetLevel(),
			element: this.wGetElement(),
			upgrade_cost: this.upgradeCosts,
			worth: this.wGetWorth(),
			values: values,
		});
	}

	setID(id: WeaponID) {
		this.id = id;
		this.updateWeaponData();
	}

	wGetCaster(): CDOTA_BaseNPC {
		return this.caster;
	}

	wGetAbility(): CDOTABaseAbility | undefined {
		return this.baseAbility;
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

	wGetRawName(): string {
		return this.rawName;
	}

	wGetUpgradeCost(): number {
		let level = this.wGetLevel();
		return this.data.baseCost + this.data.costIncrease * level;
	}

	wGetLevelUpgradeCost(level: number): number {
		return this.data.baseCost + this.data.costIncrease * level;
	}

	wGetWorth(): number {
		let curLevel = this.wGetLevel();
		let worth = 0;
		for (let index = 0; index <= curLevel; index++) {
			worth += this.upgradeCosts[index];
		}
		return worth;
	}

	wGetElement(): WeaponElement {
		return this.data.element;
	}

	wGetController(): SpinModifier {
		return this.caster.FindModifierByName("spin_passive") as SpinModifier;
	}

	wGetLevel(): number {
		return this.level;
	}

	wSetLevel(level: number) {
		if (level > this.maxLevel) {
			level = this.maxLevel;
		}
		this.level = level;
		this.updateWeaponData();
	}

	wGetSpecialValueFor(name: string): number {
		let level = this.wGetLevel();
		return this.wGetLevelSpecialValueFor(name, level);
	}

	wGetLevelSpecialValueFor(name: string, level: number): number {
		if (level > this.maxLevel) {
			level = this.maxLevel;
		}
		let value = this.data.values[name] || {base: 0, increase: 0} as WeaponValue;
		let result = value.base + value.increase * level
		if (value.step_val) result = result - (result % value.step_val);
		return result;
	}

	wGetModel(): string {
		return "models/heroes/leshrac/mesh/discoball_model.vmdl";
	}

	wGetModelScale(): number {
		if (this.wGetModel() == "models/heroes/leshrac/mesh/discoball_model.vmdl") {
			return 0;
		}
		return 1;
	}

	wGetAttackInterval(): number {
		return 1;
	}

	wOnAttack(pos: Vector, direction: Vector, dummy?: CDOTA_BaseNPC): void {
		// do stuff here

	}

	wGetPreAttackOffset(): number | undefined {
		return;
	}

	wOnPreAttack(pos: Vector, dummy?: CDOTA_BaseNPC): void {
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

	OnProjectileHit(target: CDOTA_BaseNPC | undefined, loc: Vector | undefined): boolean  {
		// do stuff here

		return true;
	}

	OnLaserHit(unit: CDOTA_BaseNPC, loc: Vector, hitInterval: number) {
		// do stuff here

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
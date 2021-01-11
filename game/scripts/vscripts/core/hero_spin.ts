import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../lib/dota_ts_adapter";
import { RotateVector2D } from "../lib/util";
import { Slot } from "./slots";
import { BaseWeapon } from "./weapon_base";

@registerAbility()
export class hero_spin extends BaseAbility {
	isInnate: boolean = true;

	GetIntrinsicModifierName():string  {
		return spin_passive.name;
	}
}

export class SpinModifier extends BaseModifier {

	LoadWeapon(weapon: BaseWeapon, index: number):void {
		print("Load weapon!", tostring(weapon));
	}

	UnloadWeapon(slot: number):void {
		print("UnlLoad weapon!", tostring(slot));
	}
}

@registerModifier()
export class spin_passive extends SpinModifier {
	caster: CDOTA_BaseNPC = this.GetCaster()!;
	ability: CDOTABaseAbility = this.GetAbility()!; 
	parent: CDOTA_BaseNPC = this.GetParent();

	IsHidden() {return true}
	IsDebuff() {return false}
	IsPurgable() {return false}
	RemoveOnDeath() {return false}

	count: number = this.ability.GetSpecialValueFor("slots");
	distance: number = 100;
	offset: number = 100;

	angle: number = 0;
	speed: number = -30;
	interval: number = 1/60;
	tick: number = 0;

	started: boolean = false;
	slots: Slot[] = [];

	OnCreated(): void {
		this.StartIntervalThink(this.interval);
	}

	OnIntervalThink(): void {
		if (IsClient()) {return;}
		if (!this.started) {
			this.started = true;
			let casterLoc: Vector = this.caster.GetAbsOrigin();
			let angle: number = 360 / this.count;
			for (let i = 0; i < this.count; i++) {
				let newLoc: Vector = (casterLoc + (RotateVector2D(Vector(1,0,0), this.angle + angle * i) * this.distance) + Vector(0,0,this.offset)) as Vector;
				let slot: Slot = new Slot(this.caster, newLoc, i);
				this.slots[i] = slot;
			}
		} else {
			this.angle += this.speed * this.interval;
			if (this.angle >= 360) {
				this.angle -= 360;
			}

			let casterLoc = this.caster.GetAbsOrigin();
			let angle: number = 360 / this.count;
			for (let i = 0; i < this.count; i++) {
				let newLoc: Vector = (casterLoc + (RotateVector2D(Vector(1,0,0), this.angle + angle * i) * this.distance) + Vector(0,0,this.offset)) as Vector;
				let syncInterval = this.slots[i].getInterval() / (1/this.interval);
				let sync = false;
				if (syncInterval > 0) {
					let syncVal = Math.round((this.count - i - 1) * ((1/this.interval) / this.count)) * syncInterval;
					let finalSync = syncVal - (this.tick % ((1/this.interval) * syncInterval))
					sync = finalSync <= 0 || finalSync > -1;
				}
				this.slots[i].tick(newLoc, sync);
			}
			this.tick++;
			// if (this.tick == ((1/this.interval) * this.fullRound)) {
			// 	this.tick = 0;
			// }
		}
	}

	LoadWeapon(weapon: BaseWeapon, index: number) {
		print("Load Weapon into slot ", index - 1);
		let slot: Slot = this.slots[index - 1];
		slot.load(weapon);
	}

	UnloadWeapon(index: number) {
		let slot: Slot = this.slots[index - 1];
		slot.unload();
	}

}
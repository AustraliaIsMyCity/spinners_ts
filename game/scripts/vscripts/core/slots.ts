import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";
import { BaseWeapon } from "./weapon_base";

export class Slot {

	curLoc: Vector;
	id: number;
	parent: CDOTA_BaseNPC;

	dummy: CDOTA_BaseNPC;
	particle: ParticleID;
	weapon: BaseWeapon | undefined;
	interval: number = 0;
	tickVal: number = -1;
	waiting: boolean = false;

	offset?: number;

	constructor(unit: CDOTA_BaseNPC, pos: Vector, id: number) {
		this.curLoc = pos;
		this.id = id;
		this.parent = unit;

		this.dummy = CreateUnitByName("npc_dota_dummy_unit", pos, false, unit, unit.GetPlayerOwner(), unit.GetTeamNumber())
		this.dummy.AddNewModifier(unit, undefined, modifier_dummy_slot.name, undefined);
		this.dummy.SetModelScale(5);
		this.particle = ParticleManager.CreateParticle("particles/slots/slot_empty.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, unit);
		ParticleManager.SetParticleControlEnt(this.particle, 0, this.dummy, ParticleAttachment.ABSORIGIN_FOLLOW, AttachLocation.EMPTY, this.dummy.GetAbsOrigin(), true);
	}

	public toString(): string {
		return "Slot " + this.id + "( Empty )";
	}

	public tick(pos: Vector, sync: boolean): void {
		this.dummy.SetAbsOrigin(pos);
		this.curLoc = pos;

		if (this.tickVal >= 0) {

			if (this.waiting && !sync) {
				return;
			} else if (this.waiting && sync) {
				this.waiting = false;
			}

			let parentLoc: Vector = this.parent.GetAbsOrigin();
			let direction: Vector = ((parentLoc - this.curLoc) as Vector).Normalized();
			direction = Vector(-direction.x, -direction.y, 0);
			this.dummy.SetForwardVector(direction);

			if ((this.offset) && (((this.tickVal + (this.offset * 60)) % this.interval) < 1)) {
				if (this.weapon !== undefined) {
					let parentLoc: Vector = this.parent.GetAbsOrigin();
					this.weapon.wOnPreAttack(parentLoc, this.dummy);
				}
			}
			if ((this.tickVal % this.interval) < 1) {
				if (this.weapon !== undefined) {
					this.weapon.wOnAttack(this.curLoc, direction, this.dummy);
				}
				this.tickVal = 0;
			}
			this.tickVal += 1;
		}
	}

	public load(weapon: BaseWeapon) {
		this.weapon = weapon;
		this.dummy.SetModel(weapon.wGetModel());
		this.dummy.SetModelScale(weapon.wGetModelScale());
		this.interval = weapon.wGetAttackInterval() * 60;
		this.offset = weapon.wGetPreAttackOffset();
		this.tickVal = 0;
		this.waiting = true;
		print("Loaded!");
	}

	public unload() {
		this.weapon = undefined;
		this.dummy.SetModelScale(0);
		this.interval = 0;
		this.tickVal = -1;
	}

	public pause() {
		this.tickVal = -1;
	}

	public getInterval(): number {
		return this.interval;
	}
}

@registerModifier()
export class modifier_dummy_slot extends BaseModifier {
	
	CheckState(): Partial<Record<ModifierState, boolean>> {
		return {
			[ModifierState.UNSELECTABLE]: true,
			[ModifierState.NO_UNIT_COLLISION]: true,
			[ModifierState.NO_HEALTH_BAR]: true,
			[ModifierState.NOT_ON_MINIMAP]: true,
			[ModifierState.ATTACK_IMMUNE]: true,
			[ModifierState.MAGIC_IMMUNE]: true,
			[ModifierState.INVISIBLE]: true,
			[ModifierState.DISARMED]: true,
			[ModifierState.ROOTED]: true,
		};
	}
}
import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";
import { LineDistance } from "../lib/util";
import { BaseWeapon } from "./weapon_base";
import { modifier_dummy_slot } from "../core/slots";

export function AddNewWeaponModifier(weapon: BaseWeapon, unit: CDOTA_BaseNPC, modifierName: string, args?: object): WeaponModifier {
	let modifier = unit.AddNewModifier(weapon.wGetCaster(), weapon.wGetAbility(), modifierName, args) as WeaponModifier;
	modifier.setSourceWeapon(weapon);
	return modifier;
}

export class WeaponModifier extends BaseModifier {
	source?: BaseWeapon;

	setSourceWeapon(weapon: BaseWeapon) {
		this.source = weapon;
	}
}

export function CreateNewLaser(weapon: BaseWeapon, referenceUnit: CDOTA_BaseNPC, distance: number, width: number, duration: number, effectName: string) {
	let modifier = weapon.wGetCaster().AddNewModifier(weapon.wGetCaster(), weapon.wGetAbility(), modifier_basic_laser.name, {Duration: duration, effect: effectName}) as modifier_basic_laser;
	modifier.SetReference(referenceUnit, distance, width, weapon);
}

export function DoCustomKnockback(unit: CDOTA_BaseNPC, direction: Vector, distance: number) {
	let velocity = direction * distance / 2 as Vector;
	AddVelocity(unit, velocity);
}

export function AddVelocity(unit: CDOTA_BaseNPC, velocity: Vector) {
	if (unit.HasModifier(modifier_unit_velocity.name)) {
		let modifier = unit.FindModifierByName(modifier_unit_velocity.name)! as modifier_unit_velocity;
		modifier.AddVelocity(velocity);
	} else {
		let modifier = unit.AddNewModifier(unit, undefined, modifier_unit_velocity.name, undefined) as modifier_unit_velocity;
		modifier.AddVelocity(velocity);
	}
}

@registerModifier()
export class modifier_unit_velocity extends BaseModifier {

	tickSpeed: number = 1/60;
	curVelocity: Vector = Vector(0,0,0);
	defaultFriction = 0.25;
	minSpeed = 50;

	AddVelocity(newVelocity: Vector) {
		this.curVelocity = this.curVelocity + newVelocity as Vector;
	}

	OnIntervalThink() {
		let parent = this.GetParent();
		let speed = this.curVelocity.Length2D();
		let direction = this.curVelocity.Normalized();
		let parentLoc = parent.GetAbsOrigin();
		let newLoc = parentLoc + direction * speed * this.tickSpeed as Vector;
		parent.SetAbsOrigin(newLoc);

		let newSpeed = speed - speed * (this.defaultFriction * this.defaultFriction * this.tickSpeed);
		if (newSpeed <= this.minSpeed) {
			this.curVelocity = Vector(0,0,0);
			this.StartIntervalThink(-1);
			return;
		}
		this.curVelocity = direction * newSpeed as Vector;
	}
}

@registerModifier()
export class modifier_basic_laser extends BaseModifier {
	
	caster: CDOTA_BaseNPC_Hero = this.GetCaster() as CDOTA_BaseNPC_Hero;
	particleID?: ParticleID;
	particleName?: string;
	dummy?: CDOTA_BaseNPC;
	distance: number = 1000;
	width: number = 100;
	damage: number = 0;
	auraDummies: CDOTA_BaseNPC[] = [];
	auraRadius: number = 200;

	weapon?: BaseWeapon;

	IsHidden() {return false;}
	IsDebuff() {return false;}
	IsPurgable() {return false;}

	GetAttributes() {
		return ModifierAttribute.MULTIPLE;
	}

	OnCreated(event: {effect: string}) {
		if (IsClient()) {return;}
		this.particleName = event.effect;
		this.StartIntervalThink(1/60);
	}

	OnIntervalThink() {
		if (this.dummy) {
			let direction = this.dummy.GetForwardVector();
			let curLoc = this.dummy.GetAbsOrigin();
			let endLoc = (curLoc + direction * this.distance) as Vector;

			ParticleManager.SetParticleControl(this.particleID!, 9, curLoc);
			ParticleManager.SetParticleControl(this.particleID!, 1, endLoc);

			for (let index = 0; index < this.auraDummies.length; index++) {
				let position = (curLoc + direction * this.auraRadius * index * 2 + direction * this.auraRadius) as Vector;
				let dummy = this.auraDummies[index];
				dummy.SetAbsOrigin(position);
				let modifier = dummy.FindModifierByName(modifier_basic_laser_aura_emitter.name)! as modifier_basic_laser_aura_emitter;
				modifier.UpdateLocations(curLoc, endLoc);
				// DebugDrawCircle(position, Vector(255,0,0), 0, this.auraRadius, false, 1/60);
			}
		}
	}

	SetReference(refUnit: CDOTA_BaseNPC, distance: number, width: number, weapon: BaseWeapon) {
		this.dummy = refUnit;
		this.distance = distance;
		this.width = width;
		this.weapon = weapon;

		let direction = this.dummy.GetForwardVector();
		let curLoc = this.dummy.GetAbsOrigin();
		let endLoc = (curLoc + direction * this.distance) as Vector;

		let particle = ParticleManager.CreateParticle(this.particleName!, ParticleAttachment.CUSTOMORIGIN, this.caster);
		ParticleManager.SetParticleControl(particle, 9, curLoc);
		ParticleManager.SetParticleControl(particle, 1, endLoc);
		ParticleManager.SetParticleControl(particle, 2, Vector(this.GetDuration(), 0, 0));
		this.particleID = particle
		
		let minRadius = 150;
		let count = Math.floor(this.distance / minRadius * 0.5);
		let actualRadius = minRadius + (this.distance - minRadius * count * 2) / count;
		this.auraRadius = actualRadius;

		let playerID = this.caster.GetPlayerID();
		let player = PlayerResource.GetPlayer(playerID)!;

		for (let index = 0; index < count; index++) {
			let position = (curLoc + direction * actualRadius * index * 2 + direction * actualRadius) as Vector;
			let dummy = CreateUnitByName("npc_dota_dummy_unit", position, false, this.caster, player, this.caster.GetTeamNumber());
			dummy.AddNewModifier(this.caster, this.GetAbility(), modifier_dummy_slot.name, undefined);
			let emitterModifier = dummy.AddNewModifier(this.caster, this.GetAbility(), modifier_basic_laser_aura_emitter.name, {
				radius: actualRadius,
				width: this.width,
				startX: curLoc.x,
				startY: curLoc.y,
				endX: endLoc.x,
				endY: endLoc.y,
			}) as modifier_basic_laser_aura_emitter;
			emitterModifier.SetReference(this.weapon);
			this.auraDummies.push(dummy);
			// DebugDrawCircle(position, Vector(255,0,0), 0, actualRadius, false, 1/60);
		}
	}

	OnDestroy() {
		if (this.particleID) {
			ParticleManager.DestroyParticle(this.particleID, true);
		}
		this.auraDummies.forEach(dummy => {
			dummy.ForceKill(false);
		});
	}
}

@registerModifier()
export class modifier_basic_laser_aura_emitter extends BaseModifier {

	radius: number = 0;
	width: number = 100;
	startLoc?: Vector;
	endLoc?: Vector;

	weapon?: BaseWeapon;

	IsHidden() {return false;}
	IsDebuff() {return false;}
	IsPurgable() {return false;}

	OnCreated(event: {
		radius: number,
		width: number,
		startX: number,
		startY: number,
		endX: number,
		endY: number,
	}) {
		if (IsClient()) {return;}
		this.radius = event.radius;
		this.width = event.width;
		this.startLoc = Vector(event.startX, event.startY, 0);
		this.endLoc = Vector(event.endX, event.endY, 0);
	}

	SetReference(weapon: BaseWeapon) {
		this.weapon = weapon;
	}

	UpdateLocations(startLoc: Vector, endLoc: Vector) {
		this.startLoc = startLoc;
		this.endLoc = endLoc;
	}

	IsAura() {return true;}
	GetModifierAura() {
		return modifier_basic_laser_aura.name;
	}
	GetAuraRadius() {
		return this.radius;
	}
	GetAuraSearchFlags() {
		return UnitTargetFlags.NONE;
	}
	GetAuraSearchType() {
		return UnitTargetType.BASIC + UnitTargetType.HERO;
	}
	GetAuraSearchTeam() {
		return UnitTargetTeam.ENEMY;
	}
	GetAuraDuration() {
		return 0.02
	}
	GetAuraEntityReject(unit: CDOTA_BaseNPC) {
		let unitLoc = unit.GetAbsOrigin();
		let distance = LineDistance(this.startLoc!, this.endLoc!, unitLoc);
		if (distance > this.width) {
			return false;
		}
		return true;
	}
}

@registerModifier()
export class modifier_basic_laser_aura extends BaseModifier {

	interval: number = 1/60;
	weapon?: BaseWeapon;

	IsHidden() {return false;}
	IsDebuff() {return true;}
	IsPurgable() {return false;}

	OnCreated() {
		if (IsClient()) {return;}
		this.StartIntervalThink(this.interval);
		let inflictor = this.GetAuraOwner()!;
		let emitterModifier = inflictor.FindModifierByName(modifier_basic_laser_aura_emitter.name) as modifier_basic_laser_aura_emitter;
		if (emitterModifier) {
			this.weapon = emitterModifier.weapon;
		}
	}

	OnIntervalThink() {
		if (!this.weapon) {
			return;
		}
		let parent = this.GetParent();
		this.weapon.OnLaserHit(parent, parent.GetAbsOrigin(), this.interval);
	}
}
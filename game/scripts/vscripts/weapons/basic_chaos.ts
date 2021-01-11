import { ProjectileOptions, ProjectileState } from "../core/custom_projectile_enums";
import * as CustomProjectileManager from "../core/custom_projectile_manager";
import { modifier_dummy_slot } from "../core/slots";
import { BaseWeapon } from "../core/weapon_base";
import { CreateNewLaser } from "../core/weapon_functions";
import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";
import { LineDistance } from "../lib/util";
// import { registerWeapon } from "../core/weapon_manager";


// @registerWeapon()
export class basic_chaos extends BaseWeapon {

	projectile?: number;

	wGetModel():string {
		return "models/heroes/oracle/crystal_ball.vmdl";
	}

	wGetModelScale():number {
		return 0.4
	}

	wGetName():string {
		return "Basic Chaos"
	}

	wGetAttackInterval():number {
		return this.wGetSpecialValueFor("interval");
	}

	wOnAttack(loc: Vector, direction: Vector, dummy: CDOTA_BaseNPC) {
		let distance = this.wGetSpecialValueFor("distance");
		let width = this.wGetSpecialValueFor("width");
		let duration = this.wGetSpecialValueFor("duration");
		let damage = this.wGetSpecialValueFor("damage_per_second");

		CreateNewLaser(this, dummy, distance, width, duration, "particles/weapon_effect/chaos_beam/chaos_beam.vpcf");
	}

	OnLaserHit(unit: CDOTA_BaseNPC, loc: Vector, interval: number) {
		let damage = this.wGetSpecialValueFor("damage_per_second");
		let damageTable: ApplyDamageOptions = {
			victim: unit,
			attacker: this.wGetCaster(),
			damage: damage * interval,
			damage_type: DamageTypes.MAGICAL,
		}
		ApplyDamage(damageTable);
	}
}

@registerModifier()
export class modifier_chaos_beam_caster extends BaseModifier {

	caster: CDOTA_BaseNPC_Hero = this.GetCaster() as CDOTA_BaseNPC_Hero;

	particleID?: ParticleID;
	dummy?: CDOTA_BaseNPC;
	distance: number = 1000;
	width: number = 100;
	damage: number = 0;

	auraDummies: CDOTA_BaseNPC[] = [];
	auraRadius: number = 200;

	IsHidden() {return false;}
	IsDebuff() {return false;}
	IsPurgable() {return false;}

	GetAttributes() {
		return ModifierAttribute.MULTIPLE;
	}

	OnCreated() {
		if (IsClient()) {return;}
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
				let modifier = dummy.FindModifierByName(modifier_chaos_beam_aura_emitter.name)! as modifier_chaos_beam_aura_emitter;
				modifier.UpdateLocations(curLoc, endLoc);
				// DebugDrawCircle(position, Vector(255,0,0), 0, this.auraRadius, false, 1/60);
			}
		}
	}

	SetReference(refUnit: CDOTA_BaseNPC, distance: number, width: number, damage: number) {
		this.dummy = refUnit;
		this.distance = distance;
		this.width = width;
		this.damage = damage;

		let direction = this.dummy.GetForwardVector();
		let curLoc = this.dummy.GetAbsOrigin();
		let endLoc = (curLoc + direction * this.distance) as Vector;

		let particle = ParticleManager.CreateParticle("particles/weapon_effect/chaos_beam/chaos_beam.vpcf", ParticleAttachment.CUSTOMORIGIN, this.caster);
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
			dummy.custom_variable = damage;
			dummy.AddNewModifier(this.caster, this.GetAbility(), modifier_chaos_beam_aura_emitter.name, {
				radius: actualRadius,
				width: this.width,
				startX: curLoc.x,
				startY: curLoc.y,
				endX: endLoc.x,
				endY: endLoc.y,
			})
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
export class modifier_chaos_beam_aura_emitter extends BaseModifier {

	radius: number = 0;
	width: number = 100;
	startLoc?: Vector;
	endLoc?: Vector;

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

	UpdateLocations(startLoc: Vector, endLoc: Vector) {
		this.startLoc = startLoc;
		this.endLoc = endLoc;
	}

	IsAura() {return true;}
	GetModifierAura() {
		return modifier_chaos_beam_aura.name;
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
export class modifier_chaos_beam_aura extends BaseModifier {

	damage: number = 0;
	interval: number = 1/60;

	IsHidden() {return false;}
	IsDebuff() {return true;}
	IsPurgable() {return false;}

	OnCreated() {
		if (IsClient()) {return;}
		this.StartIntervalThink(this.interval);
		let inflictor = this.GetAuraOwner()!;
		this.damage = inflictor.custom_variable!;
	}

	OnIntervalThink() {
		if (!this.damage) {
			return;
		}
		let damage = this.damage * this.interval;
		let damageTable: ApplyDamageOptions = {
			victim: this.GetParent(),
			attacker: this.GetCaster()!,
			damage: damage,
			damage_type: DamageTypes.MAGICAL,
		}
		ApplyDamage(damageTable);
	}
}


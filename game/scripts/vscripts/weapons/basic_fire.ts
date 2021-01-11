import { ProjectileOptions, ProjectileState } from "../core/custom_projectile_enums";
import * as CustomProjectileManager from "../core/custom_projectile_manager";
import { SpinModifier } from "../core/hero_spin";
import { ProjectilePathModifier } from "../core/path_modifier";
import { BaseWeapon } from "../core/weapon_base";
// import { registerWeapon } from "../core/weapon_manager";


// @registerWeapon()
export class basic_fire extends BaseWeapon {

	projectile?: number;

	wGetModel():string {
		return "models/items/meepo/diggers_divining_rod/diggers_divining_rod_gem_ruby.vmdl";
	}

	wGetName():string {
		return "Basic Fire"
	}

	wGetAttackInterval():number {
		return this.wGetSpecialValueFor("interval");
	}

	wOnAttack(loc: Vector, direction: Vector) {
		let radius = this.wGetSpecialValueFor("radius");
		let speed = this.wGetSpecialValueFor("speed");
		let distance = this.wGetSpecialValueFor("distance");

		let snakeModifier = ProjectilePathModifier.fromTemplate("snake");
		snakeModifier.setActiveState(ProjectileState.ACTIVE);
		
		let slowModifier = ProjectilePathModifier.fromTemplate("sinus_slow");
		slowModifier.setActiveState(ProjectileState.CUSTOM_1);

		let stateModifier = ProjectilePathModifier.fromTemplate("state_change_after_delay");
		stateModifier.setActiveState(ProjectileState.ACTIVE);
		stateModifier.setVal("newState", ProjectileState.CUSTOM_1);
		stateModifier.setVal("delay", 1);

		let aimModifier = ProjectilePathModifier.fromTemplate("aim_at_target");
		aimModifier.setActiveState(ProjectileState.CUSTOM_1);
		aimModifier.setVal("target", this.caster);

		let projectileTable:ProjectileOptions = {
			caster:  this.caster,
			ability: this,
			startLoc: loc,
			trailEffect: "particles/projectiles/fireball/fireball.vpcf",
			radius: radius,
			distance: distance,
			iUnitTargetTeam: this.GetAbilityTargetTeam(),
			iUnitTargetFlags: this.GetAbilityTargetFlags(),
			iUnitTargetType: this.GetAbilityTargetType(),
			direction: direction,
			initialSpeed: speed,
			maxSpeed: speed,
			visionRadius: radius,
			teamNumber: this.caster.GetTeamNumber(),
			destroyOnHit: true,
			pathModifier: [
				// snakeModifier,
				// slowModifier,
				// stateModifier,
				// aimModifier,
			]
		}

		this.projectile = CustomProjectileManager.CreateProjectile(projectileTable);
		// DebugDrawLine(loc, (loc + direction * distance) as Vector, 255, 0 , 0, false, this.wGetAttackInterval());
	}

	OnProjectileHit(target: CDOTA_BaseNPC | undefined, loc: Vector | undefined):boolean {
		if (loc !== undefined) {
			// DebugDrawCircle(loc, Vector(0,255,0), 0, 100, false, 2);
			let radius = this.wGetSpecialValueFor("radius");
			let damage = this.wGetSpecialValueFor("damage");

			let results: CDOTA_BaseNPC[] = FindUnitsInRadius(
				this.caster.GetTeamNumber(),
				loc,
				this.caster,
				radius,
				this.GetAbilityTargetTeam(),
				this.GetAbilityTargetType(),
				this.GetAbilityTargetFlags(),
				FindOrder.CLOSEST,
				true,
			)
			let damageTable:ApplyDamageOptions;

			results.forEach(element => {
				damageTable = {
					damage: damage,
					attacker: this.caster,
					damage_type: DamageTypes.MAGICAL,
					victim: element,
				}
				ApplyDamage(damageTable);
			});
			let particle:ParticleID = ParticleManager.CreateParticle("particles/projectiles/fireball/fireball_explosion.vpcf", ParticleAttachment.CUSTOMORIGIN, this.caster);
			ParticleManager.SetParticleControl(particle, 3, loc!);
			ParticleManager.ReleaseParticleIndex(particle);
		}
		return false;
	}
}
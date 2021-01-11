import { ProjectileOptions, ProjectileState } from "../core/custom_projectile_enums";
import * as CustomProjectileManager from "../core/custom_projectile_manager";
import { BaseWeapon } from "../core/weapon_base";
// import { registerWeapon } from "../core/weapon_manager";


// @registerWeapon()
export class basic_ice extends BaseWeapon {

	projectile?: number;

	wGetModel():string {
		return "models/items/furion/np_ti9_immortal_back/np_ti9_immortal_gem.vmdl";
	}

	wGetName():string {
		return "Basic Ice"
	}

	wGetAttackInterval():number {
		return this.wGetSpecialValueFor("interval");
	}

	wOnAttack(loc: Vector, direction: Vector) {
		let radius = this.wGetSpecialValueFor("radius");
		let speed = this.wGetSpecialValueFor("speed");
		let distance = this.wGetSpecialValueFor("distance");

		let projectileTable:ProjectileOptions = {
			caster:  this.caster,
			ability: this,
			startLoc: loc,
			trailEffect: "particles/projectiles/ice_shards/ice_shards.vpcf",
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
		}

		this.projectile = CustomProjectileManager.CreateProjectile(projectileTable);
	}

	OnProjectileHit(target: CDOTA_BaseNPC | undefined, loc: Vector | undefined):boolean {
		if (target !== undefined) {
			let radius = this.wGetSpecialValueFor("radius");
			let damage = this.wGetSpecialValueFor("damage");

			let damageTable:ApplyDamageOptions = {
				damage: damage,
				attacker: this.caster,
				damage_type: DamageTypes.MAGICAL,
				victim: target,
			};
			ApplyDamage(damageTable);

			let particle:ParticleID = ParticleManager.CreateParticle("particles/projectiles/ice_shards/ice_shards_explosion.vpcf", ParticleAttachment.CUSTOMORIGIN, this.caster);
			ParticleManager.SetParticleControl(particle, 0, target.GetAbsOrigin());
			ParticleManager.ReleaseParticleIndex(particle);
		}
		return false;
	}
}
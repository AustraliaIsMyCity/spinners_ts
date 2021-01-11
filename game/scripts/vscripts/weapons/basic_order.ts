import { ProjectileOptions, ProjectileState } from "../core/custom_projectile_enums";
import * as CustomProjectileManager from "../core/custom_projectile_manager";
import { ProjectilePathModifier } from "../core/path_modifier";
import { BaseWeapon } from "../core/weapon_base";
import { RotateVector2D } from "../lib/util";
// import { registerWeapon } from "../core/weapon_manager";


// @registerWeapon()
export class basic_order extends BaseWeapon {

	projectile?: number;

	wGetModel():string {
		return "models/items/meepo/diggers_divining_rod/diggers_divining_rod_gem_topaz.vmdl";
	}

	wGetName():string {
		return "Basic Order"
	}

	wGetAttackInterval():number {
		return this.wGetSpecialValueFor("interval");
	}

	wOnAttack(loc: Vector, direction: Vector, dummy: CDOTA_BaseNPC) {
		let radius = this.wGetSpecialValueFor("radius");
		let speed = this.wGetSpecialValueFor("speed");
		let distance = this.wGetSpecialValueFor("distance");
		let count = this.wGetSpecialValueFor("count");
		let delay = 0.2;

		let homeModifier = ProjectilePathModifier.fromTemplate("homing");
		homeModifier.setVal("maxAngle", 8);
		homeModifier.setVal("searchRadius", 500);

		let projectileTable:ProjectileOptions = {
			caster:  this.caster,
			ability: this,
			startLoc: loc,
			trailEffect: "particles/projectiles/white_shards/white_shards.vpcf",
			radius: 100,
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
				homeModifier,
			]
		}

		let curCount = 0;

		Timers.CreateTimer(() => {
			let randomSide = RandomInt(0,1) * 2 - 1;
			let randomAngle = RandomInt(0, 15) * randomSide;
			direction = dummy.GetForwardVector();
			projectileTable.direction = RotateVector2D(direction, randomAngle);
			projectileTable.startLoc = dummy.GetAbsOrigin();
			this.projectile = CustomProjectileManager.CreateProjectile(projectileTable);
			curCount += 1;
			if (curCount >= count) return;
			return delay;
		});
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

			// let particle:ParticleID = ParticleManager.CreateParticle("particles/projectiles/ice_shards/ice_shards_explosion.vpcf", ParticleAttachment.CUSTOMORIGIN, this.caster);
			// ParticleManager.SetParticleControl(particle, 0, target.GetAbsOrigin());
			// ParticleManager.ReleaseParticleIndex(particle);
		}
		return false;
	}
}
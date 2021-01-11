import { BaseWeapon } from "../core/weapon_base";
import { AngleCalculation } from "../lib/util";
// import { registerWeapon } from "../core/weapon_manager";


// @registerWeapon()
export class basic_electricity extends BaseWeapon {

	projectile?: number;

	wGetModel() {
		return "models/items/meepo/diggers_divining_rod/diggers_divining_rod_gem_pink.vmdl";
	}

	wGetName() {
		return "Basic Electricity"
	}

	wGetAttackInterval() {
		return this.wGetSpecialValueFor("interval");
	}

	wGetPreAttackOffset() {
		return 0.5;
	}

	wOnPreAttack(pos: Vector, dummy: CDOTA_BaseNPC) {
		let particle = ParticleManager.CreateParticle("particles/weapon_effect/electricity/electricity_loading.vpcf", ParticleAttachment.CUSTOMORIGIN, dummy);
		ParticleManager.SetParticleControlEnt(particle, 0, dummy, ParticleAttachment.ABSORIGIN_FOLLOW, AttachLocation.HITLOC, Vector(0,0,0), false);
		ParticleManager.ReleaseParticleIndex(particle);
	}

	wOnAttack(loc: Vector, direction: Vector, dummy: CDOTA_BaseNPC) {
		let distance = this.wGetSpecialValueFor("distance");
		let damage = this.wGetSpecialValueFor("damage");
		let maxAngle = 70;

		let results: CDOTA_BaseNPC[] = FindUnitsInRadius(
			this.caster.GetTeamNumber(),
			loc,
			this.caster,
			distance,
			this.GetAbilityTargetTeam(),
			this.GetAbilityTargetType(),
			this.GetAbilityTargetFlags(),
			FindOrder.CLOSEST,
			true,
		)
		let damageTable:ApplyDamageOptions;

		if (results.length == 0) {
			return;
		}

		let target = results[0];

		let targetLoc = target.GetAbsOrigin();
		let targetDir = ((targetLoc - loc) as Vector).Normalized();
		let angle = AngleCalculation(targetDir, direction);
		if (angle < maxAngle) {
			damageTable = {
				damage: damage,
				attacker: this.caster,
				damage_type: DamageTypes.MAGICAL,
				victim: target,
			}
			ApplyDamage(damageTable);
			let particle = ParticleManager.CreateParticle("particles/econ/events/ti4/dagon_ti4.vpcf", ParticleAttachment.CUSTOMORIGIN_FOLLOW, dummy);
			ParticleManager.SetParticleControlEnt(particle, 0, dummy, ParticleAttachment.ABSORIGIN_FOLLOW, AttachLocation.HITLOC, Vector(0,0,0), false);
			ParticleManager.SetParticleControlEnt(particle, 1, target, ParticleAttachment.ABSORIGIN_FOLLOW, AttachLocation.HITLOC, Vector(0,0,0), false);
			ParticleManager.ReleaseParticleIndex(particle);
		}
	}
}
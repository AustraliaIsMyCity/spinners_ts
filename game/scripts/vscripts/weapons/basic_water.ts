import { ProjectileOptions, ProjectileState } from "../core/custom_projectile_enums";
import * as CustomProjectileManager from "../core/custom_projectile_manager";
import { BaseWeapon } from "../core/weapon_base";
// import { registerWeapon } from "../core/weapon_manager";


// @registerWeapon()
export class basic_water extends BaseWeapon {

	projectile?: number;

	wGetModel():string {
		return "models/items/meepo/diggers_divining_rod/diggers_divining_rod_gem_saphire.vmdl";
	}

	wGetName():string {
		return "Basic Water"
	}

	wGetAttackInterval():number {
		return this.wGetSpecialValueFor("interval");
	}

	wOnAttack(loc: Vector, direction: Vector) {
		print("Water Attack");
	}
}
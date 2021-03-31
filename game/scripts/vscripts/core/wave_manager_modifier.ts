import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";
import * as WaveManager from "./wave_manager";

export class BaseAI extends BaseModifier {
	SetTarget(target: CDOTA_BaseNPC):void {

	};
}

@registerModifier()
export class UnitAI extends BaseAI {

	target?: CDOTA_BaseNPC;
	parent = this.GetParent();
	curCount = 0;

	IsHidden() {return false;}
	IsDebuff() {return true;}

	OnCreated() {
		if (IsClient()) {return;}
		this.StartIntervalThink(1);
		this.SetStackCount(0);
	}

	OnIntervalThink() {
		this.SetStackCount(this.curCount);
		this.curCount += 1;
	}

	SetTarget(target: CDOTA_BaseNPC) {
		this.target = target;
		ExecuteOrderFromTable(
            {
                OrderType: UnitOrder.ATTACK_TARGET,
                UnitIndex: this.parent.entindex(),
                TargetIndex: this.target.entindex()
            }
        );
	}

	DeclareFunctions(): ModifierFunction[]
    {
		return [
			ModifierFunction.ON_DEATH,
			ModifierFunction.MOVESPEED_BONUS_PERCENTAGE,
			ModifierFunction.BASEATTACK_BONUSDAMAGE,
		];
	}

	OnDeath(event: ModifierAttackEvent) {
		if (IsClient()) {return;}
		if (this.parent == event.unit) {
			WaveManager.RegisterDeath(this.parent);
		}
	}

	GetModifierMoveSpeedBonus_Percentage():number {
		return this.GetStackCount() * 2;
	}

	GetModifierBaseAttack_BonusDamage() {
		return this.GetParent().GetHealth();
	}

	IsAura() {return true;}
	GetAuraRadius() {return 100;}
	GetAuraSearchFlags() {return UnitTargetFlags.NONE;}
	GetAuraSearchType() {return UnitTargetType.HERO;}
	GetAuraSearchTeam() {return UnitTargetTeam.ENEMY;}
	GetAuraDuration() {return 1;}
	GetModifierAura() {return "UnitHitModifier";}
}

@registerModifier()
export class UnitHitModifier extends BaseModifier {

	GetAttributes() {
		return ModifierAttribute.MULTIPLE;
	}

	OnCreated() {
		if (IsClient()) {return;}
		let owner = this.GetAuraOwner()!;
		let damage = owner.GetAttackDamage();
		ApplyDamage({victim: this.GetParent(), damage: damage, damage_type: DamageTypes.PURE, attacker: owner})
		owner.ForceKill(false);
	}
}

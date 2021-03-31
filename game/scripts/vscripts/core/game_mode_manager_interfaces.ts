import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

export interface PresetData {
	name: string;
	content: PresetDataContent[];
}

export interface PresetDataContent {
	name: string;
	level: number;
	count: number;
}

@registerModifier()
export class modifier_cut_scene_stun extends BaseModifier {

	IsDebuff() {return true;}
	IsHidden() {return false;}

	GetAttributes() {
		return ModifierAttribute.MULTIPLE;
	}

	OnCreated() {
		if (IsClient()) {return;}
		let caster = this.GetParent();
		caster.Stop();
	}

	CheckState() {
		return {
			[ModifierState.COMMAND_RESTRICTED]: true,
			[ModifierState.STUNNED]: true,
		}
	}
}

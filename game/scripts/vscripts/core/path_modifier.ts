import { AngleCalculation, AngleCalculationWithSide, GetVectorSide, RotateVector2D } from "../lib/util";
import { PathModifierData, PathModifierOptions, PathModifierResult, ProjectileData, ProjectileState } from "./custom_projectile_enums";

// Templates usable:
// "snake": 
//     - sinus like pattern
//     opVal: controls the amplitude of the pattern
// 
// 
// 

export class ProjectilePathModifier {
	type: string;
	private callback: (data: ProjectileData, optVals: PathModifierData) => PathModifierResult;
	private optVals: PathModifierData;
	private activeState?:ProjectileState;

	constructor(options: PathModifierOptions) {
		this.type = options.type;
		this.callback = options.callback;
		this.optVals = new PathModifierData;
	}

	static fromTemplate(template: string):ProjectilePathModifier  {
		let callback: ((data: ProjectileData, optVals: PathModifierData) => PathModifierResult) | undefined = PathModifierTemplates.getMovement(template);
		if (callback == undefined) {
			callback = PathModifierTemplates.getMovement("default");
		}
		let options:PathModifierOptions = {
			type: template,
			callback: callback!,
		}

		return new this(options);
	}

	//optVal can have different effects, depending on the type you use
	setVal(name: string, value: any):void {
		this.optVals.setVal(name, value);
	}

	setActiveState(newState: ProjectileState):void {
		this.activeState = newState;
	}

	isActive(curState: ProjectileState):boolean {
		if (this.activeState == undefined) {
			return curState !== ProjectileState.DEAD;
		}
		return curState == this.activeState;
	}

	modifyVelocity(data: ProjectileData):PathModifierResult {
		let result: PathModifierResult = this.callback(data, this.optVals);
		return result;
	}

	
}

class PathModifierTemplates {

	static possibleTemplates: string[] = [
		"snake",
		"sinus_slow",
		"state_change_after_delay",
		"aim_at_target",
		"homing",
	]

	static getMovement(template: string):((data: ProjectileData, optVals: PathModifierData) => PathModifierResult) | undefined {
		if (this.possibleTemplates.indexOf(template) == -1) {
			print("Not Path modifier template with name '" + template + "'");
			return;
		}

		if (template == "snake") {
			return this.snakeMovement;
		}
		if (template == "sinus_slow") {
			return this.sinusSlowMovement;
		}
		if (template == "state_change_after_delay") {
			return this.changeStateAfterDelay;
		}
		if (template == "aim_at_target") {
			return this.aimAtTarget;
		}
		if (template == "homing") {
			return this.homingMovement;
		}
	}

	static snakeMovement(data: ProjectileData, optVals: PathModifierData):PathModifierResult {
		let curveAmplitude = optVals.getVal<number>("curveAmplitude") || 50;
		let curveInterval = optVals.getVal<number>("curveInterval") || 5;

		let progress = ((data.lifetime) * curveInterval);
		let angle: number = math.cos((progress) * math.pi) * curveAmplitude;
		let newDir:Vector = RotateVector2D(data.direction, angle);

		let result: PathModifierResult = {
			newDirection: newDir,
			newSpeed: data.curSpeed,
		}
		return result;
	}

	static sinusSlowMovement(data: ProjectileData, optVals: PathModifierData):PathModifierResult {
		let curveInterval: number = optVals.getVal<number>("curveInterval") || 1;
		let progress = (data.lifetime * curveInterval);
		let slow: number = (math.sin((progress) * math.pi) + 1) / 2;

		let result: PathModifierResult = {
			newDirection: data.curDirection,
			newSpeed: data.initialSpeed * slow,
		}
		return result;
	}

	static changeStateAfterDelay(data: ProjectileData, optVals: PathModifierData):PathModifierResult {
		let newState: ProjectileState = optVals.getVal<ProjectileState>("newState") || data.state;
		let delay: number = optVals.getVal<number>("delay") || 0;
		let result: PathModifierResult = {
			newDirection: data.curDirection,
			newSpeed: data.curSpeed,
		}
		if (data.lifetime >= delay) {
			result.newState = newState;
		}
		return result;
	}

	static aimAtTarget(data: ProjectileData, optVals: PathModifierData):PathModifierResult {
		let result: PathModifierResult = {
			newDirection: data.curDirection,
			newSpeed: data.curSpeed,
		}
		let target: CDOTA_BaseNPC | undefined = optVals.getVal<CDOTA_BaseNPC>("target")
		if (target) {
			let targetLoc: Vector = target.GetAbsOrigin();
			result.newDirection = ((targetLoc - data.curLoc) as Vector).Normalized();
		}

		return result;
	}

	static homingMovement(data: ProjectileData, optVals: PathModifierData):PathModifierResult {
		let result: PathModifierResult = {
			newDirection: data.curDirection,
			newSpeed: data.curSpeed,
		}
		let target: CDOTA_BaseNPC | undefined = optVals.getVal<CDOTA_BaseNPC>("target");
		if (target && !target.IsAlive()) {
			target = undefined;
		}
		if (!target) {
			let searchRadius: number = optVals.getVal<number>("searchRadius") || 200;
			let caster: CDOTA_BaseNPC = data.caster;
			let results: CDOTA_BaseNPC[] = FindUnitsInRadius(
				caster.GetTeamNumber(),
				data.curLoc,
				caster,
				searchRadius,
				data.iUnitTargetTeam,
				data.iUnitTargetType,
				data.iUnitTargetFlags,
				FindOrder.CLOSEST,
				true,
			)
			let casterLoc = caster.GetAbsOrigin();
			let maxDistance = -1;
			for (const element of results) {
				let distance = (element.GetAbsOrigin() - casterLoc as Vector).Length2D();
				if (distance > maxDistance) {
					target = element;
					maxDistance = distance;
				}
			}
			if (target) {
				optVals.setVal("target", target);
			}
		}
		if (!target) return result;
		let targetLoc = target.GetAbsOrigin();
		let direction = (data.curLoc - targetLoc as Vector).Normalized();
		let angle = AngleCalculationWithSide(direction as Vector, data.curDirection);
		let maxAngle: number = optVals.getVal<number>("maxAngle") || 2;
		if (angle < 0) {
			maxAngle = (180 + angle) < maxAngle? -(180 + angle) : -maxAngle;
		} else {
			maxAngle = (180 - angle) < maxAngle? 180 - angle : maxAngle;
		}
		if (math.abs(maxAngle) < 1) return result;
		let newDirection = RotateVector2D(data.curDirection as Vector, maxAngle);
		result.newDirection = newDirection;

		return result;
	}
}
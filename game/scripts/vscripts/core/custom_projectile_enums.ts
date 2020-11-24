import { BaseAbility } from "../lib/dota_ts_adapter";
import { ProjectilePathModifier } from "./path_modifier";
import { BaseWeapon } from "./weapon_base";

export interface ProjectileOptions {
	caster:  CDOTA_BaseNPC;
	ability: BaseWeapon;
	startLoc: Vector;
	trailEffect: string;
	// hitEffect: string;
	radius: number;
	distance: number;
	iUnitTargetTeam: UnitTargetTeam,
	iUnitTargetFlags: UnitTargetFlags,
	iUnitTargetType: UnitTargetType,
	direction: Vector;
	initialSpeed: number;
	maxSpeed?: number | undefined;
	visionRadius?: number | undefined;
	teamNumber?: number | undefined;
	pathModifier?: ProjectilePathModifier[];
	destroyOnHit?:boolean;
	removeExisting?:boolean;
}

export interface ProjectileData extends ProjectileOptions{
	curLoc: Vector;
	curSpeed: number;
	curDirection: Vector;
	curDistance: number;
	lifetime: number;
	state: ProjectileState;
	particleID?: ParticleID;
	unitsHit: EntityIndex[];
}

export enum ProjectileState {
	ACTIVE = 0,
	DEAD = 1,
	PAUSED = 2,

	CUSTOM_1 = 10,
	CUSTOM_2 = 11,
	CUSTOM_3 = 12,
	CUSTOM_4 = 13,
	CUSTOM_5 = 14,
}

export interface PathModifierOptions {
	type: string;
	activeState?: ProjectileState;
	callback: (data: ProjectileData, optVals: PathModifierData) => PathModifierResult;
}

export interface PathModifierResult {
	newDirection: Vector,
	newSpeed: number,
	newState?: ProjectileState,
}

export class PathModifierData {
	private vals: {[name: string]: any} = {};

	//vals can have different effects, depending on the type you use
	setVal(name: string, value: any):void {
		this.vals[name] = value;
	}

	hasVal(name: string):boolean {
		if (this.vals.hasOwnProperty(name)) {
			return true;
		}
		return false;
	}

	getVal<T>(name: string):T | undefined {
		if (this.hasVal(name)) {
			return this.vals[name];
		}
    return undefined;
	}
}
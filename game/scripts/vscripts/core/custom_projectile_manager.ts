import { RotateVector2D } from "../lib/util";
import * as Arena from "./arena";
import {PathModifierResult, ProjectileData, ProjectileOptions, ProjectileState} from "./custom_projectile_enums";
import { ProjectilePathModifier } from "./path_modifier";

let currentIDs: number[] = [];
let removeIDs: number[] = [];
let data: {[id: number]: ProjectileData} = {};
let nextID: number = 0;
let running: boolean = false;
const tickSpeed = 30;

export function CreateProjectile(options: ProjectileOptions):number {
	// if no modifier is present, make it linear
	let projData: ProjectileData = Object.assign({}, options, {
		curLoc: options.startLoc,
		curSpeed: options.initialSpeed,
		curDirection: options.direction,
		curDistance: 0,
		lifetime: 0,
		state: ProjectileState.ACTIVE,
		unitsHit: [],
	});

	let projID = add(projData);
	start();
	return projID;
}

function add(projData: ProjectileData):number {
	let projID = nextID;

	currentIDs.push(projID);
	data[projID] = projData;

	nextID += 1;
	return projID;
}

function queueRemove(projID: number) {
	removeIDs.push(projID);
}

function remove() {
	removeIDs.forEach(element => {
		let particle: ParticleID | undefined = data[element].particleID;
		if (particle !== undefined) {
			ParticleManager.DestroyParticle(particle, false);
			ParticleManager.ReleaseParticleIndex(particle);
		}
		currentIDs = currentIDs.filter(obj => obj !== element);
		delete data[element];
	});
	removeIDs = [];
}

function hasID(id:number):boolean {
	return currentIDs.indexOf(id) > -1;
}

function start() {
	if (running == true) {
		return;
	} else {
		running = true;
		let gameMode:CDOTABaseGameMode = GameRules.GetGameModeEntity()
		gameMode.SetContextThink("OnThink", think, 1/tickSpeed);
	}
}

function think():number {
	if (GameRules.IsGamePaused()) return 1/tickSpeed;
	currentIDs.forEach(element => {
		let projData: ProjectileData = data[element];
		if (projData == undefined) {
			return;
		}

		// mark projectile as dead if it traveled far enough;
		if (projData.curDistance >= projData.distance) {
			projData.state = ProjectileState.DEAD;
		}
		if (Arena.IsOutside(projData.curLoc)) {
			projData.state = ProjectileState.DEAD;
		}

		let pathModifiers: ProjectilePathModifier[] | undefined = projData.pathModifier;
		let newState: ProjectileState = projData.state;
		if (pathModifiers !== undefined) {
			pathModifiers.forEach(element => {
				if (!element.isActive(projData.state)) {
					return;
				}
				let result: PathModifierResult = element.modifyVelocity(projData);
				projData.curDirection = result.newDirection;
				projData.curSpeed = result.newSpeed;
				if (result.hasOwnProperty("newState")) {
					newState = result.newState!;
				}
			});
		}

		let distance: number = projData.curSpeed * (1/tickSpeed);
		let newLoc: Vector = (projData.curLoc + projData.curDirection * distance) as Vector;

		if (projData.state == ProjectileState.DEAD) {
			queueRemove(element);
			projData.ability.OnProjectileHit(undefined, newLoc);
		} else {
			let caster: CDOTA_BaseNPC = projData.caster;
			let results: CDOTA_BaseNPC[] = FindUnitsInRadius(
				caster.GetTeamNumber(),
				newLoc,
				caster,
				projData.radius,
				projData.iUnitTargetTeam,
				projData.iUnitTargetType,
				projData.iUnitTargetFlags,
				FindOrder.CLOSEST,
				true,
			)
			results.forEach(element => {
				if (projData.unitsHit.indexOf(element.entindex()) == -1) {
					projData.ability.OnProjectileHit(element, undefined);
					projData.unitsHit.push(element.entindex());
				}
			});

			if ((results.length > 0) && projData.destroyOnHit) {
				newState = ProjectileState.DEAD;
			}

			let particle: ParticleID;
			if (projData.particleID == undefined) {
				particle = ParticleManager.CreateParticle(projData.trailEffect, ParticleAttachment.CUSTOMORIGIN, projData.caster);
				ParticleManager.SetParticleControl(particle, 0, projData.startLoc);
				projData.particleID = particle;
			} else {
				particle = projData.particleID!;
			}
			// ParticleManager.SetParticleControl(particle, 3, newLoc);
			ParticleManager.SetParticleControl(particle, 1, (projData.curDirection * projData.curSpeed) as Vector);
			if (projData.hasOwnProperty("visionRadius")) {
				AddFOWViewer(caster.GetTeamNumber(), newLoc, projData.visionRadius!, 2/tickSpeed, false);
			}
			projData.curLoc = newLoc;
			projData.curDistance += distance;
			projData.lifetime += 1/tickSpeed;
			projData.state = newState;

			data[element] = projData;
		}
	});
	remove();
	return 1/tickSpeed;
}



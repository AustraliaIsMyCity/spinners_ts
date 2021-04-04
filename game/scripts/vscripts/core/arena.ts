

export namespace Arena {

	let owner: CDOTA_BaseNPC;

	let corners: Vector[];
	let lengths: number[];
	let area: number;
	let shortestDist: number;
	let center: Vector;

	let koboldKing: CBaseEntity | undefined;
	let throneBack: CBaseEntity | undefined;
	let backOrigLoc: Vector;
	let backTick = 0;

	export function Init() {
		let corner1 = Entities.FindByName(undefined, "corner_1")!;
		let corner2 = Entities.FindByName(undefined, "corner_2")!;
		let corner3 = Entities.FindByName(undefined, "corner_3")!;
		let corner4 = Entities.FindByName(undefined, "corner_4")!;
		corners = [
			corner1.GetAbsOrigin(),
			corner2.GetAbsOrigin(),
			corner3.GetAbsOrigin(),
			corner4.GetAbsOrigin(),
		];
		lengths = [
			((corners[0] - corners[1]) as Vector).Length2D(),
			((corners[1] - corners[2]) as Vector).Length2D(),
			((corners[2] - corners[3]) as Vector).Length2D(),
			((corners[3] - corners[0]) as Vector).Length2D(),
		];
		area = lengths[0] * lengths[1];
		shortestDist = lengths[0] / 2;
		center = Vector(
			(corners[0].x + corners[2].x) / 2,
			(corners[0].y + corners[2].y) / 2,
			(corners[0].z + corners[2].z) / 2,
		);

		throneBack = Entities.FindByName(undefined, "Throne_Backplate");

		if (throneBack) {
			backOrigLoc = throneBack.GetAbsOrigin();
		}
		
		Timers.CreateTimer(() => BackAnim());
	}

	function BackAnim():number | undefined {
		if (!throneBack) {
			return 1/30;
		}
		let maxOffset = 20;
		let maxTime = 120;
		let offset = math.cos(backTick * math.pi * (1/maxTime)) * maxOffset;
		backTick = backTick == maxTime * 2 ? 0 : backTick + 1;
		throneBack.SetAbsOrigin((backOrigLoc + Vector(0,0,offset)) as Vector);

		return 1/30;
	}

	export function GetArenaOwner():CDOTA_BaseNPC {
		if (!owner) {
			let results: CDOTA_BaseNPC[] = FindUnitsInRadius(
				DotaTeam.GOODGUYS,
				center,
				undefined,
				3000,
				UnitTargetTeam.BOTH,
				UnitTargetType.HERO,
				UnitTargetFlags.NONE,
				FindOrder.CLOSEST,
				false,
			)
			owner = results[0];
		}
		return owner;
	}

	export function ShowBubble(location: Vector, text: string, duration: number) {
		let playerID = (GetArenaOwner() as CDOTA_BaseNPC_Hero).GetPlayerID();
		let player = PlayerResource.GetPlayer(playerID)!;
		CustomGameEventManager.Send_ServerToPlayer(player, "show_speech_bubble", {
			locX: location.x,
			locY: location.y,
			locZ: location.z,
			text: text,
			duration: duration,
		});
		// CustomGameEventManager.Send_ServerToPlayer(player, "confirm_movement", {});
	}

	export function MoveCameraToLocation(location: Vector) {
		let playerID = (GetArenaOwner() as CDOTA_BaseNPC_Hero).GetPlayerID();
		let player = PlayerResource.GetPlayer(playerID)!;
		CustomGameEventManager.Send_ServerToPlayer(player, "zoom_to_location", {
			locX: location.x,
			locY: location.y,
			locZ: location.z,
		});
	}

	export function GetKobold():CDOTA_BaseNPC {
		if (koboldKing) {
			return koboldKing as CDOTA_BaseNPC;
		}
		return Entities.FindByName(undefined, "Kobold_King")  as CDOTA_BaseNPC;
	}

	export function GetCenter(): Vector {
		return center;
	}

	export function GetWallIntersection(direction: Vector):Vector {
		
		return Vector(0,0,0);
	}

	export function IsOutside(loc: Vector):boolean {
		return !IsInside(loc);
	}

	export function IsInside(loc: Vector):boolean {
		let sum = GetArea(0, loc) + GetArea(1, loc) + GetArea(2, loc) + GetArea(3, loc);
		return ApproxInside(loc) || sum <= area * 1.01;
	}

	function ApproxInside(loc: Vector):boolean {
		let len = ((loc - center) as Vector).Length2D();
		return len <= shortestDist;
	}

	function GetArea(index: 0 | 1 | 2 | 3, loc: Vector):number {
		let index2 = index < 3 ? index + 1 : 0;
		let len1 = lengths[index];
		let len2 = ((corners[index] - loc) as Vector).Length2D();
		let len3 = ((corners[index2] - loc) as Vector).Length2D();
		let part = (len1 + len2 + len3) / 2;
		return Math.sqrt(part * (part - len1) * (part - len2) * (part - len3));
	}

	export function GetPossibleSpawnLocations(side: "left" | "right" | "top" | "bot" | "all", count: number):Vector[] {

		if (side == "all") {
			let perSide = Math.ceil(count / 4);
			let left = GetPossibleSpawnLocations("left", perSide);
			let top = GetPossibleSpawnLocations("top", perSide);
			let right = GetPossibleSpawnLocations("right", perSide);
			let bot = GetPossibleSpawnLocations("bot", perSide);
			return left.concat(top, right, bot);
		}

		let loc1: Vector = corners[3];
		let loc2: Vector;
		let len: number;
		switch (side) {
			case "left":
				loc1 = corners[3];
				loc2 = corners[0];
				len = lengths[3];
				break;
			case "right":
				loc1 = corners[1];
				loc2 = corners[2];
				len = lengths[1];
				break;
			case "top":
				loc1 = corners[0];
				loc2 = corners[1];
				len = lengths[0];
				break;
			case "bot":
				loc1 = corners[2];
				loc2 = corners[3];
				len = lengths[2];
				break;
		};
		let direction = -((loc1 - loc2) as Vector).Normalized();

		let step = len / count;
		let spawnLocs: Vector[] = [];
		for (let index = 0; index < count; index++) {
			let spawnLoc = loc1 + (direction * step * index) as Vector;
			let centerDir = ((center - spawnLoc) as Vector).Normalized();
			spawnLoc = (spawnLoc + centerDir * 100) as Vector;
			spawnLocs.push(spawnLoc);
		}
		return spawnLocs
	}
}
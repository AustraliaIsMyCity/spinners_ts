
export function GetRandomElement<T>(arr:T[]):T {
	return arr[RandomInt(0, arr.length - 1)];
}

export function GetRandomElements<T>(arr:T[], count: number):T[] {
	if (count <= 1) {
		return [arr[RandomInt(0, arr.length - 1)]];
	}
	if (count >= arr.length) {
		return arr;
	}
	let usedIndeces: number[] = [];
	let elements: T[] = [];
	do {
		let rnd = RandomInt(0, arr.length - 1);
		if (usedIndeces.indexOf(rnd) > -1) {
			continue;
		}
		elements.push(arr[rnd]);
		usedIndeces.push(rnd);
	} while (usedIndeces.length < count);
	return elements;
}

export function TableToArray<T>(table: {[key: string]: T}): T[] {
	let result: T[] = [];
	let i = 1;
    while (table[""+i]) {
        result.push(table[""+i]);
        i++;
	}
	// for (const value of Object.values(table)) {
	// 	result.push(value);
	// }
	return result;
}

// Vector Stuff

export function AngleCalculation(vectorA: Vector, vectorB: Vector):number {
	let dot = DotProduct(vectorA, vectorB);
	let angleOld = math.acos(dot);
	return 57.29577951 * angleOld;
}


// Rotate a 2D Vector clockwise by x degrees
export function RotateVector2D(direction: Vector, degree: number):Vector {
	let theta = DegToRad(degree);
	let xp: number = direction.x * Math.cos(theta) - direction.y * Math.sin(theta);
	let yp: number = direction.x * Math.sin(theta) + direction.y * Math.cos(theta);
	return Vector(xp, yp, direction.z).Normalized();
}

// Calculate the angle between two vectors as degrees (with sign as side indicator)
export function AngleCalculationWithSide(vectorA: Vector, vectorB: Vector):number {
	let a2 = Math.atan2(vectorA.y, vectorA.x);
	let a1 = Math.atan2(vectorB.y, vectorB.x);
	let sign = a1 > a2 ? 1 : -1;
	let angle = a1 - a2;
	let K = -sign * Math.PI * 2;
	angle = (Math.abs(K + angle) < Math.abs(angle))? K + angle : angle;
	return RadToDeg(angle);
}

// Return the side of a test point in reference to another direction (with start location)
export function GetVectorSide(direction: Vector, origin: Vector, point: Vector): 1 | 0 | -1 {
	let goal = (origin + direction * 1000) as Vector;
	let a = (goal.x - origin.x) * (point.y - origin.y) - (goal.y - origin.y) * (point.x - origin.x)
	return sign(a);
}

// Calculate the minimal distance to a line segment from a point (in 2D)
export function LineDistance(startLoc: Vector, endLoc: Vector, testLoc: Vector):number {
	let l2 = sqrDist(startLoc, endLoc);
	if (l2 == 0) return  sqrDist(startLoc, testLoc);
	let t = ((testLoc.x - startLoc.x) * (endLoc.x - startLoc.x) + (testLoc.y - startLoc.y) * (endLoc.y - startLoc.y)) / l2;
	t = Math.max(0, Math.min(1, t));
	return sqrDist(testLoc, Vector(
		startLoc.x + t * (endLoc.x - startLoc.x),
		startLoc.y + t * (endLoc.y - startLoc.y),
		0
	));
}

function sqrDist(vectorA: Vector, vectorB: Vector):number {
	return sqr(vectorA.x - vectorB.x) + sqr(vectorA.y - vectorB.y)
}

function sqr(x: number):number {
	return x * x;
}

function sign(x: number):1 | 0 | -1 {
	return x > 0 ? 1 : x < 0 ? -1 : 0;
}

export function DegToRad(deg: number):number {
	return deg * (Math.PI / 180);
}

export function RadToDeg(rad: number):number {
	return 360 * rad / (Math.PI * 2);
}
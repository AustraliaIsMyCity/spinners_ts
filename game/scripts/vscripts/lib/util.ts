
export function RotateVector2D(v: Vector, theta: number):Vector {
	theta = DegToRad(theta);
	let xp: number = v.x * Math.cos(theta) - v.y * Math.sin(theta);
	let yp: number = v.x * Math.sin(theta) + v.y * Math.cos(theta);
	return Vector(xp, yp, v.z).Normalized();
}

export function DegToRad(deg: number):number {
	return deg * (Math.PI/180);
}
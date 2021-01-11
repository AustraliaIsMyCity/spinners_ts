
function ZoomTo(position: Vector) {
	$.Msg("Move camera");
	GameUI.SetCameraTargetPosition(position, 1);
}

function PlayPerkEffect(startLoc: Vector, offset?: number) {
	const mainSelected = Players.GetLocalPlayerPortraitUnit();
	let particle = Particles.CreateParticle("particles/hud/new_perk/new_perk_projectile.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, mainSelected);
	
	var screenCoord = GameUI.WorldToScreenXYClamped(startLoc);

	Particles.SetParticleControl(particle, 2, [22, 92, 0]);
	Particles.SetParticleControl(particle, 5, ScreenCoordToOffset(screenCoord));
	Particles.SetParticleControl(particle, 6, [50, 0, 0]);
}

function ScreenCoordToOffset(screenCoord: Vector):Vector {
	let xPart = (screenCoord[0] - 0.5) * -200;
	let yPart = (screenCoord[1] - 0.5) * -200;
	return [xPart,yPart,0];
}

interface CustomGameEventDeclarations 
{
	zoom_to_location: {locX: number, locY: number, locZ: number};
	confirm_movement: {};
	play_perk_effect: {startX: number, startY: number, startZ: number, offset?: number};
}

GameEvents.Subscribe("zoom_to_location", event => {
	ZoomTo([event.locX, event.locY, event.locZ]);
});
GameEvents.Subscribe("play_perk_effect", event => {
	PlayPerkEffect([event.startX, event.startY, event.startZ], event.offset);
});
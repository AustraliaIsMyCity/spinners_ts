
var lastSelected = -1;

function InitPresets(index: number, name: string, weapons: PanoramaWeapon[]) {
	let preset = $("#WelcomePreset" + index);
	let presetContainer = preset.FindChildrenWithClassTraverse("WelcomePresetContainer")[0];
	weapons.forEach(weapon => {
		let weaponPanel = weapon.exportPanel(PanoramaWeaponPanelType.CENTER);
		weaponPanel.SetParent(presetContainer);
	});
	let presetTitle = preset.FindChildrenWithClassTraverse("WelcomePresetTitle")[0] as LabelPanel;
	presetTitle.text = $.Localize(name);
}

function SelectPreset(index: number) {
	let preset = $("#WelcomePreset" + index);
	preset.AddClass("Selected");
	if (lastSelected > 0 && lastSelected !== index) {
		let lastPreset = $("#WelcomePreset" + lastSelected);
		lastPreset.RemoveClass("Selected");
	}
	lastSelected = index;
	let confirm = $("#WelcomeConfirm");
	confirm.RemoveClass("Inactive");
}

function ConfirmPreset() {
	let confirm = $("#WelcomeConfirm");
	if (confirm.BHasClass("Inactive")) {
		return;
	}
	let mainPanel = $("#WelcomeMain").GetParent()!;
	mainPanel.RemoveClass("WelcomeVisible");
	$.Schedule(0.5, () => {
		mainPanel.AddClass("WelcomeHidden");
	});

	GameEvents.SendCustomGameEventToServer("select_preset", {presetID: lastSelected});
}

interface CustomGameEventDeclarations 
{
	load_preset: {presetID: number, presetName: string, weapons: {name: string, level: 0, icon: string, color: string, id: number}[]};
	select_preset: {presetID: number};
}

GameEvents.Subscribe("load_preset", event => {
	let mainPanel = $("#WelcomeMain").GetParent()!;
	mainPanel.AddClass("WelcomeVisible");
	mainPanel.RemoveClass("WelcomeHidden");
	let weapons: PanoramaWeapon[] = [];
	for (let [_, value] of Object.entries(event.weapons)) {
		let newWeapon = new PanoramaWeapon(value.name, value.level, value.icon, value.color, value.id);
		weapons.push(newWeapon);
	}
	InitPresets(event.presetID, event.presetName, weapons);
});
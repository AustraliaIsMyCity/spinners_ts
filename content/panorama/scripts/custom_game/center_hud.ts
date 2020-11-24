$.Msg("Center Hud loaded");

var weaponSlots: PanoramaWeaponSlot[] = [];

function ShowCenterHud(event: object) {
    let centerHud = $("#CenterHudBackground").GetParent();
    let open = centerHud?.GetAttributeInt("open", 0);
    if (open == 0) {
        centerHud?.AddClass("CenterHudOpen");
        centerHud?.SetAttributeInt("open", 1);
    } else {
        centerHud?.RemoveClass("CenterHudOpen");
        centerHud?.SetAttributeInt("open", 0);
    }
    let weaponList = $("#CenterSelectList");
    // weaponList.RemoveAndDeleteChildren();
}

function AddWeapon(weapon: PanoramaWeapon) {
    let weaponList = $("#CenterSelectList");
    // weaponList.RemoveAndDeleteChildren();
    let weaponPanel = weapon.exportPanel(PanoramaWeaponPanelType.CENTER);
    weaponPanel.SetParent(weaponList);
}

function RemoveWeapon(id: number) {
	let weaponList = $("#CenterSelectList");
	let children = weaponList.Children()
	children.forEach(element => {
		let thisID = element.GetAttributeInt("weaponID", -1);
		if (thisID ==  id) {
			element.DeleteAsync(0.01);
		}
	});
}

function InitSlots() {
    for (let index = 1; index <= 8; index++) {
        let slotPanel = $("#CenterSlot" + index);
        weaponSlots[index] = new PanoramaWeaponSlot(slotPanel, index);
    }
    let listPanel = $("#CenterSelectList");
    let weaponList = new PanoramaWeaponList(listPanel);
}

function RefreshHud() {
    $.Msg("Refresh Center Hud!")
    for (let index = 1; index <= 8; index++) {
        weaponSlots[index].panel.SetAttributeInt("registered", 0);
        weaponSlots[index].registerDragDropEvents();
    }
    let listPanel = $("#CenterSelectList");
    let weaponList = new PanoramaWeaponList(listPanel);
    weaponList.panel.SetAttributeInt("registered", 0);
    weaponList.registerDragDropEvents();
}

InitSlots();
GameEvents.Subscribe("show_center_hud", ShowCenterHud);
GameEvents.Subscribe("add_weapon", event => {
    if(event.originID && event.originID == "CenterSelectList") {
		return;
    }
    let newWeapon = new PanoramaWeapon(event.name, 0, event.icon, event.color, event.id);
    AddWeapon(newWeapon);
});
GameEvents.Subscribe("remove_weapon", event => {
	RemoveWeapon(event.id);
});
GameEvents.Subscribe("refresh_gui", RefreshHud);
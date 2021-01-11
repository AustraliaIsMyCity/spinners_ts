$.Msg("Center Hud loaded");

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
    weapon.registerQuickMoveCallback(CenterQuickMove);
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
        let weaponSlot = new PanoramaWeaponSlot(slotPanel, index);
        weaponSlot.setDropCallback(CenterWeaponDrop);
    }
    let listPanel = $("#CenterSelectList");
    let weaponList = new PanoramaWeaponList(listPanel);
    weaponList.setDropCallback(CenterWeaponDrop);
}

function CenterWeaponDrop(curPanel: Panel, weaponPanel: Panel) {
    if (weaponPanel.weaponRef) {
		weaponPanel.weaponRef.registerQuickMoveCallback(CenterQuickMove);
	}
}

function CenterQuickMove(curPanel: Panel, parentPanel: Panel) {
    let parentID = parentPanel.id;
    let listPanel = $("#CenterSelectList");
    let targetPanel = listPanel;
    if (parentID == "CenterSelectList") {
        let nextSlot = GetNextFreeSlot();
        if (!nextSlot) return;
        targetPanel = nextSlot;
    }
    if(curPanel.weaponRef && targetPanel.weaponBaseRef) {
        targetPanel.weaponBaseRef.simulateDrop(curPanel.weaponRef);
    }
}

function GetNextFreeSlot() {
    for (let index = 1; index <= 8; index++) {
        let slotPanel = $("#CenterSlot" + index);
        if (slotPanel.FindChildrenWithClassTraverse("WeaponPanel").length == 0) {
            return slotPanel;
        }
    }
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
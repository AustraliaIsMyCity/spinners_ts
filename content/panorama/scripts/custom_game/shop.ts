$.Msg("Shop GUI loaded!");

const hudRoot = $.GetContextPanel().GetParent()!.GetParent()!.GetParent()!;
hudRoot.FindChildTraverse("quickstats")!.style.visibility = "collapse";

const shop = hudRoot.FindChildTraverse("shop")!;
const main = shop.FindChildTraverse("Main")!;

main.style.height = "100%";
const limiter = main.FindChildTraverse("HeightLimiter")!;
limiter.style.height = "100%";
const limiterContainer = limiter.FindChildTraverse("HeightLimiterContainer")!;

shop.FindChildTraverse("CommonItems")!.style.visibility = "collapse";
shop.FindChildTraverse("ItemCombines")!.style.visibility = "collapse";

const gridMainShop = shop.FindChildTraverse("GridMainShop")!;
gridMainShop.FindChildTraverse("GridMainShopContents")!.style.visibility = "collapse";
gridMainShop.FindChildTraverse("RequestSuggestion")!.style.visibility = "collapse";
gridMainShop.FindChildTraverse("PopularItems")!.style.visibility = "collapse";
gridMainShop.FindChildTraverse("ToggleMinimalShop")!.style.visibility = "collapse";

const searchContainer = gridMainShop.FindChildTraverse("SearchContainer")!;
searchContainer.style.width = "100%";
searchContainer.style.marginTop = "10px";
searchContainer.style.marginLeft = "30px"

const gridMainTabs = gridMainShop.FindChildTraverse("GridMainTabs")!;
gridMainTabs.style.marginLeft = "20px";

(gridMainTabs.FindChild("GridBasicsTab")!.Children()[0] as LabelPanel).text = "Market";
(gridMainTabs.FindChild("GridUpgradesTab")!.Children()[0] as LabelPanel).text = "Anvil";
(gridMainTabs.FindChildTraverse("GridNeutralsTab")!.Children()[0] as LabelPanel).text = "Altar";

shop.FindChildTraverse("GuideFlyout")!.style.width = "0px";

function InitShop() {
	let gridHeight = gridMainShop.actuallayoutheight;

	if (gridHeight == 0) {
		$.Msg("Wait for shop!");
		$.Schedule(0.1, InitShop);
		return;
	}

	let borderContainer = limiter.FindChild("ShopBorderFrame");
	if (borderContainer == null) {
		$.Msg("New Borders!");
		let newContainer = $.CreatePanel("Panel", $.GetContextPanel(), "ShopBorderFrame");
		newContainer.BLoadLayoutSnippet("ShopBorders");
		newContainer.SetParent(limiter);
		borderContainer = newContainer;
	}

	let mainShop = limiterContainer.FindChild("MyMainShop");
	if (mainShop == null) {
		$.Msg("New Shop!");
		let newContainer = $.CreatePanel("Panel", $.GetContextPanel(), "MyMainShop");
		newContainer.BLoadLayoutSnippet("MainShop");
		newContainer.SetParent(limiterContainer);
		let gridHeight = gridMainShop.actuallayoutheight;
		newContainer.style.marginTop = gridHeight + "px";
		mainShop = newContainer;
		
		let botShop = limiterContainer.FindChildTraverse("BotShop")!;
		let weaponList = botShop.FindChild("ShopSelectList")!;
		let newList = new PanoramaWeaponList(weaponList);
	}

	let topShop = limiterContainer.FindChildTraverse("TopShop")!;

	let shopMarket = topShop.FindChild("ShopMarket");
	if (shopMarket == null) {
		$.Msg("New Market!")
		let newContainer = $.CreatePanel("Panel", $.GetContextPanel(), "ShopMarket");
		newContainer.BLoadLayoutSnippet("ShopMarket");
		newContainer.SetParent(topShop);
		shopMarket = newContainer;
	}

	let shopAnvil = topShop.FindChild("ShopAnvil");
	if (shopAnvil == null) {
		$.Msg("New Anvil!")
		let newContainer = $.CreatePanel("Panel", $.GetContextPanel(), "ShopAnvil");
		newContainer.BLoadLayoutSnippet("ShopAnvil");
		newContainer.SetParent(topShop);
		shopAnvil = newContainer;

		let upgradePanel = shopAnvil.FindChildTraverse("AnvilUpgradeSelect")!;
		new PanoramaWeaponSlot(upgradePanel);
		let recyclePanel = shopAnvil.FindChildTraverse("AnvilRecycleSelect")!;
		new PanoramaWeaponSlot(recyclePanel);
		recyclePanel.AddClass("Locked");
		let combinePanel = shopAnvil.FindChildTraverse("AnvilCombineSelect")!;
		new PanoramaWeaponSlot(combinePanel);
		combinePanel.AddClass("Locked");
		let combinePanel2 = shopAnvil.FindChildTraverse("AnvilCombineSelect2")!;
		new PanoramaWeaponSlot(combinePanel2);
		combinePanel2.AddClass("Locked");

		let anvilOutput = shopAnvil.FindChildTraverse("AnvilOutput")!;
		let outputFrame = anvilOutput.Children()[0];

		new PanoramaWeaponSlot(outputFrame);
		outputFrame.AddClass("Locked");
	}

	let anvilParticles = topShop.FindChild("ShopAnvilParticles");
	if (anvilParticles == null) {
		$.Msg("New Anvil Particles!")
		let newContainer = $.CreatePanel("Panel", $.GetContextPanel(), "ShopAnvilParticles");
		newContainer.BLoadLayoutSnippet("AnvilParticles");
		newContainer.SetParent(topShop);
		anvilParticles = newContainer;
	}
}

function CheckShopChange(panel: Panel | null) {
	if (panel == null) {
		return;
	}
	if (!(panel.id == "GridMainShop")) {
		return;
	}
	let topShop = limiterContainer.FindChildTraverse("TopShop");
	if (topShop == null) {
		return;
	}
	if (panel.BHasClass("ShowBasicItemsTab")) {
		topShop.RemoveClass("AnvilOpen");
		topShop.RemoveClass("AltarOpen");
		topShop.AddClass("MarketOpen");
	}
	if (panel.BHasClass("ShowUpgradeItemsTab")) {
		topShop.RemoveClass("MarketOpen");
		topShop.RemoveClass("AltarOpen");
		topShop.AddClass("AnvilOpen");
	}
	if (panel.BHasClass("ShowNeutralItemsTab")) {
		topShop.RemoveClass("MarketOpen");
		topShop.RemoveClass("AnvilOpen");
		topShop.AddClass("AltarOpen");
	}
}

function SelectAnvil(panelID: string) {
	let anvilTop = limiterContainer.FindChildTraverse("AnvilTop")!;
	let thisPanel = anvilTop.FindChildTraverse(panelID)!;

	if (thisPanel.BHasClass("AnvilSelectBottom")) {
		return;
	}
	if (thisPanel.BHasClass("AnvilRotateClockwise") || thisPanel.BHasClass("AnvilRotateCounterClockwise")) {
		return;
	}
	let direction = "AnvilRotateCounterClockwise";
	if (thisPanel.BHasClass("AnvilSelectRight")) {
		direction = "AnvilRotateClockwise";
	}
	let leftPanel = anvilTop.FindChildrenWithClassTraverse("AnvilSelectLeft")[0];
	let rightPanel = anvilTop.FindChildrenWithClassTraverse("AnvilSelectRight")[0];
	let bottomPanel = anvilTop.FindChildrenWithClassTraverse("AnvilSelectBottom")[0];
	let otherPanel = anvilTop.FindChild("AnvilCombineSelect2")!;

	if (bottomPanel.FindChildrenWithClassTraverse("WeaponPanel").length > 0 ||
	otherPanel.FindChildrenWithClassTraverse("WeaponPanel").length > 0) {
		bottomPanel.AddClass(direction + "Fake");
		$.Schedule(0.25, () => {
			bottomPanel.RemoveClass(direction + "Fake");
		});
		return;
	}
	
	leftPanel.AddClass(direction);
	rightPanel.AddClass(direction);
	bottomPanel.AddClass(direction);

	let anvilTitle = limiterContainer.FindChildTraverse("AnvilTitle")!;
	let curLabel = anvilTitle.FindChildrenWithClassTraverse("AnvilTitleShown")[0];
	let nextLabelID = GetNextTitle(curLabel.id, direction !== "AnvilRotateCounterClockwise");
	let nextLabel = anvilTitle.FindChild(nextLabelID)!;
	if (direction !== "AnvilRotateCounterClockwise") {
		curLabel.AddClass("AnvileModeLeftOut");
		nextLabel.AddClass("AnvileModeLeftIn");
	} else {
		curLabel.AddClass("AnvileModeRightOut");
		nextLabel.AddClass("AnvileModeRightIn");
	}

	if ((nextLabel as LabelPanel).text == "Combine") {
		otherPanel.AddClass("ShowAdditional");
		otherPanel.RemoveClass("HideAdditional");
		otherPanel.RemoveClass("Locked");
	} else {
		otherPanel.AddClass("HideAdditional");
		otherPanel.RemoveClass("ShowAdditional");
		otherPanel.AddClass("Locked");
	}

	bottomPanel.AddClass("Locked");
	leftPanel.AddClass("Locked");
	rightPanel.AddClass("Locked");

	$.Schedule(0.5, () => ChangeClasses(bottomPanel, leftPanel, rightPanel, direction !== "AnvilRotateCounterClockwise", curLabel, nextLabel));
}

function ChangeClasses(bot: Panel, left: Panel, right: Panel, clockwise: boolean, curLabel: Panel, nextLabel: Panel) {
	left.RemoveClass("AnvilRotateClockwise");
	left.RemoveClass("AnvilRotateCounterClockwise");
	right.RemoveClass("AnvilRotateClockwise");
	right.RemoveClass("AnvilRotateCounterClockwise");
	bot.RemoveClass("AnvilRotateClockwise");
	bot.RemoveClass("AnvilRotateCounterClockwise");

	left.RemoveClass("AnvilSelectLeft");
	right.RemoveClass("AnvilSelectRight");
	bot.RemoveClass("AnvilSelectBottom");

	if (!clockwise) {
		left.AddClass("AnvilSelectBottom");
		right.AddClass("AnvilSelectLeft");
		bot.AddClass("AnvilSelectRight");
		left.RemoveClass("Locked");
	} else {
		left.AddClass("AnvilSelectRight");
		right.AddClass("AnvilSelectBottom");
		bot.AddClass("AnvilSelectLeft");
		right.RemoveClass("Locked");
	}

	curLabel.RemoveClass("AnvileModeLeftOut");
	curLabel.RemoveClass("AnvileModeRightOut");
	nextLabel.RemoveClass("AnvileModeLeftIn");
	nextLabel.RemoveClass("AnvileModeRightIn");

	curLabel.RemoveClass("AnvilTitleShown");
	curLabel.AddClass("AnvilTitleHidden");
	nextLabel.RemoveClass("AnvilTitleHidden");
	nextLabel.AddClass("AnvilTitleShown");
}

function GetNextTitle(curID: string, direction: boolean):string {
	let titles = ["AnvilTitleUpgrade", "AnvilTitleRecyle", "AnvilTitleCombine"];
	let curIndex = titles.indexOf(curID);
	let nextIndex = curIndex;
	if (direction) {
		nextIndex -= 1;
	} else {
		nextIndex += 1;
	}
	if (nextIndex < 0) {
		nextIndex = 2;
	} else if (nextIndex > 2) {
		nextIndex = 0;
	}
	return titles[nextIndex];
}

function StartProgress() {
	let anvilTop = limiterContainer.FindChildTraverse("AnvilTop")!;
	let bottomPanel = anvilTop.FindChildrenWithClassTraverse("AnvilSelectBottom")[0];
	let otherPanel = anvilTop.FindChild("AnvilCombineSelect2")!;

	let anvilOutput = limiterContainer.FindChildTraverse("AnvilOutput")!;
	let outputFrame = anvilOutput.Children()[0];

	let childs = bottomPanel.FindChildrenWithClassTraverse("WeaponPanel");
	if (!(childs.length > 0)) {
		return;
	}
	if (outputFrame.FindChildrenWithClassTraverse("WeaponPanel").length > 0) {
		return;
	}
	let weaponPanel = childs[0];

	let anvilImage = limiterContainer.FindChildTraverse("AnvilImage")!;
	let anvilProgress = anvilImage.FindChild("AnvilProgress")!;
	anvilProgress.RemoveClass("Ending");
	anvilProgress.AddClass("Ongoing");

	bottomPanel.AddClass("Locked");

	let anvilParticles = limiterContainer.FindChildTraverse("ShopAnvilParticles")!;
	let anvilWork = anvilParticles.FindChild("AnvilWork")!;

	let newScene = $.CreatePanel("Panel", $.GetContextPanel(), "AnvilWorkScene");
	newScene.BLoadLayoutSnippet("Scene_AnvilWork");
	newScene.SetParent(anvilWork);
	newScene.DeleteAsync(1.5);

	$.Schedule(1, () => EndProgress(weaponPanel))
}

function EndProgress(newPanel: Panel) {
	let anvilTop = limiterContainer.FindChildTraverse("AnvilTop")!;
	let bottomPanel = anvilTop.FindChildrenWithClassTraverse("AnvilSelectBottom")[0];
	let otherPanel = anvilTop.FindChild("AnvilCombineSelect2")!;

	let anvilOutput = limiterContainer.FindChildTraverse("AnvilOutput")!;
	let outputFrame = anvilOutput.Children()[0];

	newPanel.SetParent(outputFrame);
	outputFrame.RemoveClass("Locked");

	bottomPanel.RemoveClass("Locked");

	let anvilParticles = limiterContainer.FindChildTraverse("ShopAnvilParticles")!;
	let anvilFinish = anvilParticles.FindChild("AnvilFinish")!;

	let newScene = $.CreatePanel("Panel", $.GetContextPanel(), "AnvilFinishScene");
	newScene.BLoadLayoutSnippet("Scene_AnvilFinish");
	newScene.SetParent(anvilFinish);
	newScene.DeleteAsync(1);

	$.Schedule(0.5, () => {
		let anvilImage = limiterContainer.FindChildTraverse("AnvilImage")!;
		let anvilProgress = anvilImage.FindChild("AnvilProgress")!;
		anvilProgress.RemoveClass("Ongoing");
		anvilProgress.AddClass("Ending");
	});
}

InitShop();
$.RegisterForUnhandledEvent("StyleClassesChanged", CheckShopChange)

function AddShopWeapon(weapon: PanoramaWeapon) {
	let botShop = limiterContainer.FindChildTraverse("BotShop")!;
    let weaponList = botShop.FindChild("ShopSelectList")!;
	// weaponList.RemoveAndDeleteChildren();
    let weaponPanel = weapon.exportPanel(PanoramaWeaponPanelType.CENTER);
    weaponPanel.SetParent(weaponList);
}

function RemoveShopWeapon(id: number) {
	let botShop = limiterContainer.FindChildTraverse("BotShop")!;
	let weaponList = botShop.FindChild("ShopSelectList")!;
	let children = weaponList.Children()
	children.forEach(element => {
		let thisID = element.GetAttributeInt("weaponID", -1);
		if (thisID ==  id) {
			element.DeleteAsync(0.01);
		}
	});
}

GameEvents.Subscribe("add_weapon", event => {
	if(event.originID && event.originID == "ShopSelectList") {
		return;
	}
	let newWeapon = new PanoramaWeapon(event.name, 0, event.icon, event.color, event.id);
    AddShopWeapon(newWeapon);
});
GameEvents.Subscribe("remove_weapon", event => {
	RemoveShopWeapon(event.id);
});
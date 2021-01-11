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

// shop.FindChildTraverse("GuideFlyout")!.style.width = "0px";
let guideFlyout = shop.FindChildTraverse("GuideFlyout")!;
guideFlyout.FindChild("GuideFlyoutContainer")!.style.visibility = "collapse";
guideFlyout.FindChild("ItemsArea")!.style.visibility = "collapse";

var upgradeAmountIndex = 0;
const upgradeAmount = [1, 2, 5, 10, -1];
const upgradeAmountName = ["x1", "x2", "x5", "x10", "MAX"];
var maxAmount = 0;
var actionCost = 0;

var curOpenTab: "Market" | "Anvil" | "Altar" = "Market";

function InitShop() {
	let gridHeight = gridMainShop.actuallayoutheight;

	if (gridHeight == 0) {
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
		newList.setDropCallback(AnvilWeaponDrop);

		GameEvents.SendCustomGameEventToServer("request_shop_weapon_sync", {});
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
		let upgradeWeaponPanel = new PanoramaWeaponSlot(upgradePanel);
		upgradeWeaponPanel.setDropCallback(AnvilWeaponDrop);
		upgradeWeaponPanel.setRemoveCallback(AnvilWeaponRemove);

		let recyclePanel = shopAnvil.FindChildTraverse("AnvilRecycleSelect")!;
		let recycleWeaponPanel = new PanoramaWeaponSlot(recyclePanel);
		recycleWeaponPanel.setDropCallback(AnvilWeaponDrop);
		recycleWeaponPanel.setRemoveCallback(AnvilWeaponRemove);
		recyclePanel.AddClass("Locked");

		let combinePanel = shopAnvil.FindChildTraverse("AnvilCombineSelect")!;
		let combineWeaponPanel = new PanoramaWeaponSlot(combinePanel);
		combineWeaponPanel.setDropCallback(AnvilWeaponDrop);
		combineWeaponPanel.setRemoveCallback(AnvilWeaponRemove);
		combinePanel.AddClass("Locked");

		let combinePanel2 = shopAnvil.FindChildTraverse("AnvilCombineSelect2")!;
		let combineWeaponPanel2 = new PanoramaWeaponSlot(combinePanel2);
		combineWeaponPanel2.setDropCallback(AnvilWeaponDrop);
		combinePanel2.AddClass("Locked");

		let anvilOutput = shopAnvil.FindChildTraverse("AnvilOutput")!;
		let outputFrame = anvilOutput.Children()[0];

		let outputFrameWeaponPanel = new PanoramaWeaponSlot(outputFrame);
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

	let quickUpgrade = guideFlyout.FindChild("QuickUpgrade");
	if (quickUpgrade == null) {
		$.Msg("New Quick Upgrade!");
		let newContainer = $.CreatePanel("Panel", $.GetContextPanel(), "QuickUpgrade");
		newContainer.BLoadLayoutSnippet("QuickUpgrade");
		newContainer.SetParent(guideFlyout);
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
		curOpenTab = "Market";
	}
	if (panel.BHasClass("ShowUpgradeItemsTab")) {
		topShop.RemoveClass("MarketOpen");
		topShop.RemoveClass("AltarOpen");
		topShop.AddClass("AnvilOpen");
		curOpenTab = "Anvil";
	}
	if (panel.BHasClass("ShowNeutralItemsTab")) {
		topShop.RemoveClass("MarketOpen");
		topShop.RemoveClass("AnvilOpen");
		topShop.AddClass("AltarOpen");
		curOpenTab = "Altar";
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
	let amountPanel = anvilTop.FindChild("AnvilAmountSelect")!;

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
 
	if ((nextLabel as LabelPanel).text == "Upgrade") {
		amountPanel.AddClass("ShowAdditional");
		amountPanel.RemoveClass("HideAdditional");
	} else {
		amountPanel.AddClass("HideAdditional");
		amountPanel.RemoveClass("ShowAdditional");
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

function SelectUpgradeAmount() {
	upgradeAmountIndex += 1;
	if (upgradeAmountIndex >= upgradeAmount.length) {
		upgradeAmountIndex = 0;
	}
	let anvilTop = limiterContainer.FindChildTraverse("AnvilTop")!;
	let amountPanel = anvilTop.FindChild("AnvilAmountSelect")! as LabelPanel;
	amountPanel.text = upgradeAmountName[upgradeAmountIndex];
	UpdateAnvilCostPrepare();
}

function UpdateAnvilCostPrepare() {
	let anvilTop = limiterContainer.FindChildTraverse("AnvilTop")!;
	let bottomPanel = anvilTop.FindChildrenWithClassTraverse("AnvilSelectBottom")[0];
	let childs = bottomPanel.FindChildrenWithClassTraverse("WeaponPanel");
	if (childs.length == 0) {
		return;
	}

	let weaponPanel = childs[0];
	let id = weaponPanel.GetAttributeInt("weaponID", -1);
	let costType = "Combine";
	if (bottomPanel.id == "AnvilUpgradeSelect") {
		costType = "Upgrade";
	} else if (bottomPanel.id == "AnvilRecycleSelect") {
		costType = "Recycle";
	}
	UpdateAnvilCost(id, costType);
}

function AnvilWeaponDrop(curPanel: Panel, weaponPanel: Panel) {
	if (["AnvilUpgradeSelect", "AnvilRecycleSelect", "AnvilCombineSelect", "AnvilCombineSelect2", "ShopSelectList"].indexOf(curPanel.id) < 0) {
		return;
	}
	if (weaponPanel.weaponRef) {
		weaponPanel.weaponRef.registerQuickMoveCallback(ShopQuickMove);
	}
	if (["AnvilUpgradeSelect", "AnvilRecycleSelect", "AnvilCombineSelect"].indexOf(curPanel.id) < 0) {
		return;
	}

	let id = weaponPanel.GetAttributeInt("weaponID", -1);
	let costType = "Combine";
	if (curPanel.id == "AnvilUpgradeSelect") {
		costType = "Upgrade";
	} else if (curPanel.id == "AnvilRecycleSelect") {
		costType = "Recycle";
	}
	UpdateAnvilCost(id, costType);
}

function UpdateAnvilCost(id: number, costType: string) {
	let table = CustomNetTables.GetTableValue("weapon_data", id);
	if (!table) {
		return;
	}
	let money = "";
	if (costType == "Upgrade") {
		let amount = upgradeAmount[upgradeAmountIndex];
		let cost = 0;
		if (amount > 0) {
			for (let index = table.level; index < (table.level + amount); index++) {
				cost += table.upgrade_cost[index + 1];
			}
		} else {
			let curGold = Players.GetGold(Players.GetLocalPlayer());
			let index = table.level;
			maxAmount = 0;
			while (index < Object.keys(table.upgrade_cost).length - 1 && cost + table.upgrade_cost[index + 1] < curGold) {
				index += 1;
				maxAmount += 1;
				cost += table.upgrade_cost[index + 1];
			}
		}
		money += cost;
		actionCost = cost;
	} else if (costType == "Recycle") {
		money += "+" + table.worth;
		actionCost = -table.worth;
	} else if (costType == "Combine") {
		
	}

	if(money !== "") {
		let anvilImage = limiterContainer.FindChildTraverse("AnvilImage")!;
		let anvilCost = anvilImage.FindChildTraverse("AnvilCost")!;
		anvilCost.AddClass("Shown");
		let anvilCostLabel = anvilCost.FindChild("AnvilCostLabel")! as LabelPanel;
		anvilCostLabel.text = money;
	}
}

function AnvilWeaponRemove(oldPanel: Panel) {
	if (["AnvilUpgradeSelect", "AnvilRecycleSelect", "AnvilCombineSelect"].indexOf(oldPanel.id) < 0) {
		return;
	}
	let anvilImage = limiterContainer.FindChildTraverse("AnvilImage")!;
	let anvilCost = anvilImage.FindChildTraverse("AnvilCost")! as LabelPanel;
	anvilCost.RemoveClass("Shown");
}

function StartProgress() {
	let anvilTop = limiterContainer.FindChildTraverse("AnvilTop")!;
	let bottomPanel = anvilTop.FindChildrenWithClassTraverse("AnvilSelectBottom")[0];
	let otherPanel = anvilTop.FindChild("AnvilCombineSelect2")!;

	let startType = "Combine";
	if (bottomPanel.id == "AnvilUpgradeSelect") {
		startType = "Upgrade";
	} else if (bottomPanel.id == "AnvilRecycleSelect") {
		startType = "Recycle";
	}

	let curGold = Players.GetGold(Players.GetLocalPlayer());
	if (startType !== "Upgrade") {
		return;
	} else {
		if ((actionCost == 0 && maxAmount == 0) || actionCost > curGold) {
			let anvilImage = limiterContainer.FindChildTraverse("AnvilImage")!;
			let anvilCost = anvilImage.FindChildTraverse("AnvilCost")!;
			anvilCost.AddClass("Fail");
			$.Schedule(0.1, () => {
				anvilCost.RemoveClass("Fail");
			});
			UpdateAnvilCostPrepare();
			return;
		} else {
			GameEvents.SendCustomGameEventToServer("spend_gold", {amount: actionCost});
		}
	}

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

	let id = newPanel.GetAttributeInt("weaponID", -1);
	// newPanel.SetParent(outputFrame);
	if (newPanel.weaponRef && outputFrame.weaponBaseRef) {
		outputFrame.weaponBaseRef.simulateDrop(newPanel.weaponRef);
	}

	outputFrame.RemoveClass("Locked");
	bottomPanel.RemoveClass("Locked");

	// let anvilImage = limiterContainer.FindChildTraverse("AnvilImage")!;
	// let anvilCost = anvilImage.FindChildTraverse("AnvilCost")! as LabelPanel;
	// anvilCost.RemoveClass("Shown");

	let anvilParticles = limiterContainer.FindChildTraverse("ShopAnvilParticles")!;
	let anvilFinish = anvilParticles.FindChild("AnvilFinish")!;

	let newScene = $.CreatePanel("Panel", $.GetContextPanel(), "AnvilFinishScene");
	newScene.BLoadLayoutSnippet("Scene_AnvilFinish");
	newScene.SetParent(anvilFinish);
	newScene.DeleteAsync(1);

	let amount = upgradeAmount[upgradeAmountIndex];
	if (upgradeAmountIndex == 4) {
		amount = maxAmount;
	}
	GameEvents.SendCustomGameEventToServer("weapon_upgrade", {id: id, amount: amount});

	$.Schedule(0.5, () => {
		let anvilImage = limiterContainer.FindChildTraverse("AnvilImage")!;
		let anvilProgress = anvilImage.FindChild("AnvilProgress")!;
		anvilProgress.RemoveClass("Ongoing");
		anvilProgress.AddClass("Ending");
	});
}

function GetOpenShopTab():"Market" | "Anvil" | "Altar" {
	return curOpenTab;
}

function ShopQuickMove(curPanel: Panel, parentPanel: Panel) {
	if (GetOpenShopTab() == "Anvil") {
		let parentID = parentPanel.id;
		let anvilTop = limiterContainer.FindChildTraverse("AnvilTop")!;
		let bottomPanel = anvilTop.FindChildrenWithClassTraverse("AnvilSelectBottom")[0];
		let targetPanel = bottomPanel;
		if (["AnvilUpgradeSelect", "AnvilRecycleSelect", "AnvilCombineSelect", "AnvilCombineSelect2"].indexOf(parentID) >= 0) {
			let botShop = limiterContainer.FindChildTraverse("BotShop")!;
			let weaponList = botShop.FindChild("ShopSelectList")!;
			targetPanel = weaponList;
		}
		if(curPanel.weaponRef && targetPanel.weaponBaseRef) {
			targetPanel.weaponBaseRef.simulateDrop(curPanel.weaponRef);
		}
	}
}

InitShop();
$.RegisterForUnhandledEvent("StyleClassesChanged", CheckShopChange)

function AddShopWeapon(weapon: PanoramaWeapon) {
	let botShop = limiterContainer.FindChildTraverse("BotShop");
	if (botShop == null) {return;}
    let weaponList = botShop.FindChild("ShopSelectList")!;
    let weaponPanel = weapon.exportPanel(PanoramaWeaponPanelType.CENTER);
	weaponPanel.SetParent(weaponList);
	weapon.registerQuickMoveCallback(ShopQuickMove);
}

function RemoveShopWeapon(id: number) {
	let botShop = limiterContainer.FindChildTraverse("BotShop")!;
	if (botShop == null) {return;}
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
GameEvents.Subscribe("weapon_upgrade", event => {
	RemoveShopWeapon(event.id);
});
GameEvents.Subscribe("add_weapon_shop_only", event => {
	let newWeapon = new PanoramaWeapon(event.name, 0, event.icon, event.color, event.id);
    AddShopWeapon(newWeapon);
});
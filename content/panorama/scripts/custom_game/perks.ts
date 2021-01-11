
function AddPerk(name: string, color: string) {
	let perkPanel = $("#PerkScreen");

	let newPerk = $.CreatePanel("Panel", $.GetContextPanel(), "");
	newPerk.AddClass("Perk");
	newPerk.SetParent(perkPanel);

	newPerk.SetPanelEvent("onmouseover", () => ShowPerkTooltip(newPerk, name));
	newPerk.SetPanelEvent("onmouseout", () => HidePerkTooltip(newPerk));
}

function ShowPerkTooltip(thisPanel: Panel, name: string) {
	let title = $.Localize("perk_" + name + "_name");
	let body = $.Localize("perk_" + name + "_description");
	$.DispatchEvent("DOTAShowTitleTextTooltip", thisPanel, title, body);
}

function HidePerkTooltip(thisPanel: Panel) {
	$.DispatchEvent("DOTAHideTitleTextTooltip", thisPanel);
}

interface CustomGameEventDeclarations 
{
	add_perk: {name: string, color: string};
}

GameEvents.Subscribe("add_perk", event => {
	AddPerk(event.name, event.color);
});
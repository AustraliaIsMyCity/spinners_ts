const hudBase = $.GetContextPanel().GetParent()!.GetParent()!.GetParent()!;
const tooltipManager = hudBase.FindChildTraverse('Tooltips');

var reset = true;
var resetSchedule: ScheduleID | undefined;

class PanoramaWeaponBase {

    panel: Panel;
    panelType: PanoramaWeaponPanelType = PanoramaWeaponPanelType.CENTER;
    dropCallback?: (curPanel: Panel, weaponPanel: Panel) => void;

    constructor() {
        this.panel = $("#CenterHudBackground");
    }

    registerDragDropEvents() {
        let registered = this.panel.GetAttributeInt("registered", 0);
        if (registered == 0) {
            $.RegisterEventHandler("DragEnter", this.panel, (targetPanel: Panel, displayPanel: WeaponDragPanel) => this.dragEnter(targetPanel, displayPanel));
            $.RegisterEventHandler("DragLeave", this.panel, (targetPanel: Panel, displayPanel: WeaponDragPanel) => this.dragLeave(targetPanel, displayPanel));
            $.RegisterEventHandler("DragDrop", this.panel, (targetPanel: Panel, displayPanel: WeaponDragPanel) => this.dragDrop(targetPanel, displayPanel));
            this.panel.SetAttributeInt("registered", 1);
        }
        this.panel.weaponBaseRef = this;
    }

    protected isValidDropTarget(targetPanel: Panel, displayPanel: WeaponDragPanel):boolean {
        return true;
    }

    protected dragEnter(targetPanel: Panel, displayPanel: WeaponDragPanel) {
        if (this.isValidDropTarget(targetPanel, displayPanel)) {
            this.panel.AddClass("PotentialDropTarget");
        }
    }

    protected dragLeave(targetPanel: Panel, displayPanel: Panel) {
        this.panel.RemoveClass("PotentialDropTarget");
    }

    public setDropCallback(callback: (curPanel: Panel, weaponPanel: Panel) => void) {
        this.dropCallback = callback;
    }

    public setRemoveCallback(callback: (oldPanel: Panel) => void) {
        this.panel.wRemoveCallback = callback;
    }

    public simulateDrop(weapon: PanoramaWeapon) {
        if (!(this instanceof PanoramaWeaponList) && this.panel.FindChildrenWithClassTraverse("WeaponPanel").length > 0) {
            return;
        }
        let thisID = this.panel.id;
        let slot = -1;
        if (thisID.indexOf("CenterSlot") >= 0) {
            slot = parseInt(thisID.substring(10));
        }
        let oldList: Panel | undefined;
        let parent = weapon.panel.GetParent()!;
        if (parent.GetAttributeInt("IsWeaponList", 0) > 0) {
            oldList = parent;
        }
        // $.Msg("Parent List:  ", parent.GetAttributeInt("IsWeaponList", 0) > 0)
        this.dropFinish(weapon);
        weapon.notifyWithoutDrag(slot, oldList);
    }

    protected dragDrop(targetPanel: Panel, displayPanel: WeaponDragPanel) {
        if (this.isValidDropTarget(targetPanel, displayPanel)) {
            let weapon = displayPanel.weapon;
            this.dropFinish(weapon);
        }
    }

    private dropFinish(weapon: PanoramaWeapon) {
        let child = weapon.exportPanel(this.panelType);
        let oldParent = child.GetParent()!;

        if (oldParent.BHasClass("WeaponFrame")) {
            oldParent.AddClass("Locked");
        }

        if (oldParent.wRemoveCallback) {
            oldParent.wRemoveCallback(oldParent);
        }

        child.SetParent(this.panel);

        if (this.dropCallback) {
            this.dropCallback(this.panel, child);
        }
    }
}

class PanoramaWeaponList extends PanoramaWeaponBase {

    constructor(panel: Panel) {
        super();
        this.panel = panel;
        this.registerDragDropEvents();

        this.panel.SetAttributeInt("IsWeaponList", 1);
    }

    protected isValidDropTarget(targetPanel: Panel, displayPanel: WeaponDragPanel):boolean {
        let dropID = displayPanel.weapon.id;
        let valid = true;
        this.panel.Children().forEach(element => {
            let thisID = element.GetAttributeInt("weaponID", -1);
            if (thisID ==  dropID) {
                valid = false;
            }
        });
        return valid;
    }
}

class PanoramaWeaponSlot extends PanoramaWeaponBase {
    index?: number;
    panelType = PanoramaWeaponPanelType.CENTER_BIG;
    overlay?: Panel;

    constructor(panel: Panel, index?: number) {
        super();
        this.index = index;
        this.panel = panel;
        this.registerDragDropEvents();

        let childs = this.panel.FindChildrenWithClassTraverse("CenterSlowOverlay");
    }

    public setPanelType(panelType: PanoramaWeaponPanelType) {
        this.panelType = panelType;
    }

    protected isValidDropTarget(targetPanel: Panel, displayPanel: WeaponDragPanel):boolean {
        if (this.panel.BHasClass("Locked")) {
            return false;
        }
        if (this.panel.FindChildrenWithClassTraverse("WeaponPanel").length > 0) {
            return false;
        }
        return true;
    }
}

class PanoramaWeapon {

    id: number;
    name: string;
    level: number;
    icon: string;
    panel: Panel;
    color: string;
    dragging: boolean = false;

    quickMoveCallback?: (curPanel: Panel, parentPanel: Panel) => void;

	constructor(name: string, level: number, icon: string, color: string, id: number) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.icon = icon;
        this.color = color;
        this.panel = $.CreatePanel("Button", $.GetContextPanel(), this.name);
        this.panel.BLoadLayoutSnippet("WeaponPanel");
        this.panel.AddClass("NewWeapon");
        let image = this.panel.Children()[0] as ImagePanel;
        image.SetImage("file://{images}/custom_game/" + this.icon);

        this.panel.SetAttributeInt("weaponID", this.id);
        this.panel.weaponRef = this;

        this.registerDragDropEvents();
	}

	exportPanel(type: PanoramaWeaponPanelType):Panel {
        if (type == PanoramaWeaponPanelType.CENTER_BIG) {
            this.panel.AddClass("WeaponPanelBig");
        } else {
            this.panel.RemoveClass("WeaponPanelBig");
        }
        this.panel.style.position = "0px 0px 0px";
        return this.panel;
    }
    
    private registerDragDropEvents() {
        $.RegisterEventHandler("DragStart", this.panel, (draggedPanel: Panel, event: DragStartEvent) => {this.dragStart(draggedPanel, event, this)});
        // $.RegisterEventHandler("DragEnter", this.panel, (targetPanel: Panel, displayPanel: Panel) => this.dragEnter(targetPanel, displayPanel));
        // $.RegisterEventHandler("DragLeave", this.panel, (targetPanel: Panel, displayPanel: Panel) => this.dragLeave(targetPanel, displayPanel));
        $.RegisterEventHandler("DragEnd", this.panel, (targetPanel: Panel, displayPanel: WeaponDragPanel) => this.dragEnd(targetPanel, displayPanel));

        this.panel.SetPanelEvent("onmouseover", () => this.showTooltip());
        this.panel.SetPanelEvent("onmouseout", () => this.hideTooltip());
        this.panel.SetPanelEvent("onactivate", () => this.quickMove());
    }

    private dragStart(draggedPanel: Panel, event: DragStartEvent, weapon: PanoramaWeapon) {
        this.hideTooltip();

        if (this.panel.BAscendantHasClass("Locked")) {
            return;
        }

        this.dragging = true;

        let dragPanel = $.CreatePanel("Panel", $.GetContextPanel(), "DragWeapon");
        dragPanel.BLoadLayoutSnippet("WeaponPanel");
        dragPanel.AddClass("NewWeapon");
        dragPanel.AddClass("WeaponDropPanel");
        dragPanel.style.backgroundImage = "url('file://{images}/custom_game/" + this.icon + "')";

        let parentID = this.panel.GetParent()!.id;
        let slot = -1;
        if (parentID.indexOf("CenterSlot") >= 0) {
            slot = parseInt(parentID.substring(10));
        }

        let displayPanel:WeaponDragPanel = Object.assign(dragPanel, {weapon: this, oldSlot: slot});

        let parent = this.panel.GetParent()!;
        if (parent.GetAttributeInt("IsWeaponList", 0) > 0) {
            displayPanel = Object.assign(displayPanel, {oldList: parent});
        }

        event.displayPanel = displayPanel;
        event.offsetX = 0;
        event.offsetY = 0;

        this.panel.AddClass("DraggedWeapon");
    }

    private dragEnd(targetPanel: Panel, displayPanel: WeaponDragPanel) {
        if (this.dragging && targetPanel) {
            this.panel.RemoveClass("DraggedWeapon");
            this.notifyServer(displayPanel.oldSlot, displayPanel.oldList);
    
            displayPanel.DeleteAsync(0);
            this.dragging = false;
        }
    }

    private showTooltip() {
        ResetWeaponTooltip(false);
        GetWeaponTooltip(this.panel, this.name, this.id);
        if (resetSchedule !== undefined) {
            $.CancelScheduled(resetSchedule);
            resetSchedule = undefined;
        }
    }

    private hideTooltip() {
        $.DispatchEvent("DOTAHideTextTooltip", this.panel);
        resetSchedule = $.Schedule(1/2, () => ResetWeaponTooltip(true));
    }

    private quickMove() {
        if (!GameUI.IsShiftDown()) return;
        if (this.quickMoveCallback) {
            this.quickMoveCallback(this.panel, this.panel.GetParent()!);
        }
    }

    public registerQuickMoveCallback(callback: (curPanel: Panel, parentPanel: Panel) => void) {
        this.quickMoveCallback = callback;
    }

    public notifyWithoutDrag(oldSlot: number, oldList?: Panel) {
        this.notifyServer(oldSlot, oldList);
    }

    private notifyServer(oldSlot: number, oldList?: Panel) {
        let parent = this.panel.GetParent()!
        let parentID = parent.id;
        let newSlot = -1;
        if ((parentID !== "CenterSelectList") && (parentID.indexOf("CenterSlot") >= 0)) {
            newSlot = parseInt(parentID.substring(10));
        }

        if (!(oldList == parent)) {
            if (oldList !== undefined) {
                GameEvents.SendCustomGameEventToServer("weapon_inventory_change", {removed: 1, id: this.id, originID: oldList.id});
            }
    
            if (parent.GetAttributeInt("IsWeaponList", 0) > 0) {
                GameEvents.SendCustomGameEventToServer("weapon_inventory_change", {removed: 0, id: this.id, originID: parentID});
            }
        }

        if (oldSlot !== newSlot) {
            GameEvents.SendCustomGameEventToServer("weapon_change", {oldSlot: oldSlot, newSlot: newSlot, id: this.id});
        }
    }
}

function GetWeaponTooltip(displayPanel: Panel, name:string, id:number) {
    let table = CustomNetTables.GetTableValue("weapon_data", id);

    // let title = $.Localize(table.raw_name + "_name");
    let body = $.Localize(table.raw_name + "_description");
    $.DispatchEvent("DOTAShowTextTooltip", displayPanel, body);

    let tooltipContent = tooltipManager!.FindChild("TextTooltip")!.FindChildTraverse("Contents")!;

    let tooltipWeaponTitle = $.CreatePanel("Panel", $.GetContextPanel(), "WeaponTitle");
    tooltipWeaponTitle.AddClass("TooltipWeaponTitle");
    tooltipWeaponTitle.SetParent(tooltipContent);

    let tooltipWeaponTitleText = $.CreatePanel("Label", $.GetContextPanel(), "WeaponTitleText");
    tooltipWeaponTitleText.AddClass("TooltipWeaponTitleText");
    tooltipWeaponTitleText.SetParent(tooltipWeaponTitle);
    tooltipWeaponTitleText.text = $.Localize(table.raw_name + "_name");

    let tooltipWeaponTitleLevel = $.CreatePanel("Label", $.GetContextPanel(), "WeaponTitleLevel");
    tooltipWeaponTitleLevel.AddClass("TooltipWeaponTitleLevel");
    tooltipWeaponTitleLevel.SetParent(tooltipWeaponTitle);
    tooltipWeaponTitleLevel.text = "Level: " + table.level;

    let tooltipDescription = tooltipContent.FindChild("TextLabel")!;
    tooltipDescription.style.color = "#bbbbbb";
    tooltipContent.MoveChildAfter(tooltipDescription, tooltipWeaponTitle);

    let tooltipWeaponInfo = $.CreatePanel("Panel", $.GetContextPanel(), "WeaponInfo");
    tooltipWeaponInfo.AddClass("TooltipWeaponInfo");
    tooltipWeaponInfo.SetParent(tooltipContent);

    let tooltipWeaponInfoElement = $.CreatePanel("Label", $.GetContextPanel(), "WeaponInfoElement");
    tooltipWeaponInfoElement.AddClass("TooltipWeaponInfoElement");
    tooltipWeaponInfoElement.SetParent(tooltipWeaponInfo);
    tooltipWeaponInfoElement.html = true;
    tooltipWeaponInfoElement.text = GetElementName(table.element);

    tooltipContent.MoveChildAfter(tooltipDescription, tooltipWeaponInfo);

    let tooltipWeaponContent = $.CreatePanel("Panel", $.GetContextPanel(), "WeaponContent");
    tooltipWeaponContent.AddClass("TooltipWeaponContent");
    tooltipWeaponContent.SetParent(tooltipContent);

    let tooltipWeaponValues = $.CreatePanel("Label", $.GetContextPanel(), "WeaponValues");
    tooltipWeaponValues.AddClass("TooltipWeaponValues");
    tooltipWeaponValues.SetParent(tooltipWeaponContent);
    tooltipWeaponValues.html = true;
    let finalText:string[] = [];
    for (let value of Object.values(table.values)) {
        let curVal = ShortenNumber(value.cur_val);
        let nextVal = ShortenNumber(value.next_val);
        let text = value.name.toUpperCase().split("_").join(" ") + ":   " + MarkText(curVal) + UnmarkText(" / " + nextVal);
        finalText.push(text);
    }
    tooltipWeaponValues.text = finalText.join("<br>");
}

function MarkText(text: string | number): string {
    return "<font color='#ffffff'><b>" + text + "</b></font>"
}

function UnmarkText(text: string | number): string {
    return "<font color='#4b535e'><b>" + text + "</b></font>"
}

function ShortenNumber(num: number) {
    let text = num.toString(10);
    if (text.indexOf(".") < 0) {
        return text;
    }
    text =  parseFloat(text).toFixed(2);
    let lastChar = "";
	do {
	  lastChar = text.substring(text.length - 1, text.length);
	  if (lastChar == "0" || lastChar == ".") {
		text = text.substring(0, text.length - 1);
	  }
    } while (lastChar == "0");
    return text;
}

function GetElementName(element: WeaponElement):string {
    return "<font color='" + GetElementColor(element) + "'>" + WeaponElement[element] + "</font>";
}

function GetElementColor(element: WeaponElement):string {
    switch (element) {
        case WeaponElement.FIRE:
            return "rgb(178, 34, 34)"
        case WeaponElement.EARTH:
            return "rgb(139, 69, 19)"
        case WeaponElement.ELECTRICITY:
            return "rgb(106, 90, 205)"
        case WeaponElement.FROST:
            return "rgb(0, 206, 209)"
        case WeaponElement.WIND:
            return "rgb(127, 255, 0)"
        case WeaponElement.WATER:
            return "rgb(30, 144, 255)"
        case WeaponElement.CHAOS:
            return "rgb(0, 0, 0)"
        case WeaponElement.ORDER:
            return "rgb(245, 222, 179)"

    }
    return "#596e89";
}

function ResetWeaponTooltip(scheduled: boolean) {
    if (scheduled) {
        resetSchedule = undefined;
    }
    let textTooltip = tooltipManager!.FindChild("TextTooltip");
    if (!textTooltip) {
        return;
    }
    if (textTooltip.BHasClass("TooltipVisible")) {
        return;
    }
    let tooltipContent = tooltipManager!.FindChild("TextTooltip")!.FindChildTraverse("Contents")!;
    let childs = tooltipContent.Children();
    childs.forEach(element => {
        if (element.id == "WeaponContent" || element.id == "WeaponInfo" ||element.id == "WeaponTitle") {
            element.DeleteAsync(0);
        }
    });
    let tooltipDescription = tooltipContent.FindChild("TextLabel")!;
    tooltipDescription.style.color = "white";
}

interface Panel {
    weaponBaseRef?: PanoramaWeaponBase;
    weaponRef?: PanoramaWeapon;
    wRemoveCallback?: (oldPanel: Panel) => void;
}

enum PanoramaWeaponPanelType {
	CENTER = 0,
    CENTER_BIG = 1,
    SHOP_BIG = 2,
}

interface CustomGameEventDeclarations 
{
    show_center_hud: {};
    add_weapon: {name: string, icon: string, color: string, id: number, originID?: string};
    remove_weapon: {id: number};
    refresh_gui: {};
    weapon_change: {oldSlot: number, newSlot: number, id: number};
    weapon_inventory_change: {removed: 0 | 1, id: number, originID: string};
    weapon_upgrade: {id: number, amount: number};
    spend_gold: {amount: number};
    request_shop_weapon_sync: {};
	add_weapon_shop_only: {name: string, icon: string, color: string, id: number};
}

interface CustomNetTableDeclarations {
	weapon_data: {
		[weapon_id: number]: {
			raw_name: string;
			name: string;
			level: number;
			element: WeaponElement;
			upgrade_cost: number[],
			worth: number,
			values: CurrentWeaponValue[];
		};
	};
}

enum WeaponElement {
    NONE = 0,
    FIRE = 1,
    FROST = 2,
    WIND = 4,
    EARTH = 8,
    ELECTRICITY = 16,
    WATER = 32,
    CHAOS = 64,
    ORDER = 128,
}

interface CurrentWeaponValue {
	name: string;
	cur_val: number;
	next_val: number;
}

interface DragStartEvent {
    removePositionBeforeDrop: boolean;
    offsetY: number;
    offsetX: number;
    displayPanel: Panel | null;
}

interface WeaponDragPanel extends Panel {
    weapon: PanoramaWeapon;
    oldSlot: number;
    oldList?: Panel;
}
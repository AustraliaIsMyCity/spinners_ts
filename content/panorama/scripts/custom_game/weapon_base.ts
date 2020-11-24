class PanoramaWeaponBase {

    panel: Panel;
    panelType: PanoramaWeaponPanelType = PanoramaWeaponPanelType.CENTER;

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

    protected dragDrop(targetPanel: Panel, displayPanel: WeaponDragPanel) {
        if (this.isValidDropTarget(targetPanel, displayPanel)) {
            let weapon = displayPanel.weapon;
            let child = weapon.exportPanel(this.panelType);
            let oldParent = child.GetParent()!;

            if (oldParent.BHasClass("WeaponFrame")) {
                oldParent.AddClass("Locked");
            }

            child.SetParent(this.panel);
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

	constructor(name: string, level: number, icon: string, color: string, id: number) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.icon = icon;
        this.color = color;
        this.panel = $.CreatePanel("Panel", $.GetContextPanel(), this.name);
        this.panel.BLoadLayoutSnippet("WeaponPanel");
        this.panel.AddClass("NewWeapon");
        let image = this.panel.Children()[0] as ImagePanel;
        image.SetImage("file://{images}/custom_game/" + this.icon);

        this.panel.SetAttributeInt("weaponID", this.id);

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
        if ((parentID !== "CenterSelectList") && (parentID.indexOf("CenterSlot") >= 0)) {
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
            this.notifyServer(displayPanel);
    
            displayPanel.DeleteAsync(0);
            this.dragging = false;
        }
    }

    private showTooltip() {
        $.DispatchEvent("DOTAShowTitleTextTooltip", this.panel, "Tooltip", "This is a custom tooltip...");
    }

    private hideTooltip() {
        $.DispatchEvent("DOTAHideTitleTextTooltip", this.panel);
    }

    private notifyServer(displayPanel: WeaponDragPanel) {
        let oldSlot = displayPanel.oldSlot;

        let parent = this.panel.GetParent()!
        let parentID = parent.id;
        let newSlot = -1;
        if ((parentID !== "CenterSelectList") && (parentID.indexOf("CenterSlot") >= 0)) {
            newSlot = parseInt(parentID.substring(10));
        }

        if (!(displayPanel.oldList == parent)) {
            if (displayPanel.oldList) {
                let oldList = displayPanel.oldList;
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
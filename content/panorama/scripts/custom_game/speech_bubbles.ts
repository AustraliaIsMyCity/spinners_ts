
var lastBubble: Panel | null;
var lastLabel: LabelPanel | null;
var curLoc: Vector;
var xOffset: number;
var yOffset: number;
var maxDuration: number;
var timeDelta: number;
var curTick: number;
var curIndex: number;
var fullText: string;
var tickCount: number = 0.03;
var slow = false;

var time = 0;

function ShowBubble(location: Vector, text: string, duration: number) {
	let firstChar = text.substr(0, 1);
	if (firstChar == "#") {
		let newText = $.Localize(text);
		if (newText.length == 0) {
			$.Msg("localize not working! :/")
		} else {
			text = newText;
		}
	}

	maxDuration = duration;

	curLoc = location;
	MeasureText(text, ShowBubbleFinish);
}

function ShowBubbleFinish(text:string, height:number, width:number) {
	if (lastBubble) {
		lastBubble!.RemoveClass("BubblesMainActive");
		lastBubble!.DeleteAsync(0.2);
		lastBubble = null;
		lastLabel = null;
	}

	xOffset = width + 30;
	yOffset = height + 30 + 20;

	let newPanel = $.CreatePanel("Panel", $.GetContextPanel(), "speech_bubble");
	newPanel.BLoadLayoutSnippet("SpeechBubble");
	newPanel.AddClass("BubblesMainActive");
	newPanel.style.width = xOffset + "px";
	newPanel.style.height = yOffset + "px";
	let label = newPanel.FindChildTraverse("BubblesText") as LabelPanel;
	let body = newPanel.FindChildrenWithClassTraverse("BubblesBody")[0];
	body.style.height = (yOffset - 20) + "px";

	label.html = true;
	label.text = "";
	lastLabel = label;

	var screenCoord = GameUI.WorldToScreenXYClamped(curLoc);
	newPanel.style.position = (toAbs(screenCoord[0], false) - xOffset) + "px " + (toAbs(screenCoord[1], true) - yOffset) + "px 0px";

	lastBubble = newPanel;

	curTick = 0;
	curIndex = 0;
	fullText = text;
	timeDelta = 0;

	KeepPosition()
	UpdateText()
	// $.Schedule(Game.GetGameFrameTime(), KeepPosition);
}

function KeepPosition() {
	timeDelta += Game.GetGameFrameTime();
	if (timeDelta >= maxDuration) {
		if (lastBubble) {
			lastBubble!.RemoveClass("BubblesMainActive");
			lastBubble!.DeleteAsync(0.2);
			lastBubble = null;
			lastLabel = null;
		}
		return;
	}

	var screenCoord = GameUI.WorldToScreenXYClamped(curLoc);
	lastBubble!.style.position = (toAbs(screenCoord[0], false) - xOffset) + "px " + (toAbs(screenCoord[1], true) - yOffset) + "px 0px";
	
	$.Schedule(Game.GetGameFrameTime(), KeepPosition);
}

function UpdateText() {

	if (!lastLabel) {
		return;
	}

	let curTime = Game.GetGameTime();
	let diff = curTime - time;
	diff = diff > 3? 0 : diff;
	time = curTime;

	// $.Msg(diff);

	curTick += diff;
	if (curTick >= tickCount) {
		curIndex += 1;
		curTick -= tickCount;
	} else {
		$.Schedule(1/60, UpdateText);
		return;
	}
	tickCount = slow? 0.15 : 0.05;
	let curChar = fullText.substring(curIndex, curIndex + 1);
	if (curChar == "<") {
		let testIndex = curIndex + 1;
		let htmlText = "";
		while (curChar !== ">") {
			curChar = fullText.substring(testIndex, testIndex + 1);
			testIndex += 1;
			htmlText += curChar == ">" ? "" : curChar;
		}
		if (htmlText == "br") {

		} else if (htmlText == "wait") {
			tickCount = 0.5;
		} else if (htmlText == "slow") {
			slow = true;
			tickCount = 0.15;
		} else if (htmlText == "/slow") {
			slow = false;
		} else {
			curIndex += htmlText.length + 1;
		}
	}

	let text = fullText.substring(0,curIndex);
	lastLabel.text = text;

	if (curIndex == fullText.length) {
		return;
	}
	$.Schedule(1/60, UpdateText);
}

function MeasureText(text: string, callback: (text:string, height:number, width:number) => void) {
	let testPanel = $.CreatePanel("Label", $.GetContextPanel(), "TestPanel") as LabelPanel;
	testPanel.style.fontFamily = "Radiance Black";
	testPanel.style.color = "rgba(0,0,0,0)";
	testPanel.html = true;
	testPanel.text = text;
	$.Schedule(1/20, () => {
		let height = testPanel.contentheight;
		let width = testPanel.actuallayoutwidth;
		testPanel.DeleteAsync(0);
		callback(text, height, width);
	});
}

interface CustomGameEventDeclarations 
{
	show_speech_bubble: {locX: number, locY: number, locZ: number, text: string, duration: number};
}

GameEvents.Subscribe("show_speech_bubble", event => {
	ShowBubble([event.locX, event.locY, event.locZ], event.text, event.duration);
});

function toAbs(percent: number, height: boolean): number {
	if (height) {
		return Game.GetScreenHeight() * percent;
	}
	return Game.GetScreenWidth() * percent;
}
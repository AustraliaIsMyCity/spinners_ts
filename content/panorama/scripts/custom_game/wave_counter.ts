

function NextWave() {
	let nextButton =$("#NextWave");
	nextButton.AddClass("NextButtonHidden");

	IncreaseWaveCount();

	let progress = $("#WaveCounterProgressBar");
	progress.style.width = "0%";

	$.Schedule(0.5, () => {
		GameEvents.SendCustomGameEventToServer("next_wave", {});
	});
}

function IncreaseWaveCount() {
	let waveLabel = $("#WaveCounterLabel") as LabelPanel;
	let curWave = waveLabel.GetAttributeInt("curWave", 0);
	let waveAnim = $("#WaveCounterLabelAnim");
	let waveAnimLabel = $("#WaveCounterAnimLabel") as LabelPanel;
	let nextLabel = $("#NextWaveLabel") as LabelPanel;

	nextLabel.text = "Next Wave";

	waveAnimLabel.text = "" + (curWave + 1);
	waveAnim.AddClass("Activated");

	$.Schedule(0.4, () => {
		waveAnim.RemoveClass("Activated");
		waveLabel.text = "Wave " + (curWave + 1);
	});

	waveLabel.SetAttributeInt("curWave", curWave + 1);
}

interface CustomGameEventDeclarations 
{
	wave_complete: {};
	next_wave: {};
	update_wave_progress: {percentage: number};
}

GameEvents.Subscribe("wave_complete", event => {
	let nextButton =$("#NextWave");
	nextButton.RemoveClass("NextButtonHidden");
});

GameEvents.Subscribe("update_wave_progress", event => {
	let progress = $("#WaveCounterProgressBar");
	progress.style.width = (event.percentage * 100) + "%";
});
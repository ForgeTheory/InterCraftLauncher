const fs = require('fs');
const jetpack = require('fs-jetpack');

const minecraft = require('../minecraft/minecraft');

const Window = require('./window').Window;

class ControlPanel extends Window {
	constructor() {
		super({
			width: 1280,
			height: 720,
			frame: true,
			minWidth: 992,
			minHeight: 500
		});

		this.setName('control_panel');
		this.setView('control_panel');

		this.listen('control_panel_done', (payload) => { this.preInitFinished(payload); });
		this.listen('control_panel_launch_minecraft', (payload) => { this.launchMinecraft(payload); });
		this.listen('view_load', (payload) => { this.loadView(payload); });
	}

	preInitFinished(payload) {
		this.showWhenReady();
	}

	launchMinecraft(payload) {
		var account = minecraft.profileManager().activeAccount();
		var profile = minecraft.profileManager().profile(payload.profile);
		minecraft.launcher().launch(profile, account, (result) => {});
	}

	loadView(payload) {
		console.log(jetpack.cwd('./app/views').path(payload.view + '.htm'));
		fs.readFile(jetpack.cwd('./app/views').path(payload.view + '.htm'), 'utf8', (err, contents) => {
			if (err)
				console.log("ERROR: Failed to load view:", payload.view);
			payload.html = contents;
			console.log("Sending view...");
			this.send('view_result', payload);
		});
	}
}

exports.ControlPanel = ControlPanel;
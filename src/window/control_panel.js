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
	}
}

exports.ControlPanel = ControlPanel;
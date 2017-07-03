const Window = require('./window').Window;

class Splash extends Window {
	constructor() {
		super({
			width: 341,
			height: 421,
			frame: false,
			transparent: true,
			resizable: false,
			movable: false,
			minimizable: false
		});
		
		this.setName('splash');
		this.setView('splash');
	}
}

exports.Splash = Splash;
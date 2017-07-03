const Window = require('./window').Window;

class Login extends Window {
	constructor() {
		super({
			width: 420,
			height: 480,
			frame: true,
			resizable: false
		});

		this.setName('login');
		this.setView('login');
	}
}

exports.Login = Login;
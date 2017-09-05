const intercraft = require('../intercraft');
const intercraftAuth = require('../intercraft_auth');

const {Window} = require('./window');

class Login extends Window {
	constructor() {
		super({
			width: 400,
			height: 460,
			frame: true,
			resizable: false
		});

		this.setName('login');
		this.setView('login');

		// Listen for events
		this.listen('login', (payload) => { this.onSubmit(payload); });
	}

	/**
	 * Execute when the login form has been submitted
	 * @param  {Json Object} payload
	 * @return {Undefined}
	 */
	onSubmit(payload) {
		intercraftAuth.login(payload.email, payload.password, payload.remember, (result) => {
			this.onLogin(result);
		});
	}

	/**
	 * Execute when a login attempt has finished
	 * @param  {Json Object} result
	 * @return {Undefined}
	 */
	onLogin(result) {
		this.send('login_result', {"errorCode": result.errorCode});
		if (result.isValid) {
			console.log("Login successful!");
			intercraft.controlPanel();
			this.close();
		} else {
			if (result.errorCode == 401)
				console.log("Login failed!");
			else
				console.log("Unable to connect to auth servers");
		}
	}
}

module.exports = {Login};
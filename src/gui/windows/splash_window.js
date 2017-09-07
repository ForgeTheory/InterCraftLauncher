const {Window} = require("./window");

class SplashWindow extends Window
{
	static create() {
		return super.create({
			width: 341,
			height: 421,
			// frame: false,
			transparent: true,
			resizable: false,
			movable: false,
			minimizable: false
		});
	}
}

// Export the module
module.exports = {SplashWindow};
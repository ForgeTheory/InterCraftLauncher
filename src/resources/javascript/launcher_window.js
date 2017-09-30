const ipc = require("../js/ipc");

const launcherWindow = {

	/**
	 * Initialize the launcher window
	 * @return {Undefined}
	 */
	init: function() {
		ipc.receive("set_versions", launcherWindow.setVersions);
	},

	/**
	 * Set the available launcher versions
	 * @param {Json Object} versions
	 * @return {Undefined}
	 */
	setVersions: function(versions) {

	}
};

// Export the module
module.exports = launcherWindow;

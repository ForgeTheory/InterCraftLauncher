const ipc                   = require("../js/ipc");
const launcherWindowSidebar = require("../js/launcher_window_sidebar");

const launcherWindow = {

	/**
	 * Initialize the launcher window
	 * @return {Undefined}
	 */
	init: function() {
		ipc.receive("set_versions", launcherWindow.setVersions);
		launcherWindowSidebar.init();
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

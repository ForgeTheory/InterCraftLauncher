(function () {'use strict';

const {app} = require('electron');
const intercraft = require('./intercraft');

// Initialize InterCraft
app.on('ready', intercraft.init);

// Activate InterCraft (for Macs)
app.on('activate', intercraft.activate);

// Exit when all windows are closed
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		console.log("All windows are closed");
		intercraft.quit();
	}
});

intercraft.onQuit(app.quit);

}());
//# sourceMappingURL=main.js.map
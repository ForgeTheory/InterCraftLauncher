const {app} = require('electron');
const got = require('got');
const intercraft = require('./intercraft');

// Start the app when ready
app.on('ready', intercraft.start);

// Activate the app (for MAC)
app.on('activate', intercraft.activate);

// Exit when all windows are closed
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		console.log("All windows are closed");
		process.nextTick(() => {
			intercraft.quit();
		});
	}
});

// On InterCraft quit
intercraft.addOnQuitListener(app.quit);
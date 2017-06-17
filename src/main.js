const {app} = require('electron');
const got = require('got');
const intercraft = require('./intercraft');

console.log("ointhaoeintdaoeintdoaei...");

app.on('ready', intercraft.init);

app.on('activate', intercraft.activate);

// Exit when all windows are closed
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		console.log("All windows are closed");
		intercraft.quit();
	}
});

intercraft.onQuit(app.quit);
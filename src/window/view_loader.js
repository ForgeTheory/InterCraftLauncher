const { ipcSend, ipcReceive } = require('electron-simple-ipc');
const jetpack = require('fs-jetpack');
const fs = require('fs');

ipcReceive('view_load', (payload) => {
	fs.readFile(jetpack.cwd('./app/views').path(payload.view + '.htm'), 'utf8', function(err, contents) {
		if (err)
			console.log("ERROR: Failed to load view:", payload.view);
		payload.html = contents;
		ipcSend('view_result', payload);
	});
});
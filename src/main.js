const {app, BrowserWindow} = require('electron');
const { ipcSend, ipcReceive } = require('electron-simple-ipc');
const needle = require('needle');
const path = require('path');
const url = require('url');

let win;

ipcReceive('LOGIN', (payload) => {
	console.log("Requesting access token for credentials: ", payload);
	needle.post('https://dev.intercraftmc.com/auth/login', {
		'email': payload.email,
		'password': payload.password
	},
	function(err, resp, body) {
		console.log("Result: ", err, body);
		if (body.status == 200) {
			console.log('Loading the thing');
			win.loadURL(url.format({
				pathname: path.join(__dirname, 'views/index.htm'),
				protocol: 'file:',
				slashes: true
			}));
		}
	});
});

function createWindow () {
	
	win = new BrowserWindow({width: 800, height: 600});

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'views/login.htm'),
		protocol: 'file:',
		slashes: true
	}));

	win.webContents.openDevTools();

	win.on('closed', () => {
		win = null;
	});
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
})

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
})
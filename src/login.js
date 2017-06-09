const config = require('./config');

let win;

let onFinishCallback = undefined;
let onCancelCallback = undefined;

exports.start = function(windowHandle) {
	win = windowHandle;
	win.setView('login');
	win.show();
};

exports.onFinish = function(callback) {
	onFinishCallback = callback;
};

exports.onCancel = function(callback) {
	onCancelCallback = callback;
};
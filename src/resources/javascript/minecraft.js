$('add-mc-account-form');

var authMinecraftAccount = function(email, password, remember, callback) {
	ipcSend('control_panel_minecraft_login', {
		"email": email,
		"password": password,
		"remember": remember
	});
	ipcReceiveOnce('control_panel_minecraft_login_result', function(result) {
		console.log("Minecraft authenticated", result);
		callback(result);
	});
};

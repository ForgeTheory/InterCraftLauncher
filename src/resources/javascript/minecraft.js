var signingIn = false;
var onMinecraftLogin = undefined;

var initMinecraft = function() {
	$('#add-mc-account-form').submit(function(event) {
		event.preventDefault();
		signingIn = true;
		$('#add-mc-account-email').prop('disabled', true);
		$('#add-mc-account-password').prop('disabled', true);
		$('#add-mc-account-login-button').prop('disabled', true);
		var email = $('#add-mc-account-email').val();
		var password = $('#add-mc-account-password').val();
		var remember = $('#add-mc-account-remember').is(':checked');
		authMinecraftAccount(email, password, remember, function(result) {
			console.log("Ready for next step");
			signingIn = false;
			if (result) {
				if (onMinecraftLogin)
					onMinecraftLogin();
				$('#add-account-modal').modal('hide');
			}
			$('#add-mc-account-email').prop('disabled', false);
			$('#add-mc-account-password').prop('disabled', false);
			$('#add-mc-account-login-button').prop('disabled', false);
		});
	});

	$('#add-account-modal').on('hide.bs.modal', function(e) {
		if (signingIn)
			e.preventDefault();
		return !signingIn;
	});

	$('#add-account-modal').on('hidden.bs.modal', function(e) {
		$('#add-mc-account-email').val("");
		$('#add-mc-account-email').blur();
		$('#add-mc-account-password').val("");
		$('#add-mc-account-password').blur();
		$('#add-mc-account-remember').prop('checked', false);
		onMinecraftLogin = undefined;
	});
}

var authMinecraftAccount = function(email, password, remember, callback) {
	ipcSend('control_panel_minecraft_login', {
		"email": email,
		"password": password,
		"remember": remember
	});
	ipcReceiveOnce('control_panel_minecraft_login_result', function(result) {
		console.log("Minecraft authenticated", result);
		callback(result);
		if (result && onMinecraftLogin) {
			var cb = onMinecraftLogin; // In case the event overrides the onMinecraftLogin, which it shouldn't
			onMinecraftLogin = undefined;
			cb();
		}
	});
};

var requestMinecraftLogin = function(email, remember, callback) {
	if (callback)
		onMinecraftLogin = callback;

	var textBox = $('#add-mc-account-email');
	$('#add-account-modal').modal('show');
	$('#add-mc-account-remember').prop('checked', remember);
	if (email) {
		$('#add-mc-account-email').val(email);
		$('label[for="add-mc-account-email"]').addClass('active');
		textBox = $('#add-mc-account-password');
	}
	setTimeout(function() {
		textBox.focus();
	}, 500);
};

var launch = function (profile) {
	ipcSend('control_panel_launch_minecraft', {
		'profile': profile
	});	
};

ipcReceive('control_panel_minecraft_login_request', function(payload) {
	if (payload.callback == 'launch') {
		requestMinecraftLogin(payload.email, payload.remember, function() {
			launch($('input[name=launcher-profile-id]:checked').val());
		});
	} else
		requestMinecraftLogin(payload.email, payload.remember);
});
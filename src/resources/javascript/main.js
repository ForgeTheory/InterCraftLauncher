const shell = require('electron').shell;
$('a[target="_blank"]').click((event) => {
	event.preventDefault();
	shell.openExternal(event.target.href);
});

var setAccounts = function(accounts) {
	setActiveAccount(accounts.active);
};

var setActiveAccount = function(account) {
	if (account) {
		$('*[mcvalue="username"]').html(account.username);
		$('*[mcvalue="email"]').html(account.email);
		$('#sidebar-profile-signin').addClass('hidden');
		$('#sidebar-profile-info').removeClass('hidden');
	} else {
		$('#sidebar-profile-info').addClass('hidden');
		$('#sidebar-profile-signin').removeClass('hidden');
	}
	setLaunchButtonEnabled(Boolean(account));
};

var setProfiles = function(profiles) {
	var item;

	$('.launcher-profile-link').remove();

	for (var i = profiles.length - 1; i > -1; i--) {
		item = $("<a>", {"class": "dropdown-item launcher-profile-link", "href": "#"});
		itemRadio = $('<input>', {"type": "radio", "name": "launcher-profile-id", "value": profiles[i].key, "id": profiles[i].key});
		item.attr('index', i);
		itemRadio.attr('index', i);
		item.append(profiles[i].displayName);
		item.append(itemRadio);
		$('#launcher-profile-dropdown').prepend(item);
		item.click(function() {
			$(this).children('input').prop('checked', true);
			$('#launcher-profile-button').html($(this).html());
		});
	}
	$('.launcher-profile-link').eq(0).click();
};

var setLaunchButtonEnabled = function(enabled) {
	$('#launcher-profile-button').prop('disabled', !enabled);
};

$(document).ready(function() {

	initViewManager();
	updateInterCraftStats();
	setLaunchButtonEnabled(false);

	$('body').tooltip({
		selector: '[rel="tooltip"]'
	});
	
	$('.sidenav-tab,.sidenav-dropdown-link').click(function(e) {
		setView($(this).attr('view'));
	});

	$('.sidenav-dropdown-tab').click(function(e) {
		console.log("Clicked");
		var hasClass = $(this).hasClass('toggled')
		$('.sidenav-item .toggled').removeClass('toggled');
		if (!hasClass) {
			$(this).addClass('toggled');
		}
	});

	$('#launcher-profile-button').click(function() {
		ipcSend('control_panel_launch_minecraft', {
			'profile': $('input[name=launcher-profile-id]:checked').val()
		});
	});

	$('#add-mc-account-form').submit(function(event) {
		event.preventDefault();
		$('#add-mc-account-login-button').prop('disabled', true);
		var email = $('#add-mc-account-email').val();
		var password = $('#add-mc-account-password').val();
		var remember = $('#add-mc-account-remember').is(':checked');
		authMinecraftAccount(email, password, remember, function(result) {
			console.log("Ready for next step");
			$('#add-mc-account-login-button').prop('disabled', false);
		});
	});
});

ipcReceive('control_panel_preload', function(payload) {
	console.log("Preloading launcher profiles");
	setAccounts(payload.accounts);
	setProfiles(payload.profiles);
	ipcSend('control_panel_done', true);
});

ipcReceive('control_panel_load_profiles_result', function(payload) {
	console.log("Received new profiles");
	setProfiles(payload);
});

ipcReceive('control_panel_load_accounts_result', function(payload) {
	console.log("Received new accounts");
	setAccounts(payload);
});

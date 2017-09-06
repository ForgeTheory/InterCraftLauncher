const shell = require('electron').shell;
var locale;

$('a[target="_blank"]').click((event) => {
	event.preventDefault();
	shell.openExternal(event.target.href);
});

var getUrlParameter = function(name, defaultValue = undefined) {
	var results = new RegExp("[\?&]" + name + "=([^&#]*)").exec(window.location.href);
	if (results==null){
		return null;
	}
	return decodeURIComponent(results[1]) || 0;
};

var initLocale = function() {
	locale = JSON.parse(getUrlParameter("locale"));
	$('*[locale]').each(function(index) {
		var parts = $(this).attr("locale").split('.');
		var current = locale;
		for (var i = 0; i < parts.length; i++)
			current = current[parts[i]];
		$(this).html(current);
	});
};

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
	initLocale();
	initMinecraft();
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
		launch($('input[name=launcher-profile-id]:checked').val());
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

ipcReceive('contorl_panel_launch_button_enabled', function(enabled) {
	this.setLaunchButtonEnabled(enabled);
});
const shell = require('electron').shell;
$('a[target="_blank"]').click((event) => {
	event.preventDefault();
	shell.openExternal(event.target.href);
});

var viewport;
var currentView = 'dashboard';

var addMinecraftAccount = function(username, password, remember) {
	console.log(username);
	console.log(password);
	console.log(remember);
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

$(document).ready(function() {

	initViewManager();
	updateInterCraftStats();
	
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
		addMinecraftAccount(
			$('#add-mc-account-email').val(),
			$('#add-mc-account-password').val(),
			$('#add-mc-account-remember').is(':checked')
		);
	});
});

ipcReceive('control_panel_preload_launcher_profiles', function(payload) {
	console.log("Preloading launcher profiles");
	setProfiles(payload);
});

ipcReceive('control_panel_preload_done', function(payload) {
	console.log("Finished preloading...");
	ipcSend('control_panel_done', true);
});
const INFO    = 0;
const SUCCESS = 1;
const WARNING = 2;
const DANGER  = 3;

var register = undefined;
var unregister = undefined;
var viewport;
var currentView = undefined;
var activeTab = undefined;

var toast = function(type, message, title) {
	var func = [toastr.info, toastr.success, toastr.warning, toastr.danger][type];
	if (title)
		func(title, message);
	else
		func(message);
};

var viewTabs = {
	"dashboard": $('.sidenav-tab[view="dashboard"]'),
	"news": $('.sidenav-tab[view="news"]'),
	"intercraft_applications": $('.sidenav-dropdown-link[view="intercraft_applications"]'),
	"intercraft_blog": $('.sidenav-dropdown-link[view="intercraft_blog"]'),
	"intercraft_gallery": $('.sidenav-dropdown-link[view="intercraft_gallery"]'),
	"intercraft_members": $('.sidenav-dropdown-link[view="intercraft_members"]'),
	"intercraft_profile": $('.sidenav-dropdown-link[view="intercraft_profile"]'),
	"minecraft_account": $('.sidenav-tab[view="minecraft_account"]'),
	"settings": $('.sidenav-tab[view="settings"]')
}

var initViewManager = function() {
	console.log("Initialized");
	viewport = $("#viewport");
	setView('dashboard');
};

var registerView = function() {
	if (typeof register != 'undefined')
		register();
};

var unregisterView = function() {
	if (typeof unregister != 'undefined') {
		console.log("Unregistering the view");
		unregister();
	}
	register = undefined;
	unregister = undefined;
};

var setView = function(view) {
	if (view == currentView || viewTabs[view] == undefined)
		return;

	setTab(view);

	currentView = view;
	unregisterView();

	ipcSend('view_load', {
		'key': 'control_panel',
		'view': view
	});
};

var setTab = function(view) {
	if (viewTabs[view] == undefined)
		return;
	$('.sidenav-container .active').removeClass('active');
	viewTabs[view].addClass('active');

	if (viewTabs[view].hasClass('sidenav-dropdown-link')) {
		console.log(viewTabs[view].parents('.sidenav-item').children('.sidenav-dropdown-link'));
		viewTabs[view].parents('.sidenav-item').children('.sidenav-dropdown-tab').addClass('active');
	}
	activeTab = viewTabs[view];
};

var displayView = function(view) {
	$view = $(view).addClass('unloaded');
	$('#viewport').html($view);
	console.log($view);
	registerView();
	$view.each(function(index) {
		var $v = $(this);
		setTimeout(function() {
			console.log("Adding class");
			$v.removeClass('unloaded');
		}, 100*(index+1));
	});
};

ipcReceive('view_result', function(payload) {
	console.log("Got a view");
	if (payload.key == "control_panel")
		if (currentView == payload.view)
			displayView(payload.html);
});

ipcReceive('control_panel_toast', function(payload) {
	toast(payload.type, payload.message, payload.title);
});

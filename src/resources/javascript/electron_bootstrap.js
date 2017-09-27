const shell = require("electron").shell;
$("a[target=\"_blank\"]").click((event) => {
	event.preventDefault();
	shell.openExternal(event.target.href);
});
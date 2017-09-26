const ipc   = require("./ipc");
const utils = require("./utils");

const loginWindow = {

	init: function() {
		ipc.subscribe("set_email", loginWindow.setEmail);
	},

	login: function() {

	},

	setEmail: function(email) {
		if (email) {
			var $label = $("label[for=\"email\"");
			utils.disableTransitions($label);
			$label.addClass("active");
			$("#email").val(email);
			setTimeout(() => { utils.enableTransitions($label);	}, 0);
			$("#password").focus();
		} else {
			$("#email").focus();
			setTimeout(() => {
				$("label[for=\"email\"").addClass("active");
			}, 0);
		}
	}
}

// Export the module
module.exports = loginWindow;

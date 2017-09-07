const {InterCraftLauncher} = require("./core/intercraft_launcher");
const process              = require("process");

// Create the application instance
let app = new InterCraftLauncher(process.argv);

// Start the application
app.start();

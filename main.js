const {app} = require('electron');
const got = require('got');

console.log("Executing...");

var DOMAIN = "https://dev.intercraftmc.com/auth";

exports.isOnline = function(callback) {
    console.log("Checking if the server is online...");
    got.get(DOMAIN + '/status')
        .then(response => {
            callback(response.statusCode == 200);
        })
        .catch(error => {
            console.log("ERROR:", error);
        }); 
};

app.on('ready', () => {
    exports.isOnline((isOnline) => {
        console.log(isOnline)
    });
});
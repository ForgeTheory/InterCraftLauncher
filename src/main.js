const {app} = require('electron');
const got = require('got');
const intercraft = require('./intercraft');

console.log("ointhaoeintdaoeintdoaei...");

app.on('ready', intercraft.init);
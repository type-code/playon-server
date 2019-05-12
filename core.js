const colors = require("colors");
const htmlspecialchars = require("htmlspecialchars");

global.config = require("../config.json");
global.Logger = require("./classes/Logger.js");
global.Controller = require("./classes/Controller.js");
const SocketClass = require("./classes/Socket.js");
const DatabaseClass = require("./classes/Database.js");

var Socket = new SocketClass();
var Database = new DatabaseClass();

Socket.create();
Socket.events();
Database.connect(Socket);

// process.on("uncaughtException", Logger.ErrorHandler);
// process.on("unhandledRejection", Logger.ErrorHandler);
// process.on("exit", Logger.ErrorHandler);
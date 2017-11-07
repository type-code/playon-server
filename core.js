const colors = require("colors");
const htmlspecialchars = require("htmlspecialchars");

const SocketClass = require("./classes/Socket.js");

var Socket = new SocketClass();

Socket.create();
Socket.events();

Socket.room_create("default", "1YTLvqZNW_4");
Socket.room_create("android", "Pw_dLa5ti5Q");

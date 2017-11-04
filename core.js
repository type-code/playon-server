const colors = require("colors");
const htmlspecialchars = require("htmlspecialchars");

const SocketClass = require("./classes/Socket.js");
const VideoClass = require("./classes/Video.js");

var Video = new VideoClass();
var Socket = new SocketClass(Video);


Socket.create();
Socket.events();
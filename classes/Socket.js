const Controller = require("./Controller.js");
const Logger = require("./Logger.js");

const io = require("socket.io");
const middleware = require("socketio-wildcard")();


class Socket extends Controller {
	constructor(Video) {
		super();

		this.video = Video;
		this.port = 8080;
		this.io = null;
	}

	create() {
		this.io = io(this.port);
		this.io.use(middleware);

		Logger.ServerStarted(this.port);
		return this.io;
	}

	events(socket) {
		this.io.sockets.on("connection", (socket) => {
			this.event_connect(socket);
			this.event_disconnect(socket);
			this.event_join(socket);
		});

		Logger.EventsLoaded();
	}

	event_connect(socket) {
		socket.ip = socket.conn.remoteAddress.replace("::ffff:", "");

		socket.emit("connected", {
			video: this.video.video, 
			time: this.video.time, 
			play: this.video.play, 
			light: this.video.light
		});
	}

	event_disconnect(socket) {
		socket.on("disconnect", () => {
			Logger.EventDisconnect(socket.nick);
			this.io.sockets.in(socket.room).emit("disc", {
				nick: socket.nick,
				type: "disc"
			});
		});
	}

	event_join(socket) {
		socket.on("join", (data) => {
			socket.nick = data.nick;
			socket.room = "default";
			socket.join(socket.room);

			this.io.sockets.in(socket.room).emit("join", {
				nick: data.nick,
				type: "join"
			});

			Logger.EventJoin(socket.nick, socket.ip);
		});
	}
}

module.exports = Socket;
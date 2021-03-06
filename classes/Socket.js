var RoomClass = require("./Room.js");
var io = require("socket.io");
var middleware = require("socketio-wildcard")();

class Socket extends Controller {
	constructor() {
		super();

		this.rooms = [];
		this.port = 8080;
		this.io = null;
		this.db = null;

		setInterval(() => this.database_refresh(), 10000);
	}

	create() {
		this.io = io(this.port);
		this.io.use(middleware);
		//this.video.io = this.io;

		Logger.ServerStarted(this.port);
		return this.io;
	}

	database_refresh() {
		for(var a in this.rooms) {
			if (this.rooms[a].changed)
				this.db.room_refresh(this.rooms[a]);
		}
	}

	/**
	 * Creating room in socket
	 * @param {string} room_name 
	 * @param {string} video_id 
	 */
	room_create(room_name, video_id) {
		var room = new RoomClass(room_name, video_id);
		this.rooms[room_name] = room;
		this.rooms[room_name].io = this.io;
	}

	events(socket) {
		this.io.sockets.on("connection", (socket) => {
			this.event_connector(socket);

			this.event_connect(socket);
			this.event_disconnect(socket);
			this.event_join(socket);
			this.event_focus_toggle(socket);
			this.event_load(socket);
			this.event_message(socket);
			this.event_message_image(socket);
			this.event_light(socket);
			this.event_play(socket);
			this.event_pause(socket);
			this.event_rewind(socket);
			this.event_click(socket);
			this.event_rename(socket);
			this.event_any_event(socket);
		});

		Logger.EventsLoaded();
	}

	event_connector(socket) {
		socket.on("system", (data) => {
			if (data.socket_token == config.socket_token) {
				Logger.EventExpress();
				socket.join("system");
			}
		});

		socket.on("room_create", (data) => {
			if (data.socket_token == config.socket_token) {
				this.room_create(data.name, data.video);
			}
		});
	}

	event_connect(socket) {
		socket.ip = socket.conn.remoteAddress.replace("::ffff:", "");
	}

	event_disconnect(socket) {
		socket.on("disconnect", () => {
			if (socket.room) {
				delete this.rooms[socket.room].users[socket.nick];
				this.rooms[socket.room].users.length--;
				this.rooms[socket.room].changed = true;
				
				this.io.sockets.in(socket.room).emit("disc", {
					nick: socket.nick
				});

				Logger.EventDisconnect(socket.nick, socket.ip);
			}
		});
	}

	event_join(socket) {
		socket.on("join", (data) => {
			if (!data.room) data.room = "default";
			if (data.nick.length > 11) data.nick = "Я ДАУН"; //data.nick.substr(0, 11);
			if (!isNaN(data.nick.charAt(0))) data.nick = "N" + data.nick;

			if (this.rooms[data.room]) {
				if (this.rooms[data.room].users[data.nick]) {
					socket.emit("error_message", {
						type: "Room",
						message: "You already connected to this room!"
					});
					return false;
				}

				if (socket.room) 
				socket.leave(socket.room);

				socket.nick = data.nick;
				socket.room = data.room;
				socket.focus = true;
				socket.join(data.room);

				this.rooms[socket.room].changed = true;
				this.rooms[socket.room].users.length++;
				this.rooms[socket.room].users[socket.nick] = socket;

				var users = this.rooms[socket.room].users;
				var users_array = [];

				for(var id in users) {
					users_array.push({
						nick: users[id].nick,
						focus: users[id].focus
					});
				};

				socket.emit("joined", {
					video: this.rooms[data.room].video,
					time: this.rooms[data.room].time,
					play: this.rooms[data.room].play,
					light: this.rooms[data.room].light,
					users: users_array,
					nick: data.nick
				});

				this.io.sockets.in(socket.room).emit("join", {
					nick: data.nick,
				});

				Logger.EventJoin(socket.nick, socket.room, socket.ip);
			}
			else {
				socket.emit("error_message", {
					type: "Room",
					message: "Room not found!"
				});
			}
		});
	}

	event_focus_toggle(socket) {
		socket.on("focus_toggle", (data) => {
			data.nick = socket.nick;
			socket.focus = data.focus;
			this.io.sockets.in(socket.room).emit("focus_toggle", data);
		});
	}

	event_load(socket) {
		socket.on("load", (data) => {
			var link = this.rooms[socket.room].parse(data.link, data.playlist);
			this.rooms[socket.room].changed = true;
			this.rooms[socket.room].video = link;
			this.rooms[socket.room].play = false;
			this.rooms[socket.room].time = 0;

			this.io.sockets.emit("load", {
				video: this.rooms[socket.room].video,
				nick: socket.nick
			});

			Logger.EventLoad(this.rooms[socket.room].video, socket.nick, socket.room);
		});
	}

	event_play(socket) {
		socket.on("play", (data) => {
			if (this.rooms[socket.room].play == false) {
				this.io.sockets.in(socket.room).emit("play", {
					video: this.rooms[socket.room].video,
					time: this.rooms[socket.room].time,
					nick: socket.nick
				});
				this.rooms[socket.room].play = true;
				Logger.EventPlay(socket.nick, this.rooms[socket.room].time);
			}
		});
	}

	event_pause(socket) {
		socket.on("pause", (data) => {
			if (this.rooms[socket.room].play == true) {
				this.io.sockets.in(socket.room).emit("pause", {
					time: this.rooms[socket.room].time,
					nick: socket.nick
				});
				this.rooms[socket.room].play = false;
				Logger.EventPause(socket.nick, this.rooms[socket.room].time);
			}
		});
	}

	event_message(socket) {
		socket.on("message", (data) => {
			data.text = this.html(data.text);
			data.nick = this.check_nick(socket.nick);
			if (data.text.length > 150) data.text = data.text.substr(0, 150);
			this.io.sockets.in(socket.room).emit("message", data);
			Logger.EventMessage(socket.nick, socket.room, data.text);
		});
	}

	event_message_image(socket) {
		socket.on("message_image", (data) => {
			data.nick = socket.nick;
			this.io.sockets.in(socket.room).emit("message_image", data);
		});
	}

	event_rewind(socket) {
		socket.on("rewind", (data) => {
			var new_time = Math.floor(data.time);
			Logger.EventRewind(socket.nick, this.rooms[socket.room].time, new_time);

			this.rooms[socket.room].time = new_time;
			this.io.sockets.in(socket.room).emit("rewind", {
				time: this.rooms[socket.room].time,
				nick: socket.nick
			});
		});
	}

	event_light(socket) {
		socket.on("light", (data) => {
			this.rooms[socket.room].light = !this.rooms[socket.room].light;
			this.io.sockets.in(socket.room).emit("light", { light: this.rooms[socket.room].light });
		});
	}

	event_click(socket) {
		socket.on("click", (data) => {
			this.io.sockets.in(socket.room).emit("click", data);
		});
	}

	event_rename(socket) {
		socket.on("rename", (data) => {
			Logger.EventRename(socket.room, socket.nick, data.new_nick);
			delete this.rooms[socket.room].users[socket.nick];
			data.new_nick = this.check_nick(data.new_nick);
			data.old_nick = socket.nick;
			socket.nick = data.new_nick;
			this.rooms[socket.room].users[data.new_nick] = socket;

			this.io.sockets.in(socket.room).emit("rename", data);
		});
	}

	event_any_event(socket) {
		socket.on("*", (event, data) => {
			if (this.rooms[socket.room]) {
				this.rooms[socket.room].auto_cancel();
			}
		});
	}
}

module.exports = Socket;
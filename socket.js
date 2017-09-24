var io = require("socket.io")(8080);
var colors = require("colors");
var middleware = require("socketio-wildcard")();
var request = require("request");
var url = require("url");
var fs = require("fs");

var video = "jCx4zEKp6jg";
var time = 511;
var light = true;
var play = false;
var users = {};
var playlist = {};


console.log("Server Started! [8080]".green);

	try {
		playlist = JSON.parse( fs.readFileSync("playlist.json", "utf8") );
	} catch(e) {
		console.log("Playlist is Empty".yellow);
	}


io.use(middleware);
io.sockets.on("connection", function(socket) {

	var user_ip = socket.conn.remoteAddress.replace("::ffff:", "");
	socket.emit("connected", {video, time, play, light});

	socket.on("join", function(data){
		var nick = data.nick;
		users[socket.id] = nick;
		console.log(`>> Connect\tNick: ${nick} \tIP: ${user_ip}`.cyan);
		io.sockets.emit("join", {nick, type: "join", id: socket.id});
		socket.emit("playlist", playlist);
	});

	socket.on("play", function(){
		if (play == false) {
			var nick = users[socket.id];
			console.log("## Play \tTime: " + time);
			io.sockets.emit("play", {video, time, nick});
			play = true;
		}
	});

	socket.on("pause", function(){
		if (play == true) {
			var nick = users[socket.id];
			console.log(`## Pause\tTime: ${time}\tNick: ${nick}`);
			io.sockets.emit("pause", {time, nick});
			play = false;
		}
	});

	socket.on("load", function(data){
		var video_id = data.link;
		var nick = users[socket.id];

		if (data.playlist == false) {
			var temp = url.parse(video_id, true);
			video_id = temp.query.v;
		}

		video = video_id;
		play = false;
		time = 0;

		console.log(`## New Video\tID: ${video}`.magenta);
		io.sockets.emit("load", {video, nick});
	});

	socket.on("rewind", function(data){
		var second = Math.floor(data.second);
		var nick = users[socket.id];

		time = second;
		io.sockets.emit("rewind", {second, nick, type: "rewind"});
	});

	socket.on("rename", function(data){
		data.type = "rename";
		users[socket.id] = data.new_nick;
		io.sockets.emit("rename", data);
	});

	socket.on("playlist_delete", function(data){
		delete playlist[data.id];
		io.sockets.emit("playlist", playlist);
	});

	socket.on("message", function(data){
		io.sockets.emit("message", data);

		if (data.text.substr(0, 1) == "/") {
			var back = {nick: "SERVER", text: ""};
			var command = data.text;
			var notExist = true;

			if (inString("/users", command)) {
				back.text = "Users online:<ul>";
				for (var u in users) {
					var username = users[u];
					back.text += `<li>${username}</li>`;
				}
				back.text += "</ul>";
				notExist = false;
			}
			if (inString("/link", command)) {
				var link = "https://youtu.be/" + video;
				back.text = `Video link:<br><b><a href="${link}" target="_blank">${link}</a></b>`;
				notExist = false;
			}
			if (inString("/playlist", command)) {
				var video_link = command.substr(10);
				var video_id = url.parse(video_link, true).query.v;

				var api_link = `https://www.youtube.com/watch?v=${video_id}`;
				var api_request = `https://www.youtube.com/oembed?url=${api_link}&format=json`;
				var user = users[socket.id];

				request.get({
					url: api_request,
					json: true
				}, function(err, r, video_info){
					if (err) return;
					playlist[video_id] = video_info;
					var json = JSON.stringify(playlist);
					fs.writeFile("playlist.json", json , "utf8");
					console.log(`## Playlist\tID: ${video_id}\tUser: ${user}`.cyan);
					io.sockets.emit("playlist", playlist);
				});

				

				back.text = `Video added to playlist!`;
				notExist = false;
			}
			if (inString("/help", command)) {
				back.text  = "Commands list:<ul>";
				back.text += "<li><b>/users</b> - get online users";
				back.text += "<li><b>/playlist <i>VIDEO</i></b> - add to playlist";
				back.text += "<li><b>/link</b> - get video link";
				back.text += "<li><b>/help</b> - get help";
				back.text += "</ul>";
				notExist = false;
			}
			if (inString("/kick", command) && (data.nick == "CHROM" || data.nick == "Meepo")) {
				var user = command.substr(6);
				back.text  = user + " kicked!";
				io.sockets.emit("kick", {user: user})
				notExist = false;
			}
			if (notExist) {
				back.text = `Command ${command} not found. Write /help to get commands list.`;
			}

			io.sockets.emit("message", back);
		}
		else {
			console.log(`@@ Message\tNick: ${data.nick}\tMessage: `.yellow + `${data.text}`.white);
		}
	});

	socket.on("video_time", function(){
		socket.emit("video_time", {video, time});
	});

	socket.on("light", function(){
		light = !light;
		io.sockets.emit("light", {light});
	});

	socket.on("disconnect", function(){
		var nick = users[socket.id];
		console.log(("<< Disconnect\tNick: " + nick).red);
		delete users[socket.id];
		io.sockets.emit("disc", {nick, type: "disc", id: socket.id});
	});

	socket.on("*", function(event, data){
		auto_stop = 0;
	});

});

setInterval(function(){

	if (play == true) {
		time = (time + 0.1);
		time = Math.floor(time.toFixed(1) * 10) / 10;
		if ((time % 60) == 0)
		console.log(("   Time: " + time + "\tID: " + video).gray);


		/////////////////////////////////
		auto_stop += 1;

		if (auto_stop >= 9000) {
			auto_stop = 0;
			play = false;
			io.sockets.emit("pause", {time, nick: "SERVER"});
			console.log(`## Auto Pause\tTime: ${time}`.red);
		}
	}

}, 100);


function inString(have, string) {
	if (string.indexOf(have) == -1) return false;
	else return true;
}
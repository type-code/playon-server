var fs = require("fs");

if (config.production)
	var file = fs.createWriteStream("../logs/socket.log", {
		flags: 'a',
		encoding: 'utf8'
	});

class Logger {
	static ServerStarted(port) {
		console.log("\n\n\n");
		Logger.log(`## Socket\tStarted! [${port}]`, "green");
	}

	static EventsLoaded() {
		Logger.log(`## Events\tLoaded!`, "green");
	}

	static EventExpress() {
		Logger.log(`## Express\tConnected!`, "green");
	}

	static DatabaseTrue() {
		Logger.log(`## Database\tSuccess!`, "green");
	}

	static DatabaseFalse() {
		Logger.log(`## Database\tFailed!`, "red");
	}

	static EventJoin(nick, room, ip) {
		Logger.log(`>> Connect\tRoom: ${room}\tNick: ${nick} \tIP: ${ip}`, "cyan");
	}

	static EventDisconnect(nick, ip) {
		Logger.log(`<< Disconn\tNick: ${nick}\tIP: ${ip}`, "red");
	}

	static EventMessage(nick, room, text) {
		Logger.log(`<< Message\tRoom: ${room}\tNick: ${nick}\tMessage: ${text}`, "yellow");
	}

	static EventLoad(video, nick, room) {
		Logger.log(`## Video\tRoom: ${room}\tID: ${video}\tNick: ${nick}`, "magenta")
	}

	static EventPlay(nick, time) {
		Logger.log(`## Play \tTime: ${time} \tNick: ${nick}`, "cyan");
	}

	static EventPause(nick, time) {
		Logger.log(`## Pause \tTime: ${time} \tNick: ${nick}`, "cyan");
	}

	static EventRewind(nick, old_time, new_time) {
		Logger.log(`## Rewind\tNick: ${nick}\tFrom: ${old_time} \tTo: ${new_time}`, "yellow");
	}

	static EventTick(video, time, room) {
		Logger.log(`## Playing\tRoom: ${room}\tTime: ${time} \tVideo: ${video}`, "gray");
	}

	static EventSync(video, time) {
		Logger.log(`## Sync\tTime: ${time} \tVideo: ${video}`, "gray");
	}

	static EventAutopause(time, room) {
		Logger.log(`>> AutoStop\tTime: ${time}\tRoom: ${room}`, "red");
	}

	static EventRename(room, new_nick, old_nick) {
		Logger.log(`## Remame\tRoom: ${room}\tOldNick: ${old_nick}\tNewNick: ${new_nick}`, "red");
	}


	
	static log(text, color = "gray") {
		var time = Logger.consoleTime();
		console.log(`${time} | `.gray + `${text}`[color]);

		if (config.production)
			file.write(`${time} | ${text}\n`);
	}

	static consoleTime() {
		var date = new Date();
			// date.setHours(date.getHours() + global.config.utc_diff);
		var day = date.getDate();
		var month = date.getMonth();
		var year = date.getFullYear();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();

		day = Logger.zeroAdd(day);
		month = Logger.zeroAdd(month);
		hours = Logger.zeroAdd(hours);
		minutes = Logger.zeroAdd(minutes);
		seconds = Logger.zeroAdd(seconds);

		return `${day}.${month}.${year} - ${hours}:${minutes}:${seconds}`;
	}

	static zeroAdd(numb) {
		return (numb > 9 ? numb : "0" + numb);
	}

	static ErrorHandler(e) {
		// var error_file = fs.createWriteStream("../logs/errors.log", {
		// 	flags: 'a',
		// 	encoding: 'utf8'
		// });

		// error_file.write(e);
		// error_file.write("\n\n\n");
		// error_file.close();
		// process.exit(0);
	}
}

module.exports = Logger;
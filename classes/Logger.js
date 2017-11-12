var fs = require("fs");

if (config.production)
	var file = fs.createWriteStream("../logs/socket.log", {
		flags: 'a',
		encoding: 'utf8'
	});

class Logger {

	static ServerStarted(port) {
		console.log("\n\n\n");
		Logger.log(`## Socket Started! [${port}]`, "green");
	}

	static EventsLoaded() {
		Logger.log(`## Events loaded!`, "green");
	}

	static EventJoin(nick, ip) {
		Logger.log(`>> Connect\tNick: ${nick} \tIP: ${ip}`, "cyan");
	}

	static EventDisconnect(nick) {
		Logger.log(`<< Disconnect\tNick: ${nick}`, "red");
	}

	static EventMessage(nick, text) {
		Logger.log(`<< Message\tNick: ${nick}\tMessage: ${text}`, "yellow");
	}

	static EventLoad(video, nick) {
		Logger.log(`## New Video\tID: ${video}\tNick: ${nick}`, "magenta")
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

	static EventTick(video, time) {
		Logger.log(`## Playing\tTime: ${time} \tVideo: ${video}`, "gray");
	}

	static EventSync(video, time) {
		Logger.log(`## Sync:\tTime: ${time} \tVideo: ${video}`, "gray");
	}

	static EventAutopause(time) {
		Logger.log(`>> Auto Pause\tTime: ${time}`, "red");
	}


	
	static log(text, color) {
		var time = Logger.consoleTime();
		console.log(`${time} | `.gray + `${text}`[color]);

		if (config.production)
			file.write(`${time} | ${text}\n`);
	}

	static consoleTime() {
		var date = new Date();
			date.setHours(date.getHours() + global.config.utc_diff);
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
}

module.exports = Logger;
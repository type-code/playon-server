class Logger {

	static ServerStarted(port) {
		Logger.log(`Socket Started! [${port}]`.green);
	}

	static EventsLoaded() {
		Logger.log(`Events loaded!`.green);
	}

	static EventJoin(nick, ip) {
		Logger.log(`>> Connect\tNick: ${nick} \tIP: ${ip}`.cyan);
	}

	static EventDisconnect(nick) {
		Logger.log(`<< Disconnect\tNick: ${nick}`.red);
	}


	
	static log(text) {
		var time = Logger.consoleTime();
		console.log(`${time} | `.gray + `${text}`);
	}

	static consoleTime() {
		var date = new Date();
			date.setHours(date.getHours() + 6);
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
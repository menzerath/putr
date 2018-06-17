const { createLogger, format, transports } = require("winston");
const { colorize, combine, splat, timestamp, printf } = format;

// [YYYY-MM-DD HH:MM:SS] [level]: text
const myFormat = printf(info => {
	const date = new Date(info.timestamp);
	const timestamp = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2) + "." + ("00" + date.getMilliseconds()).slice(-3);
	return `[${timestamp}] [${info.level}]: ${info.message}`;
});

const logger = createLogger({
	format: combine(
		timestamp(),
		colorize(),
		splat(),
		myFormat
	),
	transports: [
		new transports.Console()
	]
});

module.exports = logger;
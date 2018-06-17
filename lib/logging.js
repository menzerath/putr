const { createLogger, format, transports } = require("winston");
const { colorize, combine, splat, timestamp, printf } = format;

const myFormat = printf(info => {
	// YYYY-MM-DD HH:MM:SS
	const timestamp = new Date(info.timestamp).toLocaleString(undefined, {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	});
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
const winston = require("winston");

// YYYY-MM-DD HH:MM:SS
const tsFormat = () => (new Date()).toLocaleString(undefined, {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit"
});

const logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			timestamp: tsFormat,
			colorize: true
		})
	]
});

module.exports = logger;
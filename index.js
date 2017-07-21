const config = require("./config/local.json");
const database = require("./lib/database.js");
const logger = require("./lib/logging.js");
const pkg = require("./package.json");
const putr = require("./lib/putr.js");

// init
logger.info("Welcome to putr v%s", pkg.version);

// check database connection
database.getConnection((err, connection) => {
	if (err) {
		logger.error("No database connection (%s)", err);
		process.exit(1);
	}
});

// setup http-server
const express = require("express");
const app = express();

// use body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// use cors
const cors = require("cors");
app.use(cors({
	origin: config.webserver.cors
}));

// set custom "X-Powered-By"-header
app.use(function(req, res, next) {
	res.setHeader("X-Powered-By", "putr");
	next();
});

// configure endpoints and start server
app.get("/", putr.handleGetHomeRequest);
app.get("/:endpoint", putr.handleGetRequest);
app.put("/:endpoint", putr.handlePutRequest);
app.use(putr.handleError);
app.listen(80);

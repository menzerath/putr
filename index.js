const config = require("./config/local.json");
const logger = require("./lib/logging.js");
const pkg = require("./package.json");
const putr = require("./lib/putr.js");

// init
logger.info("Starting putr v%s", pkg.version);

// setup http-server
const express = require("express");
const app = express();
app.use(express.json());

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
app.get("/health", putr.handleHealthRequest);
app.get("/:endpoint", putr.handleGetRequest);
app.put("/:endpoint", putr.handlePutRequest);
app.use(putr.handleError);
app.listen(80);

logger.info("Listening on port 80");

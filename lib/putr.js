const config = require("../config/local.json");
const database = require("./database.js");
const logger = require("./logging.js");

exports.handleError = function(err, req, res, next) {
	res.status(500).send({"success": false, "message": "Internal Server Error"});
	logger.error("Error processing request (%s)", err);
};

exports.handleGetHomeRequest = function(req, res) {
	res.send({"putr": "https://github.com/MarvinMenzerath/putr"});
};

exports.handleHealthRequest = function(req, res) {
	const remoteIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

	if (remoteIp === "127.0.0.1" || remoteIp === "::1") {
		// check for database
		database.query("SELECT 1 + 1 AS result", function(err, rows) {
			if (!err && parseInt(rows[0].result) === 2) {
				res.send({"success": true, "message": "Database is reachable and working"});
			} else {
				res.status(500).send({"success": false, "message": "Database error. See log for more information."});
				logger.error("Database error (%s)", err);
			}
		});
	} else {
		res.status(403).send({"success": false, "message": "Forbidden"});
	}
};

exports.handleGetRequest = function(req, res) {
	// get endpoint-configuration or stop processing
	const endpointConfig = getEndpointConfiguration(req.params.endpoint, res);
	if (!endpointConfig) return;

	// check if get is allowed
	if (!endpointConfig.allowGet) {
		res.status(403).send({"success": false, "message": "Getting data is disabled for this endpoint"});
		logger.warn("Getting data disabled on '%s'", endpointConfig.endpoint);
		return;
	}

	// validate authentication token or stop processing
	if (!validateAuthentication(req.header("Authorization"), endpointConfig, res)) return;

	// get data from database
	database.query("SELECT * FROM " + endpointConfig.tablename, function(err, rows) {
		if (!err) {
			res.send({"success": true, "data": rows});
		} else {
			res.status(500).send({"success": false, "message": "Unable to get data"});
			logger.error("Unable to get data (%s)", err);
		}
	});
};

exports.handlePutRequest = function(req, res) {
	// get endpoint-configuration or stop processing
	const endpointConfig = getEndpointConfiguration(req.params.endpoint, res);
	if (!endpointConfig) return;

	// load data from request-body
	const data = req.body;

	// validate authentication token or stop processing
	if (!validateAuthentication(data.auth, endpointConfig, res)) return;

	// only insert whitelisted keys into database
	for (let key in data) {
		if (data.hasOwnProperty(key)) {
			if (endpointConfig.save.indexOf(key) === -1) {
				// remove non-whitelisted entry
				delete data[key];
			}
		}
	}

	// check if data is empty
	if (Object.keys(data).length === 0) {
		res.status(400).send({"success": false, "message": "No insertable data given"});
		logger.warn("No insertable data given on '%s'", endpointConfig.endpoint);
		return;
	}

	// insert data into database
	database.query("INSERT INTO " + endpointConfig.tablename + " SET ?", data, function(err, rows) {
		if (!err && rows.affectedRows === 1) {
			res.send({"success": true, "message": "Data saved"});
		} else {
			res.status(500).send({"success": false, "message": "Unable to save new data"});
			logger.error("Unable to save new data (%s)", err);
		}
	});
};

function getEndpointConfiguration(endpoint, res) {
	// check if given endpoint exists
	let endpointConfig = false;
	config.storage.forEach(function(item) {
		if (item.endpoint === endpoint) {
			endpointConfig = item;
		}
	});

	// endpoint does not exist
	if (!endpointConfig) {
		res.status(404).send({"success": false, "message": "Unknown endpoint"});
		logger.warn("Unknown endpoint '%s'", endpoint);
	} else {
		logger.info("Handling endpoint '%s'", endpoint);
	}

	return endpointConfig;
}

function validateAuthentication(authToken, endpointConfiguration, res) {
	// check if authToken exists and if it is correct
	if (!authToken || endpointConfiguration.auth !== authToken) {
		res.status(401).send({"success": false, "message": "Invalid authorization"});
		logger.warn("Invalid authorization on '%s'", endpointConfiguration.endpoint);
		return false;
	}
	return true;
}
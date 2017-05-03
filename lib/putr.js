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

exports.handleGetRequest = function(req, res) {
	res.send({"TODO": "TODO"});
};

exports.handlePutRequest = function(req, res) {
	// get endpoint-configuration or stop processing
	const endpointConfig = getEndpointConfiguration(req.params.endpoint, res);
	if (endpointConfig === undefined) return;

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
		logger.warn("No insertable data given on '%s'", req.params.endpoint);
		return;
	}

	// insert data into database
	database.getConnection((err, connection) => {
		if (err) {
			logger.error("No database connection (%s)", err);
			return;
		}

		connection.query("INSERT INTO " + endpointConfig.tablename + " SET ?", data, function(err, rows) {
			if (!err && rows.affectedRows === 1) {
				res.send({"success": true, "message": "Data saved"});
			} else {
				logger.error("Unable to save new data (%s)", err);
			}
			connection.release();
		});
	});
};

function getEndpointConfiguration(endpoint, res) {
	// check if given endpoint exists
	let endpointConfig = {};
	config.storage.forEach(function(item) {
		if (item.endpoint === endpoint) {
			endpointConfig = item;
		}
	});

	// endpoint does not exist
	if (endpointConfig === undefined) {
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
		res.status(403).send({"success": false, "message": "Invalid authentication"});
		logger.warn("Invalid authentication on '%s'", endpointConfiguration.endpoint);
		return false;
	}
	return true;
}
const config = require("../config/local.json");
const database = require("./database.js");
const logger = require("./logging.js");

exports.handleError = function(err, req, res, next) {
	res.status(500).send({"success": false, "message": "Internal Server Error"});
};

exports.handleGetRequest = function(req, res) {
	res.send({"putr": "https://github.com/MarvinMenzerath/putr"});
};

exports.handlePutRequest = function(req, res) {
	// check if given endpoint exists
	let endpointConfig = {};
	config.storage.forEach(function(item) {
		if (item.endpoint === req.params.endpoint) {
			endpointConfig = item;
		}
	});

	// endpoint does not exist
	if (endpointConfig === undefined) {
		res.status(404).send({"success": false, "message": "Unknown endpoint"});
		logger.warn("Unknown endpoint '%s'", req.params.endpoint);
		return;
	} else {
		logger.info("Handling endpoint '%s'", req.params.endpoint);
	}

	// validate authentication token
	let data = req.body;
	if (!data.auth || endpointConfig.auth !== data.auth) {
		res.status(403).send({"success": false, "message": "Invalid authentication"});
		logger.warn("Invalid authentication on '%s'", req.params.endpoint);
		return;
	}

	// only insert whitelisted keys into database
	for (let key in data) {
		if (data.hasOwnProperty(key)) {
			if (endpointConfig.save.indexOf(key) === -1) {
				// remove non-whitelisted entry
				delete data[key];
			}
		}
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

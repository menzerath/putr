const mysql = require("mysql");
const logger = require("winston");

const auth = require("../config.json").database;

const pool = mysql.createPool({
	connectionLimit: 10,
	host: auth.host,
	port: auth.port,
	user: auth.user,
	password: auth.password,
	database: auth.database,
	charset: "utf8mb4_general_ci"
});

pool.on("enqueue", function() {
	logger.warn("Database-connection pool too small");
});

exports.getConnection = function(callback) {
	pool.getConnection(function(err, connection) {
		callback(err, connection);
	});
};

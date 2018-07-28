const mysql = require("mysql");
const auth = require("../config/local.json").database;

const pool = mysql.createPool({
	connectionLimit: 10,
	host: auth.host,
	port: auth.port,
	user: auth.user,
	password: auth.password,
	database: auth.database,
	charset: "utf8mb4_general_ci",
	timezone: "Z"
});

exports.query = (sql, values, cb) => pool.query(sql, values, cb);
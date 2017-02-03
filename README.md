# putr
putr opens a basic HTTP-server to receive and store data given via HTTP put-requests and is configured using a simple json-file.

## Install
Download a current release from [here](https://github.com/MarvinMenzerath/putr/releases), extract it and change into the new directory.

```
npm install
```

## Configuration
Create a `config.json`-file using the example below and adapt it to your needs.
Next, create the tables according to your new config-file. Using the `utf8mb4_general_ci`-charset is recommended.

Please note: not-whitelisted keys will not be saved and additional columns in your table (like `id` or `date`) will be filled with their default values.

### config.json
```json
{
	"webserver": {
		"bind": "0.0.0.0",
		"port": 8080
	},
	"database": {
		"host": "127.0.0.1",
		"port": 3306,
		"user": "putr",
		"password": "secretPasswordHere",
		"database": "putr"
	},
	"storage": [
		{
			"endpoint": "myApplication",
			"tablename": "myApplicationData",
			"auth": "secretTokenHere",
			"save": [
				"dataKey1", "dataKey2", "dataKey3"
			]
		}
	]
}

```

### Exemplary table
```
+----------+----------+------+-----+-------------------+----------------+
| Field    | Type     | Null | Key | Default           | Extra          |
+----------+----------+------+-----+-------------------+----------------+
| id       | int(11)  | NO   | PRI | NULL              | auto_increment |
| datetime | datetime | NO   |     | CURRENT_TIMESTAMP |                |
| dataKey1 | text     | NO   |     | NULL              |                |
| dataKey2 | text     | NO   |     | NULL              |                |
| dataKey3 | text     | NO   |     | NULL              |                |
+----------+----------+------+-----+-------------------+----------------+
```

## Run
```
npm start
```

## Send requests
Now you can send HTTP put-requests to your putr-server and let it store the given data for you:
```
PUT /myApplication HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
	"auth": "secretTokenHere",
	"dataKey1": "some data",
	"dataKey2": "more data",
	"dataKey3": "even more data"
}
```

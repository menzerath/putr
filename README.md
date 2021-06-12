# putr
HTTP-server to receive, store and display data given via HTTP requests and configured using a simple json-file.

## Installation
The recommended way of deploying putr is to use the provided Docker image using the command below:
```
docker run -d --name putr -v /local/path/to/putr/config/:/app/putr/config/ -p 8080:80 marvinmenzerath/putr
```

An overview of all available tags can be found on the [Docker Hub](https://hub.docker.com/r/marvinmenzerath/putr/tags/).

## Configuration
Create a `config/local.json`-file using the [`config/example.json`-file](config/example.json) provided and adapt it to your needs.
Next, create the database-tables according to your new config-file. Using the `utf8mb4_general_ci`-charset is recommended. An example can be found below.

Please note: not-whitelisted keys will not be saved and additional columns in your table (like `id` or `date`) will be filled with their default values.

### CORS
The `webserver.cors` entry is interpreted by the [cors](https://www.npmjs.com/package/cors)-package as `origin` and you might want to use one of the following options:
* `true` (boolean): reflect the request origin
* `false` (boolean): do not add any headers
* `["http://localhost", "https://localhost"]` (array; default): allow from the given origins

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

## Send requests
Now you can send HTTP put-requests to your putr-server and let it store and retrieve the given data for you.

### `PUT`
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

### `GET`
```
GET /myApplication HTTP/1.1
Host: localhost:8080
Authorization: secretTokenHere
```

```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"datetime": "2017-05-01T13:37:00.000Z",
			"dataKey1": "some data",
			"dataKey2": "more data",
			"dataKey3": "even more data"
		}
	]
}
```

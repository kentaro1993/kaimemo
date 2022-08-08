var express = require('express');
var mysql = require('mysql2');
var app = express();

var db_config = {
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'b30232f422ebcf',
    password: '4d1d89e0',
    database: 'heroku_00afb7330dc1246'
};

var pool = mysql.createPool(db_config);

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
    console.log("heroku-mysql!!");
    pool.getConnection(function(err, connection){
        connection.query('SELECT * FROM items WHERE id=1', function(err, rows, fields){
        if(err){
            console.log('error: ', err);
            throw err;
        }
        response.writeHead(200,{'Content-Type': 'text/plain'});
        response.write(rows[0].message);
        response.end();
        connection.release();
        });
    });
});

app.listen(app.get('port'), function() {
  console.log('heroku-mysql app is running on port', app.get('port'));
});
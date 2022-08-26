var express = require('express');
var mysql = require('mysql2');
var app = express();

var db_config = {
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'b30232f422ebcf',
    password: '4d1d89e0',
    database: 'heroku_00afb7330dc1246'
};

app.set('port', (process.env.PORT || 5000));

var connection;

function handleDisconnect() {
    console.log('INFO.CONNECTION_DB: ');
    connection = mysql.createConnection(db_config);
    
    //connection取得
    connection.connect(function(err) {
        if (err) {
            console.log('ERROR.CONNECTION_DB: ', err);
            setTimeout(handleDisconnect, 1000);
        }
    });
    
    //error('PROTOCOL_CONNECTION_LOST')時に再接続
    connection.on('error', function(err) {
        console.log('ERROR.DB: ', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('ERROR.CONNECTION_LOST: ', err);
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

app.get('/', function(request, response) {
    connection.query('SELECT * FROM items WHERE id=1', function(err, rows, fields){
        if(err){
            console.log('ERROR.SELECT_DB: ', err);
            throw err;
        }
        response.writeHead(200,{'Content-Type': 'text/plain'});
        response.write(rows[0].message);
        response.end();
    });
});

app.listen(app.get('port'), function() {
    console.log('heroku-mysql app is running on port', app.get('port'));
  });
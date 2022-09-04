var mysql = require('mysql');
var Common = require('./common');
var conf = Common.conf;
var logger = Common.logger;

var connectionState = false;
var connection = mysql.createConnection({
  Host: 'us-cdbr-east-06.cleardb.net',
  user: 'b30232f422ebcf',
  password: '4d1d89e0',
  database: 'heroku_00afb7330dc1246',
  insecureAuth: true
});
connection.on('close', function (err) {
  logger.error('mysqldb conn close');
  connectionState = false;
});
connection.on('error', function (err) {
  logger.error('mysqldb error: ' + err);
  connectionState = false;
});

function attemptConnection(connection) {
  if(!connectionState){
    connection = mysql.createConnection(connection.config);
    connection.connect(function (err) {
      // connected! (unless `err` is set)
      if (err) {
        logger.error('mysql db unable to connect: ' + err);
        connectionState = false;
      } else {
        logger.info('mysql connect!');

        connectionState = true;
      }
    });
    connection.on('close', function (err) {
      logger.error('mysqldb conn close');
      connectionState = false;
    });
    connection.on('error', function (err) {
      logger.error('mysqldb error: ' + err);

      if (!err.fatal) {
        //throw err;
      }
      if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
        //throw err;
      } else {
        connectionState = false;
      }

    });
  }
}
attemptConnection(connection);

var dbConnChecker = setInterval(function(){
  if(!connectionState){
    logger.info('not connected, attempting reconnect');
    attemptConnection(connection);
  }
}, conf.db.checkInterval);

// Mysql query wrapper. Gives us timeout and db conn refreshal! 
var queryTimeout = conf.db.queryTimeout;
var query = function(sql,params,callback){
  if(connectionState) {
    // 1. Set timeout
    var timedOut = false;
    var timeout = setTimeout(function () {
      timedOut = true;
      callback('MySQL timeout', null);
    }, queryTimeout);

    // 2. Make query
    connection.query(sql, params, function (err, rows) {
      clearTimeout(timeout);
      if(!timedOut) callback(err,rows);
    });
  } else {
    // 3. Fail if no mysql conn (obviously)
    callback('MySQL not connected', null);
  }
}

// And we present the same interface as the node-mysql library!
// NOTE: The escape may be a trickier for other libraries to emulate because it looks synchronous
exports.query = query;
exports.escape = connection.escape;



app.get('/', (req, res) => {
  res.render('top.ejs');
});

app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM items',
    (error, results) => {
      res.render('index.ejs', {items: results});
    }
  );
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/create', (req, res) => {
  connection.query(
    'INSERT INTO items (name) VALUES (?)',
    [req.body.itemName],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.post('/delete/:id', (req, res) => {
    connection.query(
        'DELETE FROM items WHERE id = ?',
    [req.params.id],
    (error,results) => {
      res.redirect('/index');
    }
        );
    });

    app.get('/edit/:id', (req, res) => {
        connection.query(
            'SELECT * FROM items WHERE id = ?',
            [req.params.id],
            (error, results) => {
        res.render('edit.ejs',{item:results[0]});
        }
          );
        });

        app.post('/update/:id', (req, res) => {
            connection.query(
                'UPDATE items SET name = ? WHERE id = ?',
                [req.body.itemName , req.params.id],
                (error, results) => {
                res.redirect('/index');
                }
              );
            });

app.listen(process.env.PORT || 3000);
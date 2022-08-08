var express = require('express');
var mysql = require('mysql2');
var app = express();


app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

var db_config = {
    host: 'us-cdbr-east-06.cleardb.net',
  user: 'b30232f422ebcf',
  password: '4d1d89e0',
  database: 'heroku_00afb7330dc1246'
};

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





            app.set('port', (process.env.PORT || 5000));

            var connection;
            
            function handleDisconnect() {
                console.log('INFO.CONNECTION_DB: ');
                connection = mysql.createConnection(db_config);
                
                connection.connect(function(err) {
                    if (err) {
                        console.log('ERROR.CONNECTION_DB: ', err);
                        setTimeout(handleDisconnect, 1000);
                    }
                });
                
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
                connection.query('SELECT * FROM items WHERE id = ?', function(err, rows, fields){
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




app.listen(process.env.PORT || 3000);
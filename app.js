const express = require('express')
var mysql = require('mysql')
const app = express()

const connection =
   mysql.createConnection({
      host:'us-cdbr-east-06.cleardb.net',
      user:'b30232f422ebcf',
      password:'4d1d89e0',
      database:'heroku_00afb7330dc1246'
   });


var port = process.env.PORT || 3000;

app.get('/',(req, res)=>{
connection.query('SELECT * FROM items',(error,results)=>{
    res.send('hello'+results[0].name);
      console.log(results)
      console.log(results[0])
      console.log(results[0].name)
  })
  })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))










app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));



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

app.listen(pricess.env.PORT || 3000);
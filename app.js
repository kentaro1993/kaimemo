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
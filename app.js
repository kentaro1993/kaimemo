"use strict";
const mysql = require('mysql2');
// pool を Promise にするために必要.
const util = require('util');

/* 接続情報. */
const mySqlPoolOptions = {
  host: 'us-cdbr-east-06.cleardb.net',
  user: 'b30232f422ebcf',
  password: '4d1d89e0',
  database: 'heroku_00afb7330dc1246'
};

async function insertUserAsync(name) {
  const pool = mysql.createPool(mySqlPoolOptions);
  pool.query = util.promisify(pool.query);
  try {
    const res = await pool.query('INSERT INTO items (name) VALUES (?)', [name]);
    return res.affectedRows == 1;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    pool.end();
  }
}

async function selectUsersAsync() {
  const pool = mysql.createPool(mySqlPoolOptions);
  pool.query = util.promisify(pool.query);
  try {
    const rows = await pool.query('SELECT * FROM items');
    for (let row of rows) {
      console.log(`${row.id} : ${row.name}`);
    }
  } catch (err) {
    console.log(err);
  } finally {
    pool.end();
  }
}

insertUserAsync('user 003').then(result => {
  console.log(result);
  return selectUsersAsync();
}).then(() => {
  console.log("finish");
});

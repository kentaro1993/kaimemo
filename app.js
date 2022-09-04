var mysql = require('mysql');

var conf1 = {
  host     : 'us-cdbr-east-06.cleardb.net',
  user     : 'b30232f422ebcf',
  password : '4d1d89e0',
  database : 'heroku_00afb7330dc1246',
  connectTimeout : 10000, //タイムアウト(msec)
  supportBigNumbers : true, //bigint, decimal をサポートする。
  connectionLimit : 10, //一度に生成する接続インスタンスの数
  removeNodeErrorCount : 3 //指定した回数以上接続エラーになったら接続選択対象から削除する。
};


var pool = mysql.createPoolCluster();
pool.add('MASTER', conf1);
pool.add('SLAVE1', conf1);
app.set('pool', pool);


router.get('/', function(req, res, next) {

	var app = req.app;
	var poolCluster = app.get("pool");
	
	//接続確認
	var pool = poolCluster.of('SLAVE*', 'RANDOM');
	pool.getConnection(function(err, connection) {

		console.log(connection.config.database);

	    if(err != null){
			//失敗
			console.log('ERROR');
			console.log(err);  	
			return;
	    }

		console.log('connected');

		//接続を解放する。接続はpoolに戻る。
		connection.release();
	});
	
	res.send('db');
});
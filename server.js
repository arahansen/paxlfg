
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';

var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();

var mongojs = require('mongojs');
var db = mongojs(mongoUri, ['groupList']);

var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json());




app.get('/groupList', function(req, res) {
	
	db.groupList.find(function(err, docs) {
		console.log(err);
		res.json(docs);
	});
	
});

app.get('/groupList/:id', function(req, res) {
	console.log('GET ' + req.params.id);

});

app.get('/userCreated/:id', function(req, res) {
	
	if (req.cookies.userCreated == req.params.id) {
		res.send(true);
	}
	else {
		res.send(false);
	}
	
});

app.post('/groupList', function(req, res) {
	
	req.body._id = mongojs.ObjectId();
	db.groupList.insert(req.body, function(err, doc) {
		if (err) {
			console.log(err);
		}

		try {
			res.cookie('userCreated', doc._id);
		}
		catch (e) {
			console.log(e);
		}
		res.json(doc);
		
	});

});

app.listen(port);

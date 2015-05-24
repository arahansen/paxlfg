
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';

var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();

var mongojs = require('mongojs');
var db = mongojs(mongoUri, ['groupList']);

var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.static(__dirname + '/dest'));
app.use(bodyParser.json());




app.get('/groupList', function(req, res) {
	
	db.groupList.find(function(err, docs) {
		if (err) {
			console.log("Error: " + err);
			return;	
		}
		
		res.json(docs);
	});
	
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
			console.log("Error: " + err);
		}

		try {
			res.cookie('userCreated', doc._id, {maxAge: 999999, httpOnly: true});
		}
		catch (e) {
			console.log("Error: " + e);
		}
		res.json(doc);
		
	});

});

app.post('/updateGroup/:id', function(req, res) {
	var id = {};
	var vals = {};
	console.log(req.body);
	vals['hostName'] = req.body.hostName;
	id['_id'] = mongojs.ObjectId(req.params.id);

	db.groupList.update(
		id,
		{$set : req.body},
		function(err, result) {
			if (err) {
				console.log(err);
			}
			else {
				res.send(result);
				
			}
		}
	);
});

app.post('/deleteGroup/:id', function(req, res) {
	var id = {};
	id['_id'] = mongojs.ObjectId(req.params.id);

	db.groupList.remove(id, function(err, result) {
		res.send(result);

	});
	
});
  
app.listen(port);

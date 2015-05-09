var _mongoUri = "mongodb://heroku_app36691218:vgr3c2shp82fnm0sh898lvk0a@ds041831.mongolab.com:41831/heroku_app36691218";

var express = require('express');
var app = express();

var mongojs = require('mongojs');
var db = mongojs('_mongoUri', ['groupList']);

var bodyParser = require('body-parser');


app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json());




app.get('/groupList', function(req, res) {
	console.log('Received GET request');
	db.groupList.find(function(err, docs) {
		console.log(err);
		res.json(docs);
	});

app.get('/groupList/:id', function(req, res) {
	console.log('GET ' + req.params.id);
})
	
	
});

app.post('/groupList', function(req, res) {
	console.log('POSTed data');
	req.body._id = mongojs.ObjectId();
	db.groupList.insert(req.body, function(err, doc) {
		
		res.json(doc);
		
	});

});

app.listen(3000);
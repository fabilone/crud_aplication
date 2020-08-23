var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var handlebars = require('express-handlebars');
var urlencodeParser = bodyParser.urlencoded({extended: false});

const flash = require("connect-flash");
app.use(flash());

//Routes de acesso
app.get("/", function(req, res){
  res.render('index');

});

//Template Engine
app.engine("handlebars", handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));

/*app.get('/', function(req, res){
  res.sendFile(__dirname+"/src/index.js");
});*/

var port = 3000;
app.listen(port);
console.log('Umbler - Express server started on port %s', port);
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var handlebars = require('express-handlebars');
var urlencodeParser = bodyParser.urlencoded({extended: false});

const flash = require("connect-flash");
app.use(flash());

var nav_bar = { mop1: "active", mop2: "", mop3:"", mop4: ""};

//Routes de acesso
app.get("/", function(req, res){
  nav_bar = { mop1: "active", mop2: "", mop3:"", mop4: ""};
  res.render('index', {context, nav_bar});
});

app.get("/create", function(req, res){
  nav_bar = { mop1: "", mop2: "active", mop3:"", mop4: ""};
  res.render('create-aplication', nav_bar);
});

app.get("/list", function(req, res){
  nav_bar = { mop1: "", mop2: "", mop3:"active", mop4: ""};
  res.render('read-aplication', nav_bar);
});

//Template Engine
app.engine("handlebars", handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));

var context = {
  texto: "<h6>Olá, bem-vido ao nosso sistema de cadastro</h6>",
  texto_rodape: "<p>Todos os direitos reservados</p>"
};

//Rotas CRUD


var port = 3000;
app.listen(port);
console.log('Umbler - Express server started on port %s', port);
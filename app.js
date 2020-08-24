var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var handlebars = require('express-handlebars');
var urlencodeParser = bodyParser.urlencoded({extended: false});

var pool = mysql.createPool({
    
  host: process.env.HOST || 'localhost',
  user: process.env.USER || 'usuario_teste',
  password: process.env.PASS || '5JUFBGHirkXbzZNw',
  port: process.env.ACCSS || 3306,
  database: "bd_rose_life" 

});

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
  pool.query("select * from crud_linguagem ORDER BY name", function(err, results){
    if(err) res.sendStatus(500).send(err);
    else{
      res.render('create-aplication', {nav_bar, linguagem: results});
    }

  });
  
});

app.get("/list", function(req, res){
  nav_bar = { mop1: "", mop2: "", mop3:"active", mop4: ""};
  res.render('read-aplication', nav_bar);
});

app.get("/list-linguagem", function(req, res){
  nav_bar = { mop1: "", mop2: "", mop3:"active", mop4: ""};
  res.render('read-aplication-linguagem', nav_bar);
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
app.post("/search-aplication", function(req, res){
  nav_bar = { mop1: "", mop2: "", mop3:"active", mop4: ""};
  res.render('search-aplication', nav_bar);
});

app.post("/info", function(req, res){
  nav_bar = { mop1: "", mop2: "active", mop3:"", mop4: ""};
  res.render('detail', nav_bar);
});

//Cadastrar nova aplicação
app.post("/register-aplication", urlencodeParser, function(req, res){
  console.log(req.body.nameapp);
  console.log(req.body.urlapp);
  console.log(req.body.descricaoapp);
  console.log(req.body.linguagemapp);
  console.log(req.body.imgapp);
  res.redirect("/");

});


var port = 3000;
app.listen(port);
console.log('Umbler - Express server started on port %s', port);
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var handlebars = require('express-handlebars');
var urlencodeParser = bodyParser.urlencoded({extended: false});
const multer = require("multer");
const path = require("path");

app.use(function(req, res, next){
  res.locals.user = "AVATAR";
  next();
});

//Configurações de Arquivos
const storage = multer.diskStorage({
  
	destination: function(req, file, cb){
		cb(null, "uploads/");
	},
	filename: function(req, file, cb){

    pool.query("select * from crud_controlupload where codigo=1", function(err, results){
      if(err) res.sendStatus(500).send(err);
      else{
        var size_user = results[0].last_upload;
        console.log(size_user);
        var _id_user = size_user+1;
        console.log(_id_user);
        var caminho_user = "file_id-" + _id_user + path.extname(file.originalname);
        console.log(caminho_user);

        pool.query("update crud_controlupload set last_upload=?, last_path_img=? ", [_id_user, caminho_user], function(err, retur){
          if(err) res.sendStatus(500).send(err);
          else console.log("Registro de imagem feito com sucesso!");
          
        });
        cb(null, caminho_user);
          
      }
  
    });
		
	}
});

const upload = multer({storage});

//Configurações da Base de Dados
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

  pool.query("SELECT * FROM crud_linguagem ORDER BY name", function(err, results){
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
app.post("/register-aplication", upload.single('imgapp'), urlencodeParser, function(req, res){

  pool.query("INSERT INTO crud_app VALUES(?,?,?,?,?,?)", [null, req.body.nameapp, req.body.urlapp, req.body.linguagemapp, req.body.descricaoapp, null], function(err, results){
    if(err) res.sendStatus(500).send(err);
        else{
          console.log("Cadastro App feito com sucesso!");
        } 
  });

  pool.query("SELECT * FROM crud_controlupload WHERE codigo=1", function(err, results){
    if(err) res.sendStatus(500).send(err);
    else{

      var path_img = results[0].last_path_img;
      var code_user = results[0].last_upload;

      pool.query("UPDATE crud_app SET path_img =? WHERE crud_app.codigo =?;",[path_img, code_user], function(er, result){
        if(er) res.sendStatus(500).send(er);
        else{
          console.log("Atualização do cadastro do App feito com sucesso!");
          res.redirect("/create");
        }
      }); 
      
    }

  });

});


var port = 3000;
app.listen(port);
console.log('Umbler - Express server started on port %s', port);
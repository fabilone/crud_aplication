var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var handlebars = require('express-handlebars');
var urlencodeParser = bodyParser.urlencoded({extended: false});
const multer = require("multer");
const path = require("path");
const fs = require('fs');

app.use(function(req, res, next){
  res.locals.user = "AVATAR";
  next();
});

//Configurações da Base de Dados
var pool = mysql.createPool({
    
  host: process.env.HOST || 'localhost',
  user: process.env.USER || 'usuario_teste',
  password: process.env.PASS || '5JUFBGHirkXbzZNw',
  port: process.env.ACCSS || 3306,
  database: "bd_rose_life" 

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

//Var Constantes
const upload = multer({storage});
const flash = require("connect-flash");
app.use(flash());
var context = {
  texto: "<h6>Olá, bem-vido ao nosso sistema de cadastro</h6>",
  texto_rodape: "<p>Todos os direitos reservados</p>"
};

//Template Engine
app.engine("handlebars", handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));
app.use('/uploads', express.static('uploads'));


//Função para atualizar a liguagem
function uplinguagem(name_lg){
  pool.query("UPDATE crud_linguagem SET status = status+1 WHERE crud_linguagem.name = ?", [name_lg], function(err, results){
    if(err) results.sendStatus(500).send(err);
    else{ console.log("Linguagem atualizada com sucesso"); }
  });
}
function downlinguagem(name_lg){
  pool.query("UPDATE crud_linguagem SET status = status-1 WHERE crud_linguagem.name = ?", [name_lg], function(err, results){
    if(err) results.sendStatus(500).send(err);
    else{ console.log("Linguagem atualizada com sucesso"); }
  });
}

//Função para atualizar o menu
function updateMenu(ativo){
  var nav_bar = { op1: "", op2: "", op3: "", op4: "" };
  if(ativo == 0) { nav_bar = { op1: "active", op2: "", op3: "", op4: "" }; }
  if(ativo == 1) { nav_bar = { op1: "", op2: "active", op3: "", op4: "" }; }
  if(ativo == 2) { nav_bar = { op1: "", op2: "", op3: "active", op4: "" }; }
  if(ativo == 3) { nav_bar = { op1: "", op2: "", op3: "", op4: "active" }; }
  return nav_bar; 
}

//Função para deletar arquivos
function deleteFile(file_name){
  var file = __dirname+'/uploads/'+file_name;
  fs.unlink(file, (err) => {
    if (err) throw err;
  console.log('Arquivo deletado com sucesso!');
  });
}

//Routes de acesso
//Home
app.get("/", function(req, res){
  pool.query("SELECT * FROM crud_linguagem WHERE status > 0 ORDER BY name", function(err, results){
    if(err) res.sendStatus(500).send(err);
    else{
      var msg_erro = [];
      var nav_bar = updateMenu(0);  
      if(results.length == 0){ msg_erro[0] = "Ainda não existe nenhuma aplicação cadastrada no sistema."; }
      res.render('index', {context, nav_bar, msg: msg_erro, linguagem: results});
    }
  });
});

//Cadastro
app.get("/create", function(req, res){
  pool.query("SELECT * FROM crud_linguagem ORDER BY name", function(err, results){
    if(err) res.sendStatus(500).send(err);
    else{
      var nav_bar = updateMenu(1); 
      res.render('create-aplication', {nav_bar, linguagem: results});
    }
  });  
});

//Confirmação cadastro
app.get("/end-create-aplication", function(req, res){
  res.render("error-control");
});

//Listar
app.get("/list", function(req, res){
  pool.query("SELECT * FROM crud_app ORDER BY app_language, name", function(err, results){
    if(err){ res.sendStatus(500).send(err); }
    else { var nav_bar = updateMenu(2); res.render('read-aplication', {nav_bar, aplications: results}); }
  });  
});

//Listar por linguagem
app.get("/list-linguagem", function(req, res){
  var nav_bar = updateMenu(2);
  res.render('read-aplication-linguagem', nav_bar);
});

//Rotas CRUD
app.post("/search-aplication", function(req, res){
  var nav_bar = updateMenu(2);
  res.render('search-aplication', nav_bar);
});

//Detalhe da aplicação
app.post("/info", urlencodeParser, function(req, res){
  pool.query("SELECT * FROM crud_app WHERE codigo = ?", [req.body.codigo], function(err, results){
    if(err) res.sendStatus(500).send(err);
    else{
      var nav_bar = updateMenu(1);
      res.render('detail', {nav_bar, infoApp: results});
    }
  });  
});

//Cadastrar nova aplicação
app.post("/register-aplication", upload.single('imgapp'), urlencodeParser, function(req, res){
  pool.query("INSERT INTO crud_app VALUES(?,?,?,?,?,?)", [null, req.body.nameapp, req.body.urlapp, req.body.linguagemapp, req.body.descricaoapp, null], function(err, results){
    if(err) res.sendStatus(500).send(err);
        else{
          console.log("Cadastro App feito com sucesso!");
          uplinguagem(req.body.linguagemapp);
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
          res.redirect("/end-create-aplication");
        }
      });      
    }
  });
});

//Listagem por linguagem
app.post("/select-list-linguagem", urlencodeParser, function(req, res){
  pool.query("SELECT * FROM crud_app WHERE  app_language = ? ORDER BY name", [req.body.selectlinguagem], function(err, results){
    if(err) res.sendStatus(500).send(err);
    else{
      var nav_bar = updateMenu(2);
      res.render('read-aplication-linguagem', {nav_bar, lg_name: req.body.selectlinguagem, linguagem: results});
    }
  });
});

//Deletar aplicação
app.post("/info-delete-app", urlencodeParser, function(req, res){
  res.render('delete-control', {codigo: req.body.codigo, file: req.body.path_file, language: req.body.language});
});
app.post("/delete-app", urlencodeParser, function(req, res){
  pool.query("DELETE FROM crud_app WHERE crud_app.codigo = ?;", [req.body.codigo], function(err, results){
    if(err) res.sendStatus(500).send(err);
    else{ 
      deleteFile(req.body.path_file);
      downlinguagem(req.body.app_language);
      res.render('confirm-delete-control');
     }
  });
});

//Editar Aplicação
app.post("/edite", urlencodeParser, function(req, res){
  pool.query("SELECT * FROM crud_app WHERE crud_app.codigo = ?", [req.body.codigo], function(err, results){
    if(err) res.sendStatus(500).send(err);
    else{
      pool.query("SELECT name FROM crud_linguagem ORDER BY name", function(er, result){
        if(er) res.sendStatus(500).send(er);
        else{
          var nav_bar = updateMenu(1);
          res.render('edite-aplication', {nav_bar, linguagem: result, app: results});
        }
      });
    }
  });
});

app.post("/update-aplication", urlencodeParser, function(req, res){
  pool.query("UPDATE crud_app SET name = ?, URL = ?, app_language = ?, description = ? WHERE crud_app.codigo = ?;", [req.body.nameapp, req.body.urlapp, req.body.linguagemapp, req.body.descricaoapp, req.body.codigo], function(err, results){
    if(err) res.sendStatus(500).send(err);
    else{
      if(req.body.linguagemapp != req.body.lastlinguagemapp){
          uplinguagem(req.body.linguagemapp);
          downlinguagem(req.body.lastlinguagemapp);
          res.redirect('/');
        }
    } 
  });
});

var port = 3000;
app.listen(port);
console.log('Umbler - Express server started on port %s', port);
var express = require('express');
var app = express();

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.sendFile(__dirname+"/src/index.js");
});

var port = 3000;
app.listen(port);
console.log('Umbler - Express server started on port %s', port);
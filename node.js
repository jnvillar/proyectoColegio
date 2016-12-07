var http = require("http");
var url = require("url");
var mu = require('mu2');
var fs = require('fs');
var express = require("express");
var _ = require('underscore');
var request = require('request');
var  funcionesColegio = require('./colegio');
//var manejadorArticulos = require('./manejadorArticulos');
body = require('body-parser');
var app = express();
mu.root = __dirname + '/public';
app.use(body.json());
app.use(body.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

var colegio = funcionesColegio.colegio();
console.log(colegio);
app.get('/', function (req, res) {
    mu.clearCache();
    var stream = mu.compileAndRender('index.html',{tituloPagina: colegio.nombre,tituloColegio: colegio.nombre,
                                                    descripcion: colegio.descripcion});
    stream.pipe(res);
});


app.use("/css",express.static(__dirname + '/public/css'));
app.use("/scss",express.static(__dirname + '/public/scss'));
app.use("/img",express.static(__dirname + '/public/images'));
app.use("/js",express.static(__dirname + '/public/js'));
app.use(express.static(__dirname +  '/public'));

app.use(function(req, res, next){
    res.status(404);
    if (req.accepts('html')) {
        mu.clearCache();
        var stream = mu.compileAndRender('404.html', {title: "Reddit"});
        stream.pipe(res);
        return;
    }
});

app.listen(process.env.PORT || 3000);
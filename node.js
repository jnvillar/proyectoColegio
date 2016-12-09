
var mongo = require('mongodb');
var monk = require('monk');
var db =  monk('localhost:27017/prueba');

var articleManager = require('./articles');
articleManager.start(db);


var http = require("http");
var url = require("url");
var mu = require('mu2');
var fs = require('fs');
var express = require("express");
var app = express();
var _ = require('underscore');
var request = require('request');
var passport = require('passport-local');
var debug = true;

body = require('body-parser');
mu.root = __dirname + '/';
app.use(body.json());
app.use(body.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

var  funciones = require('./colegio');
var school = funciones.school();
var page = funciones.page();

app.get('/', function (req, res) {
    mu.clearCache();
    var stream = mu.compileAndRender('mainpage/index.html',{school: school,page: page});
    stream.pipe(res);
});

app.get('/courses', function (req, res) {
    mu.clearCache();
    var articles =  articleManager.getArticles(db);
    articles.then(function (result) {
        console.log(result);
        //console.log(articles[0].title);
        var stream = mu.compileAndRender('courses/index.html',{page: page,school: school, articles: result});
        stream.pipe(res);
    });
});

app.get('/courses/nuevoArticulo', function (req, res) {
    mu.clearCache();
    var stream = mu.compileAndRender('courses/formularioArticulo.html',{page: page,school: school});
    stream.pipe(res);
});

app.post("/courses/postArticulo",function(req,res){
    mu.clearCache();
    articleManager.newArticle(req.body,db);
    res.redirect('../courses');
});

app.post('/mandarEmail',function (req,res) {
    mu.clearCache();
    var stream = mu.compileAndRender('mainpage/index.html',{school: school,page: page});
    stream.pipe(res);
});

app.get('/courses/article/:id', function (req, res) {
    mu.clearCache();
    var id = req.params.id;
    var articulo = articleManager.findArticle(id,db);
    var stream = mu.compileAndRender('single.html', {title: "Reddit" ,contenido: articulo.contenido, imagen: articulo.imagen, id:articulo.id, listcomentarios: _.values(articulo.comentarios),autor: articulo.autor, imgautor: articulo.imgautor});
    stream.pipe(res);
});


app.use("/css",express.static(__dirname + '/css'));
app.use("/scss",express.static(__dirname + '/scss'));
app.use("/img",express.static(__dirname + '/images'));
app.use("/js",express.static(__dirname + '/js'));
app.use(express.static(__dirname +  '/'));

/*app.use(function(req, res, next){
    res.status(404);
    if (req.accepts('html')) {
        mu.clearCache();
        var stream = mu.compileAndRender('404.html', {title: "Reddit"});
        stream.pipe(res);
        return;
    }
});*/

app.listen(process.env.PORT || 3000);
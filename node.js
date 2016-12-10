

var Promise = require("bluebird");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/prueba');
var db = mongoose.connection;


var articleManager = require('./articles');
articleManager.start(mongoose);

var commentsManager = require('./comments');
commentsManager.start(mongoose);


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
        var stream = mu.compileAndRender('courses/index.html',{page: page,school: school, articles: result.reverse()});
        stream.pipe(res);
    });
});

app.get('/article/:id', function (req, res) {
    mu.clearCache();
    var id = req.params.id;
    var comments = commentsManager.getComments(id);
    var article = articleManager.findArticle(id);

    article.then(function (article) {
        comments.then(function (comments) {
            var stream = mu.compileAndRender('courses/single.html',{page: page,school: school, article: article[0],
                                             comments: comments});
            stream.pipe(res);
        });
    });

});

app.get('/courses/nuevoArticulo', function (req, res) {
    mu.clearCache();
    var stream = mu.compileAndRender('courses/formularioArticulo.html',{page: page,school: school});
    stream.pipe(res);
});

app.post("/courses/postArticulo",function(req,res){
    mu.clearCache();
    articleManager.newArticle(req.body);
    res.redirect('../courses');
});

app.post("/courses/newComment/:id",function(req,res){
    mu.clearCache();
    var id = req.params.id;
    //console.log(req.body);
    req.body.postId = id; req.body.likes = 0; req.body.dislikes = 0;
    commentsManager.newComment(req.body);
    res.redirect('/article/'+id);
});

app.get("/courses/voteComment/:idC/:vote/:idP",function(req,res){
    mu.clearCache();
    var idC = req.params.idC;
    var type = req.params.vote;
    var idP = req.params.idP;
    commentsManager.voteComment(idC,type);
    res.redirect('/article/'+idP);
});



app.post('/mandarEmail',function (req,res) {
    mu.clearCache();
    var stream = mu.compileAndRender('mainpage/index.html',{school: school,page: page});
    stream.pipe(res);
});


app.use("/css",express.static(__dirname + '/css'));
app.use("/scss",express.static(__dirname + '/scss'));
app.use("/img",express.static(__dirname + '/images'));
app.use("/js",express.static(__dirname + '/js'));
app.use(express.static(__dirname +  '/'));

app.use(function(req, res){
    res.status(404);
    if (req.accepts('html')) {
        mu.clearCache();
        var stream = mu.compileAndRender('mainpage/404.html', {school: school,page: page});
        stream.pipe(res);
    }

});


app.listen(process.env.PORT || 3000);
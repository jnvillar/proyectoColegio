var path = require('path');
var exphbs = require('express-handlebars');
var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        equal: function (lvalue, rvalue, options) {
            console.log(lvalue);
            console.log(rvalue);
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
});

var Promise = require("bluebird");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/prueba');
var db = mongoose.connection;
var passport = require('passport');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser  = require('body-parser');
var flash   = require('connect-flash');
var methodOverride = require('method-override');
var funciones = require('./colegio');
var school = funciones.school();
var page = funciones.page();

var articleManager = require('./articles');
articleManager.start(mongoose);

var commentsManager = require('./comments');
commentsManager.start(mongoose);

var users = require('./users');
users.start(mongoose,passport);
//users.createUser('b','b',false);

var http = require("http");
var url = require("url");
var mu = require('mu2');
var fs = require('fs');
var express = require("express");
var app = express();
var _ = require('underscore');
var request = require('request');
var flash    = require('connect-flash');


body = require('body-parser');
mu.root = __dirname + '/'



app.use(body.json());
app.use(body.urlencoded({       // to support URL-encoded bodies
    extended: true
}));



app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
var options = { dotfiles: 'ignore', etag: false,
    extensions: ['htm', 'html'],
    index: false
};
app.use(express.static(path.join(__dirname, 'public') , options  ));



app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(flash());

app.use(session({ secret: 'keyboard cat', maxAge:1 }));
app.use(passport.initialize());
app.use(passport.session());




app.get('/', function (req, res) {
    mu.clearCache();
    res.render('indexMain',{school:school,page:page});
    //var stream = mu.compileAndRender('mainpage/index.html',{school: school,page: page});
    //stream.pipe(res);
});

app.get('/courses/logout',function(req,res){
    console.log("login out");
    if(req.user) {
        req.logout();
        res.redirect('../')
    }else {
        res.redirect('../')
    }
});

app.get('/courses/logIn',function(req,res) {
    if(req.user) {
        res.redirect('/courses');
    }else {
        res.render('logIn',{page:page});
        //mu.clearCache();
        //var stream = mu.compileAndRender('courses/logIn.html', {page: page});
        //stream.pipe(res);
    }
});

app.post('/courses/logIn', passport.authenticate('local',{
    successRedirect: '../courses',
    failureRedirect: '../courses/logIn',
    failureFlash:'Informacion Invalida'
    }
));

app.get('/courses', function (req, res) {
    if(req.user) {
        mu.clearCache();
        var articles = articleManager.getArticles();
        articles.then(function (result) {
            res.render('indexCourses',{school:school,articles:result.reverse(),page:page});
            //var stream = mu.compileAndRender('courses/index.html', {page: page,chool: school articles: result.reverse()});
            //stream.pipe(res);
        });
    }else{
        res.redirect('../courses/logIn');
    }
});

app.get('/article/:id', function (req, res) {
    if(req.user){
        //mu.clearCache();
        var id = req.params.id;
        var comments = commentsManager.getComments(id);
        var article = articleManager.findArticle(id);
        article.then(function (article) {
            comments.then(function (comments) {
                res.render('single',{page: page,school: school, article: article[0],
                    comments: comments, user: req.user});
                //var stream = mu.compileAndRender('courses/single.html',{page: page,school: school, article: article[0],comments: comments, user: req.user});
                //stream.pipe(res);
            });
        });
    }else{
        res.redirect('../courses/logIn');
    }

});

app.get('/courses/borrarArticulo/:id', function (req, res) {
    if(req.user) {
        var id = req.params.id;
        articleManager.deleteArticle(id);
        commentsManager.deleteComments(id);
        res.redirect('../');
    }else{
        res.redirect('../courses/logIn');
    }
});


app.get('/courses/nuevoArticulo', function (req, res) {
    if(req.user) {
       // mu.clearCache();
        res.render('formularioArticulo', {page: page, school: school});
        //var stream = mu.compileAndRender('courses/formularioArticulo.html', {page: page, school: school});
        //stream.pipe(res);
    }else{
        res.redirect('../courses/logIn');
    }
});

app.post("/courses/postArticulo",function(req,res){
    if(req.user) {
        articleManager.newArticle(req.body);
        res.redirect('../courses');
    }else{
        res.redirect('../courses/logIn');
    }
});

app.post("/courses/newComment/:id",function(req,res){
    if(req.user) {
        mu.clearCache();
        var id = req.params.id;
        //console.log(req.body);
        //console.log(req.user);
        req.body.name = req.user.name;
        req.body.postId = id;
        req.body.likes = 0;
        req.body.dislikes = 0;
        req.body.votersPos = [];
        req.body.votersNeg = [];
        commentsManager.newComment(req.body);
        res.redirect('/article/' + id);
    }else{
        res.redirect('courses/logIn');
    }
});


app.get('/courses/borrarComentario/:idC/:idP', function (req, res) {
    if(req.user) {
        //mu.clearCache();
        var idc = req.params.idC;
        var idp = req.params.idP;
        commentsManager.deleteComment(idc);
        res.redirect('/article/'+idp);
    }else{
        res.redirect('../courses/logIn');
    }
});


app.get("/courses/voteComment/:idC/:vote/:idP",function(req,res){
    if(req.user) {
        mu.clearCache();
        var idC = req.params.idC;
        var type = req.params.vote;
        var idP = req.params.idP;
        var voter = req.user.name;
        commentsManager.voteComment(idC, type);
        res.redirect('/article/' + idP);
    }else{
        res.redirect('../courses/logIn');
    }
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
       // mu.clearCache();
        res.render('404', {school: school,page: page});
        //var stream = mu.compileAndRender('mainpage/404.html', {school: school,page: page});
        //stream.pipe(res);
    }

});


app.listen(process.env.PORT || 3000);
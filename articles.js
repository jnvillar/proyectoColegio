var SchemArticles;
var articles;

module.exports = {
    start: function (db) {
        SchemArticles = db.Schema({title:String,summary:String,content:String,img:String,author:String,imgAuthor:String});
        articles = db.model('article', SchemArticles);
    },

    newArticle: function (body) {
        // console.log(body);
        var newArticle = new articles(body);
        newArticle.save()
    },

    getArticles: function(){
       return articles.find({});
    },

    findArticle: function (id) {
        return articles.find({_id:id});
    },
};


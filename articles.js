var articles;

module.exports = {
    start: function (db) {
        articles = db.create('articles');
    },

    newArticle: function (body) {
        // console.log(body);
        articles.insert(body);
    },

    getArticles: function(){
       return articles.find({});
    },

    findArticle: function (id) {
        return articles.find({_id:id});
    },
};


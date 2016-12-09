var articles;
var debug = true;

module.exports = {
    start: function (db) {
        articles = db.create('articles');
    },

    newArticle: function (body) {
        if(debug) console.log(body);
        articles.insert(body);
    },
};


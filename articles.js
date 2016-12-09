var articles;


module.exports = {
    start: function (db) {
        articles = db.create('articles');
    },

    newArticle: function (body) {
        // console.log(body);
        articles.insert(body);
    },

    getArticles: function(db){
       return articles.find({});
    },

    findArticle: function (id,db) {
        articles.find({id:id},function (e,docs) {
            //console.log(docs);
            return docs[0];
        })
    },
};


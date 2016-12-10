var comments;

module.exports = {
    start: function (db) {
        comments = db.create('comments');
    },

    newComment: function (body) {
        //console.log(body);
        comments.insert(body);
    },

    getComments: function(id){
        return comments.find({postId:id});
    },

    voteComment: function (id,type) {
        console.log(id);
        if(type == 0){
            comments.findOneAndUpdate({ _id: id}, { $inc: { likes : 1  } });
        }else{
            comments.findOneAndUpdate({ _id: id}, { $inc: { dislikes : 1  } });
        }

    }


};


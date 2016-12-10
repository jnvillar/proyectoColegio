var SchemComments;
var comments;

module.exports = {
    start: function (db) {
        SchemComments = db.Schema({name:String,comment:String,postId:String,likes:Number,dislikes:Number});
        comments = db.model('comment', SchemComments);
    },

    newComment: function (body) {
        var newComment = new comments(body);
        newComment.save();
    },

    getComments: function(id){
        return comments.find({postId:id});
    },

    voteComment: function (id,type) {
        if(type == 0){
            comments.findOne({_id: id}, function (err, user) {
                user.likes = user.likes+1;
                user.save(function (err) {
                    if(err) {
                        console.error('ERROR!');
                    }
                });
            });

        }else{
            comments.findOne({_id: id}, function (err, user) {
                user.dislikes = user.dislikes+1;
                user.save(function (err) {
                    if(err) {
                        console.error('ERROR!');
                    }
                });
            });
        }

    }


};


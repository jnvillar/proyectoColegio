var SchemSubject;
var SchemSubjects;
var SchemPost;
var SchemPosts
var subject;
var oneSubject;
var postSubject;
var post;



module.exports = {
    start: function (db) {
        SchemSubject = db.Schema({ name:String,
                                    year:String,
                                    content: String,
                                    img: String,
                                    profesor: String,
                                    imgProfesor: String});

        SchemSubjects = db.Schema({
            year: String,
            subjects: [SchemSubject]
        });

        SchemPost = db.Schema({
            name: String,
            content: String
        });

        SchemPosts = db.Schema({year: String,
                                subjectName: String,
                                posts: [SchemPost]

        });

        oneSubject = db.model('subject',SchemSubject);
        subject = db.model('subjects',SchemSubjects);
        postSubject = db.model('postSubjects', SchemPosts);
        post = db.model('post',SchemPost);
    },

    getSubjects: function(){
        return subject.find({});
    },

    newSubject: function(body) {
        var newSubject = new oneSubject(body);
        subject.findOne({year:body.year},function (err,res) {
            if(res) {
                var newPosts = new postSubject({year:body.year,subjectName:body.name,posts:[]});
                newPosts.save();
                res.subjects.push(newSubject);
                res.save();
            }else{
                var newPosts = new postSubject({year:body.year,subjectName:body.name,posts:[]});
                newPosts.save();
                var newSubjects = new subject({year:body.year,subjects:[]});
                newSubjects.subjects.push(newSubject);
                newSubjects.save();
            }
        });
    },

    newPost: function (user,body,year,name) {
        var newPost = new post(body);
        postSubject.findOne({year:year,subjectName:name},function(err,res){
            res.posts.push(newPost);
            res.save()
        });
    },

    getSubjectPosts: function (year,name) {
        return postSubject.findOne({year:year,subjectName:name});
    },

    findOnePostInPost: function(idP,buscar){
        for(var i=0;i<buscar.length;i++){
            if(buscar[i]._id==idP){
                return buscar[i];
            }
        }
    },

    getSubject: function (id) {
        console.log(id);
        return subject.find({subjects:{$elemMatch:{_id:id}}})
    },

    findSubject: function (id) {
        return subject.findOne({subjects:{$elemMatch:{_id:id}}});
    },

    getUserSubjects: function(user){
        return subject.findOne({year:user.year});
    }

}
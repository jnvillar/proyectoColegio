var SchemSubject;
var SchemSubjects;
var SchemPost;
var SchemPosts
var subject;
var postSubject;
var post;



module.exports = {
    start: function (db) {
        SchemSubject = db.Schema({ name:String,
                                    year:String,
                                    id:String,
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
            content: String,
            imgs: [String],
            links: [String]
        });

        SchemPosts = db.Schema({year: String,
                                subjectName: String,
                                posts: [SchemPost]

        });

        subject = db.model('subjects',SchemSubjects);
        postSubject = db.model('postSubjects', SchemPosts);
        post = db.model('post',SchemPost);
    },



    createSubjects: function(year,subjects) {
        var newSubject = new subject({year: year,subjects: subjects});
        newSubject.save(function (err) {
            if(err) console.log("Error saving subject");
            else {console.log("Subject saved")}
        });

        for(var i=0;i<subjects.length;i++){
            var newPostSubject = postSubject({year:year,subjectName:subjects[i].name,posts:[]});
            newPostSubject.save();
        }

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

    findSubjectInSubjects: function (id,subjects) {
        for(var i=0;i<subjects.length;i++){
            if(subjects[i]._id==id){
                return subjects[i];
            }
        }
    },

    getUserSubjects: function(user){
        return subject.findOne({year:user.year});
    }

}
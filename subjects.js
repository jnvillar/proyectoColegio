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
                                idS: String,
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

    deleteSubjectPost: function(idPost,commentManager){
        postSubject.findOne({posts:{$elemMatch:{_id:idPost}}},function (err,res) {
            if(res){
                for(var i=0;i<res.posts.length;i++){
                    if(res.posts[i]._id == idPost){
                        res.posts.splice(i,1);
                    }
                }
                res.save();
            }
        });
        commentManager.deleteComments(idPost);
    },

    deleteYear: function(year,commentManager){
        var findSubject = subject.findOne({year:year},function (err,subject) {
            for(var i=0;i<subject.subjects.length;i++){
                module.exports.deleteSubject(subject.subjects[i]._id,commentManager);
            }
        });

        findSubject.then(function (subject) {
            subject.remove(function (err) {
                if(err){console.log("error al borrar año")}
                else{console.log("se borro el año")}
            });
            subject.save();
        })
    },



    deleteSubject: function (id,commentManager) {
        var findSubject = this.findSubject(id);
        findSubject.then(function (subject) {
            if(subject) {
                for(var i = 0;i<subject.subjects.length;i++){
                    if(subject.subjects[i]._id == id){
                        subject.subjects.splice(i, 1);
                        subject.save();
                    }
                }
            }else{
                //console.log("no encontre materia");
            }
        });


        var findPosts = postSubject.findOne({idS: id}, function (err, posts) {
            if(posts) {
                //console.log(posts);
                for (var i = 0; i < posts.posts.length; i++) {
                    console.log("borrando comments");
                    commentManager.deleteComments(posts.posts[i]._id);
                }
            }else{
                console.log("no encontre post para borrar comentarios")
            }
        });

        findPosts.then(function (posts) {
            if(posts){
                console.log(post);
                posts.remove(function (err) {
                    if (err) {
                        console.error('Error al borrar Materia');
                    }
                });
            }else{
                console.log("No encontre posts")
            }

        });

    },


    newSubject: function(body) {
        var newSubject = new oneSubject(body);
        subject.findOne({year:body.year},function (err,res) {
            if(res) {
                var newPosts = new postSubject({year:body.year,subjectName:body.name,idS:newSubject._id,posts:[],profesor:body.profesor});
                newPosts.save();
                res.subjects.push(newSubject);
                res.save();
                //console.log("post en materia agregado")
            }else{
                var newPosts = new postSubject({year:body.year,subjectName:body.name,posts:[],profesor:body.profesor,idS:newSubject._id});
                newPosts.save();
                var newSubjects = new subject({year:body.year,subjects:[]});
                newSubjects.subjects.push(newSubject);
                newSubjects.save();
                //console.log("post en materia agregada");
            }
        });
    },

    newPost: function (user,body,year,name,idS) {
        var newPost = new post(body);
        postSubject.findOne({year:year,subjectName:name,idS:idS},function(err,res){
            if(res) {
                //console.log("encontre la materia, agregando post");
                res.posts.push(newPost);
                res.save()
            }else{
                //console.log("no encontre la materia");
            }
        });
    },

    getSubjectPosts: function (year,name) {
        //console.log(year,name);
        return postSubject.findOne({year:year,subjectName:name},function (err,res) {
            if(res){
                //console.log("encontre los posts")
            }
        });


    },

    findOnePostInPost: function(idP,buscar){
        for(var i=0;i<buscar.length;i++){
            if(buscar[i]._id==idP){
                return buscar[i];
            }
        }
    },

    getSubject: function (id) {
        //console.log(id);
        return subject.find({subjects:{$elemMatch:{_id:id}}})
    },

    findSubject: function (id) {
        return subject.findOne({subjects:{$elemMatch:{_id:id}}});
    },

    getUserSubjects: function(user){
        return subject.findOne({year:user.year});
    }

}
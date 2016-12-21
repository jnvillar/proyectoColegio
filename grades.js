var SchemGrade;
var SchemUserGrades;
var grades;
var userGrades;

module.exports = {
    start: function (db) {

        SchemGrade = db.Schema({
            year: String,
            subject: String,
            idS: String,
            value: Number,
            name: String

        });

        SchemUserGrades = db.Schema({
            idUser: String,
            grades: [SchemGrade]
        });

        userGrades = db.model('userGrades',SchemUserGrades);
        grades = db.model('grades',SchemUserGrades);
    },

    getUserGrades: function(idUser){
        return grades.findOne({idUser:idUser})
    },

    addGrade: function (idUser,subject,year,idSubject,gradeValue, gradeName) {
        var newGrade = newGrade({year: year, subject: subject, idS: idSubject, value:gradeValue, name:gradeName});

        grades.findOne({idUser:idUser},function (err,res) {
            if(res){
                res.grades.push(newGrade);
                res.save();
            }else{
                var newUserGrades = new userGrades({idUser:idUser,grades:[newGrade]})
                newUserGrades.save();
            }
        })
    }
};
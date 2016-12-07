var school = function(){
    this.name = "Don Bosco";
    this.description = "Descripcion Colegio";
};

school = new school();


module.exports = {
    school: function () {
        return school;
    },
};
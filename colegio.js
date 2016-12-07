var school = function(){
    this.name = "Don Bosco";
    this.description = "Bienvenido  al campus  virtual  del  colegio  Don  Bosco";
};

school = new school();


module.exports = {
    school: function () {
        return school;
    },
};
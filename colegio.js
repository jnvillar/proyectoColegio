var colegio = function(){
    this.nombre = "Don Bosco";
    this.descripcion = "Descripcion Colegio";
};

colegio = new colegio();


module.exports = {
    colegio: function () {
        return colegio;
    },
};
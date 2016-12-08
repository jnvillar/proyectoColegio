var school = function(){
    this.name = "Don Bosco Online";
    this.description = "Bienvenido  al campus  virtual  del  colegio  Don  Bosco";
    this.longdescription = "Pedir una Descripcion al colegio";
    this.location = "https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d2757.866130704599!2d-58.279999273830086!3d-34.713400980922586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1scolegio+don+bosco!5e0!3m2!1ses-419!2sar!4v1481164297313";
    this.street = "Belgrano 200";
    this.neighborhood = "Bernal";
    this.telNumber = "telefono del colegio";
    this.mail = "mail del colegio";
    this.facebook = "url del face";
    this.twitter = "url del twitter";

};

var pageInfo = function(){
    this.businessName = "Nombre de la empresa";
    this.businessPage = "pagina de la empresa"
};

school = new school();
pageInfo = new pageInfo();

module.exports = {
    school: function () {
        return school;
    },
    pageInfo: function () {
        return pageInfo;
    },
};
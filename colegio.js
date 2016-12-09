var facility = function(id,name,photo,description,date){
    this.id = id;
    this.photo = photo;
    this.name = name
    this.description = description;
    this.date = date;
};

var facility1 = new facility(1,"nombre1","../images/s1.jpg","descripcion instalacion 1", "fecha1");
var facility2 = new facility(2,"nombre2","../images/s2.jpg", "descripcion instalacion 2","fecha2");
var facility3 = new facility(3,"nombre3","../images/s3.jpg","descripcion instalacion 3", "fecha3");
var facility4 = new facility(4,"nombre4","../images/s4.jpg", "descripcion instalacion 4","fecha4");
var facilities = [facility1,facility2,facility3,facility4];


var school = function(facilities){
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
    this.archivement1 = "logro 1"; this.archivement1Description = "descripcion logro 1";
    this.archivement2 = "logro 2"; this.archivement2Description = "descripcion logro 2";
    this.archivement3 = "logro 3"; this.archivement3Description = "descripcion logro 3";
    this.boss1 = "nombre directivo 1"; this.boss1Description = "descripcion directivo 1"; this.boss1Photo = "../images/t1.jpg"; this.boss1Mail = "mail1";
    this.boss2 = "nombre directivo 2"; this.boss2Description = "descripcion directivo 2"; this.boss2Photo = "../images/t2.jpg"; this.boss2Mail = "mail2";
    this.boss3 = "nombre directivo 3"; this.boss3Description = "descripcion directivo 3"; this.boss3Photo = "../images/t3.jpg"; this.boss3Mail = "mail3";
    this.boss4 = "nombre directivo 4"; this.boss4Description = "descripcion directivo 4"; this.boss4Photo = "../images/t4.jpg"; this.boss4Mail = "mail4";
    this.facilitiesDescription = "descripcion de las instalaciones";
    this.facilities = facilities;

};

var pageInfo = function(){
    this.tittle = "Don Bosco";
    this.businessName = "Nombre de la empresa";
    this.businessPage = "pagina de la empresa"
};

school = new school(facilities);
pageInfo = new pageInfo();

module.exports = {
    school: function () {
        return school;
    },
    pageInfo: function () {
        return pageInfo;
    },
};
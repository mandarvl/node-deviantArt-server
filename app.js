process.env.PWD = process.cwd() ;

let fs = require('fs');  //afahana mamaky s msave fichier
let express = require('express');  //framework manamora creation serveur
let formidable = require('formidable');  //framework manamora upload fichier
let mysql = require('mysql');  //framework afaana mconnect am BD mysql
let cors = require('cors');    //framework mdebloquer acces av any ivelany

let app=express();
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: "http://localhost:4200"
}));        //asaina mampiasa cors le app izay express
app.use(express.json());  //omena fahafahana mampiasa json le express
app.listen(4300,() => {         //definition de port
    console.log("Started on PORT 4300");
});

// Then
app.use(express.static(process.env.PWD + '/public'));

let dbConfig = {
    host: "localhost",  //serveur mis anle mysql
    port: 3308,
    user: "root",   //user
    password: "",   //mdp
    database: 'deviantart'  //nom BD
}

let connection ;

connection = mysql.createConnection(dbConfig);

connection.connect(function(err) { 
    if(err) {      
    console.log('error when connecting to db:', err);
    
    }else{
        console.log("Connected") ;
    }                            
});

//rehefa aka post s amaly
app.post('/', (req, res) => {
    //req.body = maka n contenu n post

});

app.get('/users', (req, res) => {
    connection.query("SELECT * FROM membres", function (err, result, fields) {  
        if (err) throw err; 
        console.log(result);
        res.send(result) ;
    });
}); 

app.get('/posts', (req, res) => {
    connection.query("SELECT publications.*, nomUtilisateur, lienAvatar FROM publications JOIN membres ON publications.idMembre = membres.idMembre", function (err, result, fields) {  
        if (err) throw err; 
        console.log(result) ;
        res.send(result) ;
    });
});

app.get('/post/:id', (req, res) => {
    connection.query("SELECT publications.*, nomUtilisateur, lienAvatar FROM publications JOIN membres ON publications.idMembre = membres.idMembre WHERE idPublication = "+req.params.id, function (err, result, fields) {  
        if (err) throw err; 
        console.log(result) ;
        if(result.length > 0)
            res.send(result[0]) ;
        else{
            res.send({
                success: false,
                errorMessage: "La publication est introuvable."
            }) ;
        }
    });
}) ;

app.get('/comments/:postId', (req, res) => {
    connection.query("SELECT * from commentaires JOIN membres ON commentaires.idMembre = membres.idMembre WHERE idPublication = "+req.params.postId, function(err, result, fields){
        if (err) throw err; 
        console.log(result) ;
        res.send(result) ;
    }) ;
}) ;

app.post('/comments/new', (req, res) => {
    connection.query("INSERT INTO commentaires (contenu, dateCommentaire, idMembre, idPublication) VALUES('"+req.params.content+"', '"+new Date().getDate()+"', "+req.params.idUser+", "+req.params.idPost+")", function(err, result, fields){
        if (err) throw err; 
        console.log(result) ;
        res.send({
            success: true
        }) ;
    }) ; 
}) ;

app.post('/login', (req, res) => {
    connection.query("SELECT * FROM membres WHERE nomUtilisateur='"+req.params.username+"' AND motDePasse='"+password+"'", function(err, result, fields){
        if (err) throw err; 
        console.log(result) ;
        if(result.length > 0){
            res.send({success: true}) ;
        }else{
            res.send({
                success: false,
                errorMessage: "Le nom d'utilisateur ou le mot de passe est incorrect."
            }) ;
        }
    }) ; 
})

/*fs
//methode asynchrone dol reo
//mamaky fichier
fs.readFile('nom anle fichier', function(err, data) {   //azo lazaina zn oe sad lien le eo amle nom fichier
    //err mis n erreur
    //data mis n contenu anle fichier
});

//mamorona fichier
fs.writeFile('nom anle fichier', 'contenu n ato', function (err) {  //azo lazaina zn oe sad lien le eo amle nom fichier
    //err mis n erreur
});

//mamafa fichier
fs.unlink('nom anle fichier', function (err) {
    //err mis n erreur
});

//mrenommer fichier
fs.rename('nom anle fichier o renomena', 'nom vaovao', function (err) {
    if (err) throw err;
    //err mis n erreur
});*/


//formidable
//exemple
app.post('/uploader', (req, res) => {
    let form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;            //filetoupload = attribut name nomena anle input file na anarany anty post
      var newpath = './uploads/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        console.log('File uploaded and moved!');
      });
    });

});
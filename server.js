const express = require('express');
const app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// +++++++++++++ MONGO DB ++++++++++++++
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/acomodadoresdb', 
    {
        useMongoClient: true
    });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("We are connected to Acomodadores Database");
    app.listen(3000, function () {
        console.log('listening on 3000')
    })

});

var usherSchema = mongoose.Schema({
    ci: {
     type:Number,
     required: [true, 'Cédula es obligatorio']
    },
    names:String,
    lastnames: String,
    congregation: String,
    congregationNumber: Number,
    circuitNumber: Number,
    captain: Boolean,
    internalUsher: Boolean,
    parkingUsher: Boolean,
    preventiveWatch: Boolean,
    assignedTo: String,
    observations: String,
    email: String
});
var Usher = mongoose.model('Usher', usherSchema);
/* var acomodador1 = new Usher({
    ci:16357867,
    names: 'Prueba'
})
console.log(acomodador1.names)
acomodador1.save(function (err, acomodador1) {
    if (err){
        return console.error(err);
    };
}); */
////////////////////////////////////////////
app.get('/', function (request, response) {
    // do something here
    response.send({response : 'hello world'})
})


// Get all Ushers
app.get('/acomodadores/getall', function (request, response) {
    // do something here
    // find all usher
    var query = Usher.find({}).exec(function (err, ushers) {
        if (err) {
            return handleError(err);
        };
        //console.log(ushers);
        response.send(ushers)
    })

})

// Get all Ushers
app.get('/acomodadores/getone/:ci', function (request, response) {
    // do something here
    // find all usher
    var query = Usher.find({ci:request.params.ci}).exec(function (err, usher) {
        if (err) {
            return handleError(err);
        } else if (usher.length > 0) {
            // Uhsher found, return it
            response.send(usher);
        } else {
            response.send({warning : "No usher was found with this CI"})
        }
    })

})

// Add Usher
app.post('/acomodadores/add', function (request, response) {
    // do something here
    // Add usher
    // Construct the usher
    var newUsher = new Usher({
        ci: request.body.ci,
        names: request.body.names,
        lastnames: request.body.lastnames,
        congregation: request.body.congregation,
        congregationNumber: request.body.congregationNumber,
        circuitNumber: request.body.circuitNumber,
        captain: request.body.captain,
        internalUsher: request.body.internalUsher,
        parkingUsher: request.body.parkingUsher,
        preventiveWatch: request.body.preventiveWatch,
        assignedTo: request.body.assignedTo,
        observations: request.body.observations,
        email: request.body.email
    })

    // Search for a existent usher with a same ci
    var query = Usher.findOne({ci : newUsher.ci}).exec(function (err, results) {
        if (err) {
            return handleError(err);
        } else if (results){
            // If exists, then twrow error
            response.status(403);
            response.send({error: 'El número de CI ya existe'})
        } else {
            // Else, save the new user
            newUsher.save(function (err, newUsher) {
                if (err) {
                    return console.error(err);
                } else {
                    response.send({success: "New Usher saved"});
                }
            })
        }
    })
})


// Add Usher
app.put('/acomodadores/edit/:ci', function (request, response) {
    // do something here
    // Find the  usher
    var query = Usher.findOne({ ci: request.params.ci }).exec(function (err, results) {
        if (err) {
            // Error handle
            return handleError(err);
        } else if (results) {
            // User has been found, save edits
            // Construct the usher
            var newUsher = new Usher({
                names: request.body.names,
                lastnames: request.body.lastnames,
                congregation: request.body.congregation,
                congregationNumber: request.body.congregationNumber,
                circuitNumber: request.body.circuitNumber,
                captain: request.body.captain,
                internalUsher: request.body.internalUsher,
                parkingUsher: request.body.parkingUsher,
                preventiveWatch: request.body.preventiveWatch,
                assignedTo: request.body.assignedTo,
                observations: request.body.observations,
                email: request.body.email
            })    

            var newUsherObj = newUsher.toObject();
            delete newUsherObj._id;        

            var query = Usher.update({ ci: request.params.ci }, newUsherObj, { upsert: true }, function (err) {
                if (!err) {
                    response.send({success : "Usher was updated"});
                } else {
                    console.log(err);
                    response.send(404, { error: "Usher was not updated." });
                }

            })
        } else {
            //No user has been found 
            response.send({ warning: "No usher has been found to update" });
        }
    })
})


var express = require('express');
var router = express.Router();
var request = require("request");
var fs = require('fs');

var services = {},
    services_path = process.cwd() + '/services';

fs.readdirSync(services_path).forEach(function(file) {
    if (file.indexOf('.js') != -1) {
        services[file.split('.')[0]] = require(services_path + '/' + file)
    }
})

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Taxifinder'
    });
});

router.get('/taxis', function(req, res, next) {
    var resultats;
    request({
        uri: "https://dev.api.taxi/taxis/?lon=2.3488000&lat=48.8534100",
        method: "GET",
        headers: {
            'accept': "application/json",
            "x-version": 2,
            "x-api-key": "46f06ed1-0124-4edc-9283-0df69a604ef4"
        }
    }, function(error, response, body) {
        //a faire si besoin de parser plus finement
        /*services.le_taxi_parser.parse(resultats);*/
        /*console.log(body);*/
        res.render('results', JSON.parse(body));
    });

});

router.get('/hails/:idTaxi', function(req, res, next) {
    console.log(req.params.idTaxi);
    res.render('hails', {taxi:req.params.idTaxi});
    var resultat;
    request({
        uri: "https://dev.api.taxi/hails/",
        method: "POST",
        headers: {
            'accept': "application/json",
            "x-version": 2,
            "x-api-key": "46f06ed1-0124-4edc-9283-0df69a604ef4"
        },
        form: {
            payload: {
                "data": [{
                    "customer_address": "string",
                    "customer_id": "string",
                    "customer_lat": 0,
                    "customer_lon": 0,
                    "customer_phone_number": "string",
                    "operateur": "string",
                    "taxi_id": req.params.idTaxi
                }]
            }
        }
    }, function(error, response, body) {
        //l'api sur la route /hails ne fonctionne pas du coup on renvoie autre chose
        console.log(body);
        //api hail ne fonctionne pas, donc on simule un résultat
        //*res.render('hails', {taxi:req.params.idTaxi});
    });
    
});

module.exports = router;

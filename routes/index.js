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
        res.render('results', JSON.parse(body));
    });

});


module.exports = router;

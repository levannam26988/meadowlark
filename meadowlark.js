var express = require('express');
var fortune = require('./lib/fortune.js');
var bodyParser = require('body-parser');
const os = require('os');

var app = express();

var tours = [
    { id: 0, name: 'Hood River', price: 99.99 },
    { id: 1, name: 'Oregon Coast', price: 149.95 },
];

// set up handlebars view engine
var handlebars = require('express3-handlebars')
    .create({
        defaultLayout:'main',
        helpers: {
            section: function(name, options){
                if(!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            }
        }
    });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
// console.log(os.userInfo());
//console.log(os.type());

function getWeatherData(){
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://wwww.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ]
    };
};

app.use(function(req, res, next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = getWeatherData();
    next();
});

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.get('/', function(req, res){
    let uptime = os.uptime();
    let hours = (uptime - (uptime % 3600)) / 3600;
    let minutes = ((uptime -hours* 3600) - (uptime - hours * 3600) % 60) / 60;
    let seconds = uptime - hours * 3600 - minutes * 60;
    var obj = {hours: hours, minutes: minutes, seconds: seconds};    
    res.render('home', obj);
    //console.log(req.body);
});

app.get('/product', (req, res)=>{
    var product = {
        currency: {
            name: 'United States dollars',
            abbrev: 'USD'
        },
        tours: [
            {name: 'Hood River', price: '$99.95'},
            {name: 'Oregon Coast', price: '$159.5'},
        ],
        specialsUrl: '/january-specials',
        //currencies: ['USD', 'GBP', 'BTC'],
        currencies: ['VND', 'JPY', 'EUR'],        
    };
    res.render('product', product);
})
app.get('/about', function(req, res){
    
    res.render('about', { 
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
     });
});

app.get('/tours/hood-river', function(req, res){
    res.render('tours/hood-river');
});
app.get('/tours/request-group-rate', function(req, res){
    res.render('tours/request-group-rate');
});
app.get('/signup', function(req, res){
    res.render('tours/signup');
});

app.get('/headers', function(req,res){
    res.set('Content-type','text/plain');
    var s='';
    for(var name in req.headers) s+= name + ': ' + req.headers[name] + '\n';
    res.send(s);
    //console.log(req.headers);
});

app.get('/greeting', function(req, res){    
    console.log(req);
    res.render('about', {
        message: 'welcome',
        style: req.query.foo,
        layout: null
        //userid: req.cookie.userid,
        //username: req.session.username,
    });
});

app.get('/test', function(req, res){
    res.type('text/plain');
    res.location('http://example.com');
    res.send('This is a test.');
});

app.get('/thank-you', function(req, res) {
    res.render('thank-you');
});

app.get('/api/tours', function(req, res) {
    //res.json(tours);
    var toursXml = '<?xml version="1.0"?><tours>' +
        tours.map(function(p) {
            return '<tour price="' + p.price +
                '" id="' + p.id + '">' + p.name + '</tour>';
        }).join('') + '</tours>';
    var toursText = tours.map(function(p) {
        return p.id + ': ' + p.name + ' (' + p.price + ')';
    }).join('\n');
    //console.log(toursXml);
    //console.log(toursText);
    res.format({
        'application/json': function() {
            res.json(tours);
        },
        'application/xml': function() {
            res.type('application/xml');
            res.send(toursXml);
        },
        'text/xml': function(){
            res.type('text/xml');
            res.send(tousXml);
        },
        'text/plain': function(){
            res.type('text/plain');
            res.send(toursText);
        }
    });
});

app.get('/jquery-test', function(req, res){
    res.render('jquery-test');
});

app.get('/nursery-rhyme', function(req, res){
    res.render('nursery-rhyme');
});

app.get('/data/nursery-rhyme', function(req, res){
    res.json({
        animal: 'squirrel',
        bodyPart: 'tail',
        adjective: 'bushy',
        noun: 'heck',
    });
});

app.post('/post', function(req, res) {
    console.log('Received contact from ' + req.body.name + 
        ' <' + req.body.email + '>');
    //res.redirect(303, '/thank-you');
    res.send('POST request to homepage');
});

app.put('/api/tour/:id', function(req, res) {
    /*
    var p = tours.some(function(p) {
        return p.id == req.params.id
    });
    if (p) {
        if(req.query.name) p.name = req.query.name;
        if(req.query.price) p.price = req.query.price;
        res.json({success: true});
    } else {
        res.json({error: 'No such tour exists.'});
    }
    */
   res.send('PUT request to hompage.');
});

app.get('/api/tour/:id', function(req, res){
    var i;
    for( var i=tours.length-1; i>=0; i--)
        if( tours[i].id == req.params.id ) break;
    if( i>=0 ) {
        tours.splice(i, 1);
        res.json({success: true});
    } else {
        res.json({error: 'No such tour exists.'});
    }
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});
// 404 catch-all handler (middleware)
app.use(function(req, res, next){
    //console.log(req);
    res.status(404);
    res.render('404');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + 
     app.get('port') + '; press Ctrl-C to terminate.');
});
var express = require('express');
var fortune = require('./lib/fortune.js');
var bodyParser = require('body-parser');

var app = express();

var tours = [
    { id: 0, name: 'Hood River', price: 99.99 },
    { id: 1, name: 'Oregon Coast', price: 149.95 },
];

// set up handlebars view engine
var handlebars = require('express3-handlebars')
    .create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
/*
app.use(function (req, res) {
    res.setHeader('content-Type', 'text/plain');
    res.write('you posted:\n');
    res.end(JSON.stringify(req.body, null, 2));
});

app.get('/about', function(req, res){
    res.type('text/plain');
    res.send('About Meadowlark Travel');
});

// custom 404 page
app.use(function(req, res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

// custom 500 page
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

*/
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.get('/', function(req, res){
    res.render('home');
    //console.log(req.body);
});
app.get('/about', function(req, res){
    //var randomFortune = 
    //    fortunes[Math.floor(Math.random() * fortunes.length)];
    //console.log(randomFortune);
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
    console.log(req);
    res.status(404);
    res.render('404');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + 
     app.get('port') + '; press Ctrl-C to terminate.');
});
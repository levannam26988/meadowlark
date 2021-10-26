var express = require('express');
var fortune = require('./lib/fortune.js');

var app = express();

/*var fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple."
];*/

// set up handlebars view engine
var handlebars = require('express3-handlebars')
    .create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

/*
app.get('/', function(req, res){
    res.type('text/plain');
    res.send('Meadowlark Travel');
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
    //console.log(req);
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

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + 
     app.get('port') + '; press Ctrl-C to terminate.');
});
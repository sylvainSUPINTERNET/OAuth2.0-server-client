var express = require('express');
var request = require('request'); //for repo
var app = express();
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;


passport.use(new GithubStrategy({
        clientID: "e401ad347b08e4a2ac6e",
        clientSecret: "71c16a847ad57fd808c1191f350a403a10deceb5",
        callbackURL: "http://localhost:4000/auth/github/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        // placeholder for translating profile into your own custom user object.
        // for now we will just use the profile object returned by GitHub
        return done(null, profile);
    }
));

// Express and Passport Session
var session = require('express-session');
app.use(session({secret: "ThisISsOOOOOsecret"}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    // placeholder for custom user serialization
    // null is for errors
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    // placeholder for custom user deserialization.
    // maybe you are getoing to get the user from mongo by id?
    // null is for errors
    done(null, user);
});

// we will call this to start the GitHub Login process
app.get('/auth/github',
    passport.authenticate('github', {scope: ['public_repo']}));

// GitHub will call this URL
app.get('/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/'}),
    function (req, res) {
        res.redirect('/');
    });

app.get('/', function (req, res, next) {

    var html = "<script src='node_modules/jquery/dist/jquery.min.js'></script>";
    html += "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>"
    html += "<script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'integrity='sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa'crossorigin='anonymous'></script>"
    // html += "<ul><li><a href='/auth/github'>GitHub</a></li> <li><a href='/logout'>logout</a></li></ul>";

    html += "<nav class='navbar navbar-default'> <div class='container-fluid'><div class='navbar-header'> <button type='button' class='navbar-toggle collapsed' data-toggle='collapse'data-target='#bs-example-navbar-collapse-1' aria-expanded='false'> <span class='sr-only'>Toggle navigation</span> <span class='icon-bar'></span> <span class='icon-bar'></span> <span class='icon-bar'></span> </button> <a class='navbar-brand' href='http://localhost:4000'>OAuth 2.0 Github</a> </div> <div class='collapse navbar-collapse' id='bs-example-navbar-collapse-1'> <ul class='nav navbar-nav'> <li class=''> <a href='/auth/github' class=''  role='button' aria-haspopup='true'aria-expanded='false'>Connection via github</a><li><a href='/logout'>Deconnexion</a></li></ul> </li> </ul> </div> </div> </nav>";


    // dump the user for debugging
    if (req.isAuthenticated()) {
        //console.log(req.user);


        html += "<div class='row'> <div class='col-sm-9 col-md-4'> <div class='thumbnail'> <img style='width: 240px;height: 240px;' src=" + req.user.photos[0].value + " alt=''> <div class='caption'> <h3>" + req.user.username + "</h3> <p><a href=" + req.user.profileUrl + " target='_blank' >Profile Github</a></p> </div> </div> </div><a href='/showRepos' type='button' class='btn btn-success'>Show all repos</a></div>";

    }
    res.write(html);
    res.end();
});


app.get('/showRepos',function(req,res){ //Only if connected !!!
    if (req.isAuthenticated()) {
        //recuperer la liste des repos de l'utilisateur
        var urlsRepos = req.user._json.repos_url; //url du json de tous les repo
        //console.log(urlsRepos);

        var options = { //else 403
            headers: {'user-agent': 'node.js'}
        };

        request(urlsRepos, options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log(body); // show list of repo
                //console.log(JSON.parse(body));



                var reposData = "";

                reposData = "<script src='node_modules/jquery/dist/jquery.min.js'></script>";
                reposData += "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>"
                reposData += "<script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'integrity='sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa'crossorigin='anonymous'></script>"
                reposData += "<nav class='navbar navbar-default'> <div class='container-fluid'><div class='navbar-header'> <button type='button' class='navbar-toggle collapsed' data-toggle='collapse'data-target='#bs-example-navbar-collapse-1' aria-expanded='false'> <span class='sr-only'>Toggle navigation</span> <span class='icon-bar'></span> <span class='icon-bar'></span> <span class='icon-bar'></span> </button> <a class='navbar-brand' href='http://localhost:4000'>OAuth 2.0 Github</a> </div> <div class='collapse navbar-collapse' id='bs-example-navbar-collapse-1'> <ul class='nav navbar-nav'> <li class=''> <a href='/auth/github' class=''  role='button' aria-haspopup='true'aria-expanded='false'>Connection via github</a><li><a href='/logout'>Deconnexion</a></li></ul> </li> </ul> </div> </div> </nav>";
                var data = JSON.parse(body);
                for (var i = 0; i < data.length; i++) {
                    // console.log(data[i].name);
                    // console.log(data[i].description);
                    // console.log(data[i].html_url);
                    // console.log("__________");

                    /*
                    reposData += "<ul><li>Name : " + data[i].name + "</li></ul>";
                    reposData += "<ul><li>Description : " + data[i].description + "</li></ul>";
                    reposData += "<ul><li>Lien : " + data[i].html_url + "</li></ul>";
                    reposData += "<br><br>";
                    */


                    reposData += "<div class='list-group'> <h3>"+ data[i].name + "</h3> <p class='list-g    roup-item'>" + data[i].description + "</p> <a href=" + data[i].html_url + " class='list-group-item'>" + data[i].html_url + "</a><br><br> </div>";
                    // console.log(reposData);


                }
            }
            else {
                console.log("Error " + response.statusCode);
            }
            res.send(reposData);

        });
    }else{
        res.redirect('/')
    }
});

app.get('/logout', function (req, res) {
    console.log('logging out');
    req.logout();
    res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/')
}

app.get('/protected', ensureAuthenticated, function (req, res) {
    res.send("acess granted");
});


var server = app.listen(4000, function () {
    console.log('Example app listening at http://%s:%s',
        server.address().address, server.address().port);
});

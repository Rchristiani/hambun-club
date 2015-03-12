var express = require('express');
var bodyParse = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var cookies = require('cookie-parser');

var app = express();
var api = require('./api/index.js');

var TwitterStrategy = require('passport-twitter').Strategy;

app.use(cookies());

app.use(session({  
		secret: 'hambun club',
		resave: true,
    	saveUninitialized: true
	})
);
app.use(bodyParse.json());
//Passport stuff here
app.use(passport.initialize());

app.use(passport.session());

passport.use(api.twitterLogin);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(function(req,res,next) {
	if(req.isAuthenticated()) {
		var user = {
			name: req.user.user,
			image: req.user.image
		};
		res.cookie("hambun-login", JSON.stringify(user), { maxAage:120000, httpOnly: false });
	}
	else {
		res.cookie("hambun-login", "false", { maxAage:120000, httpOnly: false });
	}
	next();
});

app.use(express.static('public'));

app.get('/api/buns', api.getBuns);

app.post('/api/buns', api.createBun);

app.post('/api/buns/delete', api.deleteBun);

app.post('/api/buns/edit', api.editBun);

app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get(
	'/auth/twitter/callback', 
	passport.authenticate('twitter', 
	{ 
		successRedirect: '/',
		failureRedirect: '/login' 
	})
);

app.get('api/getUser', api.getUser);


app.listen('4005');


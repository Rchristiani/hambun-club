var twitter = require('./twitterkey.js');
var TwitterStrategy = require('passport-twitter').Strategy;

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ham_bun');

var ItemSchema = new mongoose.Schema({
	name: 'string',
	item: 'string',
	date: 'string'
});

var itemModel = mongoose.model('items',ItemSchema);

var UserSchema = new mongoose.Schema({
	user: 'string',
	image: 'string'
});

var userModel = mongoose.model('users', UserSchema);

function getBuns(req,res) {
	itemModel.find({},function(err,docs) {
		res.send(docs);
	});
}

function createBun(req, res) {
	var model = req.body;
	new itemModel(model.model).save(function(err,doc) {
		if(err) {
			res.send(err);
		}
		else res.send(doc);
	});
};

function deleteBun(req, res) {
	var id = req.body.id;
	itemModel.findOne({_id: id}, function(err, doc) {
		doc.remove(function(err, status){
			res.send({status: 'success'});
		});
	});
}

function editBun(req,res) {
	var model = req.body.model;
	itemModel.where({_id:model._id}).update(model,function(err,doc) {
		if(err) {
			res.send({status: 'error'});
		}
		else {
			res.send({status: 'success'});
		}
	});
}

var twitterLogin = new TwitterStrategy({
    consumerKey: twitter.key,
    consumerSecret: twitter.secret,
    callbackURL: "http://localhost:4005/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
  	userModel.find({name: profile.name}, function(err,doc) {
  		if(err) {
  			done(err);
  		}
  		if(doc.length === 0) {
  			new userModel({
  				user: profile.username,
  				image: profile.photos[0].value
  			}).save(function(err,user) {
  				if(err) {
  					done(err);
  				}
  				else {
  					done(null, user);
  				}
  			});
  		}
  		else {
  			done(null,doc);
  		}
  	});
  }
);

module.exports = {
	getBuns : getBuns,
	createBun: createBun,
	deleteBun: deleteBun,
	editBun: editBun,
	twitterLogin: twitterLogin
};
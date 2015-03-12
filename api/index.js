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
	image: 'string',
	token: 'string'
});

var userModel = mongoose.model('users', UserSchema);

function getBuns(req,res) {
	itemModel.find({},function(err,docs) {
		res.send(docs);
	});
}

function createBun(req, res) {
	var model = req.body;
	if(req.isAuthenticated()) {
		new itemModel(model.model).save(function(err,doc) {
			if(err) {
				res.send({status: err});
			}
			else res.send(doc);
		});
	}
	else {
		res.send({
			status: 'error',
			message: 'Please login to add an item.'
		});
	}
};

function deleteBun(req, res) {
	var id = req.body.id;
	if(req.isAuthenticated()) {
		itemModel.findOne({_id: id}, function(err, doc) {
			doc.remove(function(err, status){
				res.send({status: 'success'});
			});
		});
	}
	else {
		res.send({
			status: 'error',
			message: 'Please login to delete an item.'
		});
	}
}

function editBun(req,res) {
	var model = req.body.model;
	if(req.isAuthenticated()) {
		itemModel.where({_id:model._id}).update(model,function(err,doc) {
			if(err) {
				res.send({status: 'error'});
			}
			else {
				res.send({status: 'success'});
			}
		});
	}
	else {
		res.send({
			status: 'error',
			message: 'Please login to edit an item.'
		});
	}
}

var twitterLogin = new TwitterStrategy({
		consumerKey: twitter.key, 
		consumerSecret: twitter.secret,
		callbackURL: twitter.callback
	},
	function(token, tokenSecret, profile, done) {
		userModel.find({user: profile.username}, function(err,doc) {
			if(err) {
				done(err);
			}
			if(doc.length === 0) {
				new userModel({
					user: profile.username,
					image: profile.photos[0].value,
					token: token
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
				done(null,doc[0]);
			}
		});
	}
);


function getUser(req,res) {

}

module.exports = {
	getBuns : getBuns,
	createBun: createBun,
	deleteBun: deleteBun,
	editBun: editBun,
	twitterLogin: twitterLogin,
	getUser : getUser
};
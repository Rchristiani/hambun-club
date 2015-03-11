var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ham_bun');

var ItemSchema = new mongoose.Schema({
	name: 'string',
	item: 'string',
	date: 'string'
});

var itemModel = mongoose.model('items',ItemSchema);

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

module.exports = {
	getBuns : getBuns,
	createBun: createBun,
	deleteBun: deleteBun
};
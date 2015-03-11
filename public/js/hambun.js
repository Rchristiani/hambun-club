var app = angular.module('HamBun', []);

app.controller('BunController', function($scope,Buns) {
	Buns.getBuns().then(function(res) {
		$scope.items = res;
	});
	$scope.addNew = function() {
		var model = {
			name: $('.name').val(),
			item: $('.item').val()
		};
		Buns.postBuns(model).then(function(res) {
			$scope.items.unshift(res);
		});
	};
	$scope.edit = function() {
		var item = this.item;
		console.log(this);
	}
	$scope.delete = function($index) {
		var item = $scope.items[$index];
		Buns.delete(item._id).then(function(res) {
			if(res.status === 'success') {
				$scope.items.splice($index,1);
			}
		});
	}
});

app.factory('Buns', function($http,$q) {
	var url = "http://localhost:4005";

	return {
		getBuns: function() {
			var def = $q.defer();
			$http.get(url+'/api/buns')
				.success(def.resolve);

			return def.promise;
		},
		postBuns: function(model) {
			var def = $q.defer();
			$http.post(url+'/api/buns',{model:model})
				.success(def.resolve);

			return def.promise;
		},
		delete: function(id) {
			var def = $q.defer();
			$http.post(url+'/api/buns/delete',{id: id})
				.success(def.resolve);

			return def.promise;
		}
	}
});

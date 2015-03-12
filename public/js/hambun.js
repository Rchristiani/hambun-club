var app = angular.module('HamBun', ['ngCookies']);

app.filter('reverse', function () {
	return function (items) {
		if (!angular.isArray(items)) {
			return false;
		}
		return items.slice().reverse();
	};
});

app.controller('BunController', function($scope,Buns,$cookies) {
	var user = $cookies['hambun-login'];
	if(user !== undefined && user !== 'false') {
		$scope.loggedin = true;
		$scope.user = JSON.parse(user);
	}
	Buns.getBuns().then(function(res) {
		$scope.items = res;
	});
	
	$scope.addNew = function() {
		var model = {
			name: $('.name').val(),
			item: $('.item').val()
		};
		Buns.postBuns(model).then(function(res) {
			if(res.status !== 'error') {
				$scope.items.push(res);
				$('.name').val('');
				$('.item').val('');
			}
		});
	};
	
	$scope.edit = function(e) {
		var index = this.$index;
		var $el = $(e.target);
		var $elParent= $el.parent().parent();
		$scope.items[index].editing = true;
		$elParent.find('.name').addClass('editing').attr('contentEditable','true');
		$elParent.find('.item').addClass('editing').attr('contentEditable','true');
	};
	
	$scope.save = function(e) {
		var index = this.$index;
		$scope.items[index].editing = false;
		var $el = $(e.target);
		var $elParent= $el.parent().parent();
		var model = {
			_id: this.item._id,
			name:  $elParent.find('.name').text(),
			item: $elParent.find('.item').text()
		};
		$elParent.find('.name').removeClass('editing').removeAttr('contentEditable');
		$elParent.find('.item').removeClass('editing').removeAttr('contentEditable');
		
		Buns.edit(model).then(function(res) {
			if(res.status === 'success') {
				$scope.items[index].editing = false;
			}
		});
	};

	$scope.delete = function($index) {
		var item = $scope.items[$index];
		Buns.delete(item._id).then(function(res) {
			if(res.status === 'success') {
				$scope.items.splice($index,1);
			}
		});
	};
});

app.factory('Buns', function($http,$q) {
	var url = (function() {
		return document.location.origin;
	})();
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
		},
		edit: function(model) {
			var def = $q.defer();
			$http.post(url+'/api/buns/edit',{model:model})
				.success(def.resolve);

			return def.promise;
		}	
	}
});

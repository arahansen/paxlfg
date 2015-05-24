var app = angular.module("paxlfg", ['ui.router', 'ngCookies']);



app.factory('groupFactory', ["$http", "$q", "$location", "userFactory", function($http, $q, $location, userFactory) {
	var currentGroup = '';
	var id = 0;
	var groups = [];
	var deferred = $q.defer();

	var addGroup = function(group) {
		$http.post('/groupList', group).success(function(data) {
			// when we add a group, that group should be set to the current group
			setCurrentGroup(data);	
		})
		.then(function() {
			$location.path('/groupCreated');
		});

	}	

	function updateGroup(group) {
		// TODO update existing db entry with updated group info
		
	}

	var async = function() {
		return $http.get('/groupList');
	}

	var getGroups = function() {
		return groups;
	}

	var getCurrentGroup = function() {
		return currentGroup;
	}

	var getGroupInfo = function(id) {
		var groups;
		var test = async().then(function(d) {
			groups = d.data;
			
			angular.forEach(groups, function(group, index) {
		
				if (group._id == id) {
					
					return group;
				}
			});

		});
		console.log(test);
	}

	var setCurrentGroup = function(group) {
		currentGroup = group || '';
	};

	return {
		addGroup: addGroup,
		async: async,
		getGroups: getGroups,
		getCurrentGroup: getCurrentGroup,
		getGroupInfo: getGroupInfo
	}
});

app.factory("locationFactory", function() {
	var dummyLocations = [
		"Room 1",
		"Room 2",
		"Room 3"

	]

	var getLocations = function() {
		return dummyLocations;
	}

	return {
		getLocations: getLocations
	}
});


app.factory("userFactory", ["$http", "$q", function($http, $q) {
	var deferred = $q.defer();
	function thisUserCreated(id) {
		$http.get('/userCreated/' + id).success(function(data) {
			deferred.resolve(data);
			// returns boolean indicating whether the current user has the proper cookie 
			// saying this user created the given group
			
		});
		return deferred.promise;
	};

	return {
		thisUserCreated: thisUserCreated
	}
}]);


app.config(["$stateProvider", "$urlRouterProvider", "$compileProvider" function($stateProvider, $urlRouterProvider, $compileProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

	$urlRouterProvider.otherwise('/browse');

	$stateProvider
		.state('create', {
			url: '/create',
			templateUrl: "create.html",
			controller: "CreateController"
		})
		.state('browse', {
			url: '/browse',
			templateUrl: "browse.html",
			controller: "BrowseController"
		})
		.state('groupCreated', {
			url: '/groupCreated',
			templateUrl: "groupCreated.html",
			controller: "GroupCreatedController"

		})
		.state('groupInfo', {
			url: 'group/:groupId',
			templateUrl: "groupInfo.html",
			controller: "GroupInfoController"
		})

		.state('editGroup', {
			url: 'editGroup/:groupId',
			templateUrl: "editGroup.html",
			controller: "EditGroupController"
		})

}]);
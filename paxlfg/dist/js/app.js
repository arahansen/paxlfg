var __dbUrl = 'http://localhost:1337';


var app = angular.module("paxlfg", ['ui.router']);

app.controller("HomeController", ["$scope", function($scope) {
	
}]);

app.controller("CreateController", ["$scope", "groupFactory", "locationFactory", function($scope, groupFactory, locationFactory) {
	$scope.email = '';
	$scope.phoneNumber = '';
	$scope.additionalInfo = '';
	$scope.enterCustomGame = false;
	$scope.group = '';
	$scope.games = [
		{id: 1, game: 'cardsAgainstHumanity', displayName: 'Cards Against Humanity'},
		{id: 2, game: 'dungeonsAndDragons', displayName: 'Dungeons & Dragons'},
		{id: 3, game: 'zombieDice', displayName: 'Zombie Dice'},
		{id: 4, game: 'pathfinder', displayName: 'Pathfinder'},
	]

	$scope.locations = locationFactory.getLocations();

	// set a default selected game
	$scope.selectedGame = $scope.games[0];
	$scope.selectedLocation = $scope.locations[0];



	$scope.startGroup = function() {

		var groupId = groupFactory.generateId();
		group = {
			id: groupId,
			hostName: $scope.hostName,
			game: $scope.selectedGame,
			currentPlayers: $scope.currentPlayers,
			playersNeeded: $scope.playersNeeded,
			email: $scope.email,
			phoneNumber: $scope.phoneNumber,
			additionalInfo: $scope.additionalInfo,
			startTime: $scope.startTime

		}
		if ( $scope.enterCustomGame) {
			group.game = {
				game: $scope.selectedGame.replace(" ", ""),
				displayName: $scope.selectedGame
				
			}
		}

		groupFactory.addGroup(group);
		

	}

	$scope.clearSelectedGame = function() {
		$scope.selectedGame = '';
	}

	$scope.clearSelectedLocation = function() {
		$scope.selectedLocation = '';
	}

	$scope.validatePhoneNumber = function() {

	}

}]);

app.controller("GroupCreatedController", ["$scope", "groupFactory", function($scope, groupFactory) {

	$scope.thisGroup = groupFactory.getCurrentGroup();
	console.log($scope.thisGroup);
}]);

app.controller("BrowseController", ["$scope", "groupFactory", function($scope, groupFactory) {
	// pulls current list of groups from db
	groupFactory.async().then(function(d) {
		$scope.groups = d.data;
	});


}]);

app.controller("GroupInfoController", ["$scope", "$stateParams", "groupFactory", function($scope, $stateParams, groupFactory){
	var groups = [];
	$scope.group = '';

	groupFactory.async().then(function(d) {
		groups = d.data;
		angular.forEach(groups, function(group, index) {
	
		if (group._id == $stateParams.groupId) {
			$scope.group = group;
			return;
		}
	});



	});
	
	
}]);

app.factory('groupFactory', function($http, $q) {
	var currentGroup = '';
	var id = 0;
	var groups = [];
	var deferred = $q.defer();

	var addGroup = function(group) {
		$http.post('/groupList', group).success(function(data) {
			setCurrentGroup(data);	
		});

	}	

	var async = function() {
		return $http.get('/groupList');
	}

	var getGroups = function() {
		return groups;
	}

	var generateId = function() {
		return id++;
	}

	var getCurrentGroup = function() {
		return currentGroup;
	}

	var getGroupById = function(id) {
		var singleGroup = '';
		$http.get('/groupList/' + id).success(function(data) {
			singleGroup = data;
		});
		return singleGroup;
	}

	var setCurrentGroup = function(group) {
		currentGroup = group || '';
	}

	return {
		addGroup: addGroup,
		async: async,
		getGroups: getGroups,
		getGroupById: getGroupById,
		generateId: generateId,
		getCurrentGroup: getCurrentGroup,
		setCurrentGroup: setCurrentGroup
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

app.directive("primaryButtonType", function() {
	return {
		restrict: 'E',
		require: '^ui-sref',
		transclude: true,
		template: '<a class="btn btn-default" role="button">{{text}}</a>'
	}
});

app.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
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

});
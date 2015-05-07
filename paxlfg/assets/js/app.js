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
		$scope.group = {
			id: groupId,
			hostName: $scope.hostName,
			game: $scope.selectedGame,
			currentPlayers: $scope.currentPlayers,
			playersNeeded: $scope.playersNeeded,
			email: $scope.email,
			phoneNumber: $scope.phoneNumber,
			additionalInfo: $scope.additionalInfo

		}
		if ( $scope.enterCustomGame) {
			$scope.group.game = {
				game: $scope.selectedGame.replace(" ", ""),
				displayName: $scope.selectedGame
				
			}
		}

		groupFactory.addGroup($scope.group);
		

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
}]);

app.controller("BrowseController", ["$scope", "groupFactory", function($scope, groupFactory) {
	$scope.groups = groupFactory.getGroups();

}]);

app.controller("GroupInfoController", ["$scope", "$stateParams", "groupFactory", function($scope, $stateParams, groupFactory){
	$scope.group = '';
	var groups = groupFactory.getGroups();
	console.log(groups);
	angular.forEach(groups, function(group, index) {
		console.log(group.id + " " + $stateParams.groupId);
		if (group.id == $stateParams.groupId) {
			$scope.group = group;
			return;
		}
	});
}]);

app.factory('groupFactory', function() {
	var currentGroup = '';
	var id = 0;
	var dummyData = [
		{id:999, game: {game:"myGame",displayName:"My Game"}, email: "name@email.com", phoneNumber:"(123)456-7890", additionalInfo:"Come play with us!", hostName: "Smitty"},
		{id:998, game: {game:"myOtherGame",displayName:"My Other Game"}, email: "name2@email.com", phoneNumber:"(425)456-7890", additionalInfo:"Play some gamezz!", hostName: "Smitty"}
	]
	var groups = [];
	groups.push(dummyData[0]);
	groups.push(dummyData[1]);

	var addGroup = function(newGame) {
		groups.push(newGame);
		currentGroup = newGame;

	}

	var getGroups = function() {
		return groups;
	}

	var generateId = function() {
		return ++id;
	}

	var getCurrentGroup = function() {
		return currentGroup;
	}

	return {
		addGroup: addGroup,
		getGroups: getGroups,
		generateId: generateId,
		getCurrentGroup: getCurrentGroup
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

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: "home.html",
			controller: "HomeController"
		})
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
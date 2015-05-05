var app = angular.module("paxlfg", ['ui.router']);

app.controller("HomeController", ["$scope", function($scope) {
	
}]);

app.controller("CreateController", ["$scope", "groupFactory", function($scope, groupFactory) {
	$scope.email = '';
	$scope.phoneNumber = '';
	$scope.additionalInfo = '';
	$scope.games = [
		{id: 1, game: 'cardsAgainstHumanity', displayName: 'Cards Against Humanity'},
		{id: 2, game: 'dungeonsAndDragons', displayName: 'Dungeons & Dragons'},
		{id: 3, game: 'zombieDice', displayName: 'Zombie Dice'},
		{id: 4, game: 'pathfinder', displayName: 'Pathfinder'},
	]
	// set a default selected game
	$scope.selectedGame = $scope.games[0];

	$scope.startGroup = function() {
		element.find('#startGroup').attr('disabled', 'disabled');
		var group = {
			game: $scope.selectedGame,
			email: $scope.email,
			phoneNumber: $scope.phoneNumber,
			additionalInfo: $scope.additionalInfo

		}

		groupFactory.addGroup(group);
		console.log(group);
	}

	$scope.clearSelectedGame = function() {
		$scope.selectedGame = '';
	}

	$scope.validatePhoneNumber = function() {

	}

}]);

app.controller("BrowseController", ["$scope", function($scope) {

}]);

app.factory('groupFactory', function() {
	var group = [];

	var addGroup = function(newGame) {
		group.push(newGame);
	}

	return {
		addGroup: addGroup
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
			
		})

});
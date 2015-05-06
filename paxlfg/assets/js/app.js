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
		//element.find('#startGroup').attr('disabled', 'disabled');
		var group = {
			hostName: $scope.hostName,
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

app.controller("BrowseController", ["$scope", "groupFactory", function($scope, groupFactory) {
	$scope.groups = groupFactory.getGroups();

}]);

app.controller("GroupInfoController", ["$scope", "$stateParams", "groupFactory", function($scope, $stateParams, groupFactory){
	$scope.group = '';
	var groups = groupFactory.getGroups();
	console.log(groups);
	for (group in groups) {
		console.log(group[0]);
		if (group.id === $stateParams.groupId) {
			$scope.group = group;

		}
	}
}]);

app.factory('groupFactory', function() {
	var dummyData = [
		{id:999, game: {game:"myGame",displayName:"My Game"}, email: "name@email.com", phoneNumber:"(123)456-7890", additionalInfo:"Come play with us!", hostName: "Smitty"},
		{id:998, game: {game:"myOtherGame",displayName:"My Other Game"}, email: "name2@email.com", phoneNumber:"(425)456-7890", additionalInfo:"Play some gamezz!", hostName: "Smitty"}
	]
	var groups = [];
	groups.push(dummyData[0]);
	groups.push(dummyData[1]);

	var addGroup = function(newGame) {
		groups.push(newGame);
	}

	var getGroups = function() {
		return groups;
	}

	return {
		addGroup: addGroup,
		getGroups: getGroups
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
		.state('groupInfo', {
			url: 'group/:groupId',
			templateUrl: "groupInfo.html",
			controller: "GroupInfoController"
		})

});
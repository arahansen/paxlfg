var app = angular.module("paxlfg", ['ui.router', 'ngCookies']);

app.controller("CreateController", ["$scope", "$cookies", "groupFactory", "locationFactory", function($scope, $cookies, groupFactory, locationFactory) {
	$scope.email = '';
	$scope.phoneNumber = '';
	$scope.additionalInfo = '';
	$scope.enterCustomGame = false;
	$scope.group = '';
	$scope.buttonDisabled = false;
	var favoriteCookie = $cookies.myFavorite;
	$cookies.myFavorite = 'oatmeal';
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
		// first, disable the Create Group Button so user can't duplicate submits
		$scope.buttonDisabled = true;
		// populate the group object with the info to be added
		group = {

			hostName: $scope.hostName,
			game: $scope.selectedGame,
			currentPlayers: $scope.currentPlayers,
			playersNeeded: $scope.playersNeeded,
			email: $scope.email,
			phoneNumber: $scope.phoneNumber,
			additionalInfo: $scope.additionalInfo,
			startTime: $scope.startTime,
			selectedLocation: $scope.selectedLocation

		}
		// group.game.selectedGame needs to be generated if user entered a custom game
		if ( $scope.enterCustomGame) {
			group.game = {
				game: $scope.selectedGame.replace(" ", ""),
				displayName: $scope.selectedGame
				
			}
		}

		// add the group to the database
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
	$scope.sortReverse = false;
	// pulls current list of groups from db
	groupFactory.async().then(function(d) {
		$scope.groups = d.data;
	});


}]);

app.controller("GroupInfoController", ["$scope", "$stateParams", "groupFactory", "userFactory", function($scope, $stateParams, groupFactory, userFactory){
	var userCreated = false;
	var groups = [];
	$scope.group = '';

	groupFactory.async().then(function(d) {
		groups = d.data;
		angular.forEach(groups, function(group, index) {
	
			if (group._id == $stateParams.groupId) {

				userFactory.thisUserCreated(group._id).then(function(data) {
					// determine whether or not the current user created the displayed group
					userCreated = data;
					// show tools for editing if this user created the group
					$scope.allowEdit = userCreated ? "You created this group." : "";
				});

				

				$scope.group = group;
				return;
			}
		});

	});
		
}]);

app.factory('groupFactory', function($http, $q, $location) {
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

	var async = function() {
		return $http.get('/groupList');
	}

	var getGroups = function() {
		return groups;
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

app.factory("cookieFactory", function($cookies) {
	
});

app.factory("userFactory", function($http, $q) {
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
})

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
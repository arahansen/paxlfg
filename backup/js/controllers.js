app.controller("CreateController", ["$scope", "$cookies", "$filter", "groupFactory", "locationFactory", function($scope, $cookies, $filter, groupFactory, locationFactory) {
	$scope.email = '';
	$scope.phoneNumber = '';
	$scope.additionalInfo = '';
	$scope.enterCustomGame = false;
	$scope.group = '';
	$scope.buttonDisabled = false;
	$scope.startTime = $filter('date')(Date.now(), 'shortTime');


	$scope.games = [
		{id: 1, game: 'cardsAgainstHumanity', displayName: 'Cards Against Humanity'},
		{id: 2, game: 'dungeonsAndDragons', displayName: 'Dungeons & Dragons'},
		{id: 3, game: 'zombieDice', displayName: 'Zombie Dice'},
		{id: 4, game: 'pathfinder', displayName: 'Pathfinder'},
	];

	$scope.locations = locationFactory.getLocations();

	// set a default selected game
	$scope.selectedGame = $scope.games[0];
	$scope.selectedLocation = $scope.locations[0];



	$scope.submit = function(type) {
		
		// first, disable the Create Group Button so user can't duplicate submits
		$scope.buttonDisabled = true;

		// group.game.selectedGame needs to be generated if user entered a custom game
		

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

		if ( $scope.enterCustomGame) {
			group.game = {
				game: $scope.selectedGame.replace(" ", ""),
				displayName: $scope.selectedGame
				
			}
		}

		if (type === 'update') {
			groupFactory.updateGroup();

		} else {
			groupFactory.addGroup(group);

		}
		
	}

	$scope.clearSelectedGame = function() {
		$scope.selectedGame = '';
	}

	$scope.clearSelectedLocation = function() {
		$scope.selectedLocation = '';
	}


}]);

app.controller("GroupCreatedController", ["$scope", "groupFactory", function($scope, groupFactory) {

	$scope.thisGroup = groupFactory.getCurrentGroup();

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

	var getGroupInfo = function(id) {
		groupFactory.async().then(function(d) {
			groups = d.data;
			angular.forEach(groups, function(group, index) {
		
				if (group._id == id) {

					userFactory.thisUserCreated(group._id).then(function(data) {
						// determine whether or not the current user created the displayed group
						userCreated = data;
						// show tools for editing if this user created the group
						$scope.allowEdit = userCreated ? true : false;
					});

					$scope.group = group;
					
				}
			});

		});
	}
	getGroupInfo($stateParams.groupId);
	
}]);

app.controller("EditGroupController", ["$scope", "$stateParams", "groupFactory", "userFactory", function($scope, $stateParams, groupFactory, userFactory) {
	var groups = [],
		group;
	groupFactory.async().then(function(d) {
			groups = d.data;
			console.log(groups);
			angular.forEach(groups, function(group, index) {
		
				if (group._id == $stateParams.groupId) {
					$scope.enterCustomGame = true;

					$scope.group = group;

					$scope.hostName = group.hostName;
					$scope.selectedGame = group.game.displayName;
					$scope.currentPlayers = group.currentPlayers;
					$scope.playersNeeded = group.playersNeeded;
					$scope.startTime = group.startTime;
					$scope.selectedLocation = group.selectedLocation;

					$scope.enterCustomLocation = true;
					$scope.phoneNumber = group.phoneNumber;
					$scope.email = group.email;
					$scope.additionalInfo = group.additionalInfo;
				}
			});

		});



	$scope.games = [
		{id: 1, game: 'cardsAgainstHumanity', displayName: 'Cards Against Humanity'},
		{id: 2, game: 'dungeonsAndDragons', displayName: 'Dungeons & Dragons'},
		{id: 3, game: 'zombieDice', displayName: 'Zombie Dice'},
		{id: 4, game: 'pathfinder', displayName: 'Pathfinder'},
	];
	/*hostName: $scope.hostName,
			game: $scope.selectedGame,
			currentPlayers: $scope.currentPlayers,
			playersNeeded: $scope.playersNeeded,
			email: $scope.email,
			phoneNumber: $scope.phoneNumber,
			additionalInfo: $scope.additionalInfo,
			startTime: $scope.startTime,
			selectedLocation: $scope.selectedLocation
	*/
}]);
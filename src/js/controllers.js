app.controller("CreateController", ["$scope", "$cookies", "$filter", "groupFactory", "locationFactory", function($scope, $cookies, $filter, groupFactory, locationFactory) {
	$scope.email = '';
	$scope.phoneNumber = '';
	$scope.additionalInfo = '';
	$scope.enterCustomGame = false;
	$scope.group = '';
	$scope.buttonDisabled = false;

	$scope.games = [
		{game: 'cardsAgainstHumanity', displayName: 'Cards Against Humanity'},
		{game: 'dungeonsAndDragons', displayName: 'Dungeons & Dragons'},
		{game: 'zombieDice', displayName: 'Zombie Dice'},
		{game: 'pathfinder', displayName: 'Pathfinder'},
	];

	$scope.locations = locationFactory.getLocations();

	// set a default selected game
	$scope.selectedGame = $scope.games[0];
	$scope.selectedLocation = $scope.locations[0];


	$scope.submit = function() {
		
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

		};

		// group.game.selectedGame needs to be generated if user entered a custom game
		if ( $scope.enterCustomGame) {
			group.game = {
				game: $scope.selectedGame.replace(" ", ""),
				displayName: $scope.selectedGame
				
			};
		}

		// add the group to the database
		groupFactory.addGroup(group);
	};

	$scope.clearSelectedGame = function() {
		$scope.selectedGame = '';
	};

	$scope.clearSelectedLocation = function() {
		$scope.selectedLocation = '';
	};


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

app.controller("GroupInfoController", ["$scope", "$stateParams", "groupFactory", "userFactory", "mapFactory", function($scope, $stateParams, groupFactory, userFactory, mapFactory){
	var userCreated = false;
	var groups = [];
	$scope.group = '';
	var groupInfo = this;

	$scope.deleteGroup = function() {
		console.log('deleting');
		groupFactory.deleteGroup($stateParams.groupId);
	};
	var getGroupInfo = function(id) {
		groupFactory.async().then(function(d) {
			groups = d.data;
			angular.forEach(groups, function(group, index) {
		
				if (group._id == id) {

					userFactory.thisUserCreated(group._id).then(function(data) {
						// determine whether or not the current user created the displayed group
						var userCreated = data;
						
						// show tools for editing if this user created the group
						$scope.allowEdit = userCreated ? true : false;
					});

					$scope.group = group;
					angular.element(document).ready(function() {
						console.log($scope.group);
						mapFactory.getMap($scope.group.selectedLocation);
					});
				}
			});

		});
	};
	getGroupInfo($stateParams.groupId);

	
	
}]);

app.controller("EditGroupController", ["$scope", "$stateParams", "groupFactory", "userFactory", "locationFactory", function($scope, $stateParams, groupFactory, userFactory, locationFactory) {
	var group;
	$scope.groups;	
	$scope.group;

	$scope.locations = locationFactory.getLocations();

	$scope.submit = function() {
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
		};

		// group.game.selectedGame needs to be generated if user entered a custom game
		if ( $scope.enterCustomGame) {
			group.game = {
				game: $scope.selectedGame.replace(" ", ""),
				displayName: $scope.selectedGame
				
			};
		}

		groupFactory.updateGroup($stateParams.groupId, group);
	};

	
	var getGroups = function() {
		return groupFactory.async()
			.success(function(groups) {
				$scope.groups = groups;
			})
			.error(function(error) {
				$scope.status = 'Unable to load group data: ' + error.message;
			});
	};

	getGroups().then(function(result) {
		angular.forEach($scope.groups, function(group, index) {
		
			if (group._id == $stateParams.groupId) {
				$scope.enterCustomGame = true;

				$scope.group = group;

				$scope.hostName = group.hostName;
				$scope.selectedGame = group.game.displayName;
				$scope.currentPlayers = group.currentPlayers;
				$scope.playersNeeded = group.playersNeeded;
				$scope.startTime = group.startTime;
				$scope.selectedLocation = group.selectedLocation.name;

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

}]);


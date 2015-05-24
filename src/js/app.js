var app = angular.module("paxlfg", ['ui.router', 'ngCookies']);



app.factory('groupFactory', ["$http", "$location", "userFactory", function($http, $location, userFactory) {
	var currentGroup = '';
	var id = 0;
	var groups = [];
	

	var addGroup = function(group) {
		$http.post('/groupList', group).success(function(data) {
			// when we add a group, that group should be set to the current group
			setCurrentGroup(data);
		})
		.then(function() {
			$location.path('/groupCreated');
		});

	};

	var updateGroup = function(groupId, group) {
		$http.post('/updateGroup/' + groupId, group)
			.then(function(data) {
				console.log(data);
				setCurrentGroup(data);
				$location.path('/groupUpdated');
			});
		
	};

	var deleteGroup = function(groupId) {
		userConfirmed = confirm("Are you sure you want to delete this group?");
		console.log(userConfirmed);
		if (userConfirmed) {
			$http.post('/deleteGroup/' + groupId).then(function(data) {
				console.log('pathing');
				$location.path('/groupDeleted');
			});
		}
		

		
	};

	var async = function() {
		return $http.get('/groupList');
	};

	var getGroups = function() {
		return groups;
	};

	var getCurrentGroup = function() {
		return currentGroup;
	};

	var getGroupInfo = function(id) {
		var groups;
		async().then(function(d) {
			groups = d.data;
			
			angular.forEach(groups, function(group, index) {
		
				if (group._id == id) {
					
					return group;
				}
			});

		});

	};

	var setCurrentGroup = function(group) {
		currentGroup = group || '';
	};

	return {
		addGroup: addGroup,
		async: async,
		deleteGroup: deleteGroup,
		getGroups: getGroups,
		getCurrentGroup: getCurrentGroup,
		getGroupInfo: getGroupInfo,
		updateGroup: updateGroup
	};
}]);

app.factory("locationFactory", function() {
	var locations = [
		{
			name: "Convention Center",
			coords: [47.61184, -122.33157]
		},
		{
			name: "WSCC Annex",
			coords: [47.61241, -122.33218]
		},
		{
			name: "Motif Seattle (Formerly Red Lion)",
			coords: [47.61003, -122.33551]
		}
	];

	var getLocations = function() {
		return locations;
	};

	return {
		getLocations: getLocations
	};
});


app.factory("userFactory", ["$http", function($http) {

	function thisUserCreated(id) {
		return $http.get('/userCreated/' + id).then(function(result) {

			// returns boolean indicating whether the current user has the proper cookie 
			// saying this user created the given group
			return result.data;
		});
		
	}

	return {
		thisUserCreated: thisUserCreated
	};
}]);

app.factory("mapFactory", function() {
	var getMap = function(location) {
		// set a default location if the proper location object is not passed in
		location = typeof location == "object" ? location : {name: location || "Convention Center",coords: [47.61184, -122.33157]};

		// initialize Leaflet map
		var map = map || L.map('map').setView([location.coords[0], location.coords[1]], 18);

		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			attribution: 'Map data &copy',
			maxZoom: 19,
			minZoom: 18,
			id: 'arahansen.m8jjbdlj',
			accessToken: 'pk.eyJ1IjoiYXJhaGFuc2VuIiwiYSI6ImVhYzJjMzE1MWE0YTZkNjgxYjhjYjI4MjE1YjVhYzkxIn0.JZPEGYYGihssOH-JrD8Z8g',
			
		}).addTo(map);

		// place marker on map where group is meeting
		var marker = L.marker([location.coords[0], location.coords[1]]).addTo(map);
		marker.bindPopup("This group is meeting at: " + location.name).openPopup();

	};
	
	return {
		getMap: getMap
	};


});


app.config(["$stateProvider", "$urlRouterProvider", "$compileProvider", function($stateProvider, $urlRouterProvider, $compileProvider) {
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
		.state('groupUpdated', {
			url: '/groupUpdated',
			templateUrl: "groupUpdated.html",
			controller: "GroupCreatedController"

		})
		.state('groupDeleted', {
			url: '/groupDeleted',
			templateUrl: "groupDeleted.html",
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
		});

}]);
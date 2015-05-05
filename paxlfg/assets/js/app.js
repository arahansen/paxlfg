var app = angular.module("paxlfg", ['ui.router']);

app.controller("HomeController", ["$scope", function($scope) {
	$scope.myname = "Andrew";
}]);

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/home');

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: "home.html",
			controller: "HomeController"
		})
		.state('create', {
			url: '/create',
			templateUrl: "create.html",
			controller: "CreateController"
		})

});
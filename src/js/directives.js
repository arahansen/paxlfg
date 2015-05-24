app.directive('groupForm', function() {
	
	return {
		restrict: 'E',
		replace: 'true',
		templateUrl: 'groupForm.html',
		controller: '@',
		name: "controllerName",
		scope: {
			buttonText: '=',
			//submit: '&'
		}
	};
});
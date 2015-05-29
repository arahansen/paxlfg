app.directive('groupForm', function() {
	
	return {
		restrict: 'E',
		replace: 'true',
		templateUrl: 'groupForm.html',
		controller: '@',
		name: "controllerName",
		scope: {
			buttonText: '=',

		}
	};
});

app.directive('validateTime', function($interval) {
	return {
		restrict: 'AE',
		require: 'ngModel',

		link: function(scope, elem, attr, ctrl) {
			var startTime;
			var d = new Date();
			var minStartTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 0);

			scope.$watch('selectedDay', function() {
				// update the start time with the selected day
				scope.startTime.setDate(scope.selectedDay.day);
				scope.startTime.setMonth(scope.selectedDay.month);
				
			});
			// update minimum time every 10 ms
			$interval(function() {
				d = new Date();
				// set the new allowable minimum time
				minStartTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 0);
				
				if (scope.startTime <= minStartTime) {
					// reset the View
					scope.startTime = minStartTime;
				}
				
				
			}, 10);
		}

	};
});
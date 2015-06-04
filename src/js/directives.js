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

app.directive('validateTime', ['$filter', '$interval', function($filter, $interval) {
	return {
		restrict: 'AE',
		
		scope: {
			// minTime should be brought in as a number (time in milliseconds)
			minTime: '=',
			thisTime: '=',
			day: '='
		},

		link: function(scope, elem, attrs, ctrl) {
			var newTime;
			//scope.minTime = new Date.parse(scope.minTime);
			console.log(scope.minTime);
			
			var startTime;
			var d = new Date();
			

			elem.on('$destroy', function() {
				$interval.cancel(timeoutId);
			});

			
			scope.$watch('thisTime', function(v) {

				//v = v.setDate(scope.day);
			
				v.setMonth(scope.day.month);
				v.setDate(scope.day.day);
			

				if (v.getTime() < scope.minTime.getTime()) {
					newTime = $filter('date')(scope.minTime, 'HH:mm');
					elem.val(newTime);
				}

			});

		/*	ctrl.$validators.empty = function(modelValue, viewValue) {
					
					var value = modelValue || viewValue;
					
					if (!elem[0].required && ctrl.$isEmpty(value)) {
						return true;
						
					}
					if (value) {
						return true;
					}
					
			};
		*/
			scope.$watch('startDay', function() {
				// update the start time with the selected day
				//scope.startTime.setDate(scope.startDay.day);
				//scope.startTime.setMonth(scope.startDay.month);
				
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
}]);

app.directive('groupChanged', function() {
	return {
		restrict: 'AE',
		scope: {
			change: '='
		},
		templateUrl: 'groupChanged.html'
	};
});
app.directive('groupForm', function() {
	var getTemplate = function(templates, buttonType) {
		var template = '';

		switch (buttonType) {
			case 'update':
				template = '<button id="start-group" class="btn btn-default" role="button" type="submit" \
								ng-disabled="buttonDisabled || groupForm.$invalid"> \
								Update Group \
							</button>;'
				break;
			case 'create':
				template = templates.createButton;
				break;
		}
		return template;
	};

	var linked = function (scope, element, attrs) {

	}
	return {
		restrict: 'E',
		replace: 'true',
		templateUrl: 'groupForm.html',
		controller: 'CreateController',
		scope: {
			buttonText: '=',
			submit: '@'
		}
	}
});
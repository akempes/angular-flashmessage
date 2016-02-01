/*global alert, confirm*/

var myApp = angular.module('exampleApp',['flashMessage']);

myApp.config(['flashMessageProvider', function (flashMessageProvider) {
    'use strict';
	
	var type     = 'myMissingMessageType',
	persist      = '0',
	delay        = '0',
	template     = 'flashMessage/message.html',
	showClose    = true,
	clickToClose = true;

    flashMessageProvider.setType(type, persist, delay, template, showClose, clickToClose);
}]);

myApp
.controller('ExampleBaseController', ['$scope', '$rootScope', 'flashMessage', function( $scope, $rootScope, flashMessage ){
    'use strict';

    	$scope.showCode = {
			infoWithPromise  : false,
			fullFeature      : false,
			customType       : false,
			presitendMessage : false
    	};
    	$scope.flash = flashMessage;

    	$scope.successFlashMessage = function () {
    		flashMessage.success('Well done!');
    	};

    	$scope.errorFlashMessage = function () {
    		flashMessage.error('<strong>Error:</strong> This is not a bug, it\'s a feature.');	
    	};

    	$scope.warningFlashMessage = function () {
    		flashMessage.warning('Listen carefully! I may say this only once...');	
    	};

    	$scope.infoFlashMessage = function () {
    		flashMessage.info('Hi, did you know almost every thing is configurable?');	
    	};

    	$scope.infoFlashMessageWithPromise = function () {
    		flashMessage.info('Did you know this function returns a promise?').then(function () {
    			alert('Well, now you do.');
    		});
    	};

    	$scope.fullFeatureFlashMessage = function () {

			var data = {
				title   : 'Full feature message',
				message : 'As you can see, objects are supported too.',
				note    : 'You only have to modify the template. See the section "Configuration" in the readme file.'
			},
			persist      = 1,
			delay        = 6000,
			showClose    = false,
			template     = 'custom-message.html',
			clickToClose = false;

			flashMessage.warning(data, persist, delay, showClose, template, clickToClose).then(function () {
				alert('All features are shown now... Please also check the configuration documentation in the readme file.');
			});
		};

		$scope.customFlashMessageType = function () {
			flashMessage.myMissingMessageType('Yet another awesome message.');
		};

    	$scope.presistendFlashMessage = function () {
    		flashMessage.warning('This message will disappear after 3 events. <small>(Click on the button)</small>', 3);	
    	};

    	$scope.triggerEvent = function () {
    		$rootScope.$broadcast('$routeChangeSuccess');
    	};
    }
]);


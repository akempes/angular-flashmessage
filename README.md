# angular-flashmessage

A simple, lightweight (0.6 kb minified) and flexible package to show flash message.

## Getting Started

You can install the angular-flashmessage package very easily using Bower:

```shell
bower install angular-flashmessage
```

And the following files to your index page:

```html
<link href="angular-flashmessage/dist/flashmessage.css" rel="stylesheet">
<script src="angular-flashmessage/dist/flashmessage.js"></script>
```

Add 'flashMessage' to your main module's list of dependencies:

```js
angular.module('myApp', [
	...
    'flashMessage',
    ...
]);
```

Finally add to following directive to your template:

```html
<div flash-message></div>
```

Please have a look at the configuration options to explore all available features.

## How to use

Add the flashMessage dependency to your controller:

```js
module.controller('myController', ['$scope','flashMessage', function( $scope, flashMessage ){
	...
}]);
```

In the controller you can simply call one of the defined message types. By default 'Success', 'Error', 'Warning' and 'Error' are available, but you can add your own as shown below.

```js
$scope.successFlashMessage = function () {
	flashMessage.success('Well done!');
};
```
Each message will return a promise. When the message is closed the promise is resolved. Message can be closed automatically after a delay, by a user click event. All are fully configurable as explained below.

```js
$scope.testFlashMessageWithPromise = function () {
	flashMessage.info('Did you know this function returns a promise?').then(function () {
		console.log('Well, now you do.');
	});
};
```

Instead of just a string, objects can also be used in the first parameter. You have to modify your template though. The data parameter is required, all other options override the default behavior. (See configuration documentation.) Here a full feature example:

```js
$scope.fullFeatureFlashMessage = function () {
	
	var data = { 							// Your data object, this can be anything you like.
		title   : 'Full feature message',
		message : 'But wait... there is more! Objects are also supported too.',
		note    : 'You only have to modify the template. See the section "Configuration" in the readme file.'
	},
	persist      = 1, 						// The number of events that your message has to 'survive'.
	delay        = 6000, 					// The time your message is visible in miliseconds. (Now 6 seconds.) Use a number < 1 to disable.
	showClose    = false, 					// Hide the close button. (Note that this feature is located in the template. When using a custom design make sure to use: ng-if="msg.showClose")
	template     = 'custom-message.html', 	// Specify your custom template.
	clickToClose = false; 					// Disable the click event on the message(body) (This option will not affect the close button.)

	flashMessage.warning(data, persist, delay, showClose, template, clickToClose).then(function () {
		alert('All features are shown now... Please also check the configuration documentation in the readme file.');
	});
};
```
**custom-view.html**

```html
<div>
	<strong>{{msg.data.title}}</strong><br/>
	<p>{{msg.data.message}}</p>
	<small>{{msg.data.note}}</small>
</div>
```

If you need more message types, no problem! Define as many as you need:


```js
myApp.config(['flashMessageProvider', function (flashMessageProvider) {
	
	var type     = 'myMissingMessageType', // Required. 
	persist      = '0', // Optional
	delay        = '0', // Optional
	template     = 'flashMessage/message.html', // Optional
	showClose    = true, // Optional
	clickToClose = true; // Optional

    flashMessageProvider.setType(type, persist, delay, template, showClose, clickToClose);
}]);
```

Now you can use your message type in the controller:

```js
$scope.customFlashMessageType = function () {
	flashMessage.myMissingMessageType('Yet another awsome message,');
};
```

## Events

When a new message is shown the 'new-flash-message' event is broadcasted on the rootScope. The event data will contain the message object.

```js
$rootScope.$on('new-flash-message', function(event, data){
	console.log(data);
});
```

## Configuration

Almost everything is configurable. Not a single customer is the same so you need to be able to customize as much as possilbe.  
The configurations are split up in four seperate blocks:

1. The default behavoir
2. The message types
3. The directive to show them 
4. The Styling

### The default behavoir

The default behaviors are defined when your app is configurated.

**viewChange** (Array)  
*Default: ['$routeChangeSuccess']*  
The persistence is reduced by 1 for each time an event that is broadcasted on the rootScope. (Only applicable for message where persist > 0.)

**persist** (Integer)  
*Default: 0*  
An message is shown until this number of events has broadcasted. Use 0 to disable.

**delay** (Integer)  
*Default: 0*  
An message is shown until this number of miliseconds has passed. Use 0 to disable.

**wrapperTemplate** (String)  
*Default: flashMessage/wrapper.html*  
Template for wrapping the messages.

**template** (String)  
*Default: flashMessage/message.html*  
Template for displaying messages.

**showClose** (Boolean)  
*Default: true*  
Show the close button in the message template.

**clickToClose** (Boolean)  
*Default: true*  
Allow users to click on the message body to close them.

```js
myApp.config(['flashMessageProvider', function (flashMessageProvider) {

	// Set the new default values
    flashMessageProvider.setConfig({
        viewChange      : ['$routeChangeSuccess']
        persist         : 0,
        delay           : 0,
        wrapperTemplate : 'flashMessage/wrapper.html',
        template        : 'flashMessage/message.html',
        showClose       : true,
        clickToClose    : true
    });

}]);
```

### The message types

Out of the box are 4 message types predefined: Success, Error, Warning and Info. But you can add your own as well:

```js
myApp.config(['flashMessageProvider', function (flashMessageProvider) {
	
	var type     = 'myMissingMessageType', 			// Required
	persist      = 0, 								// Optional
	delay        = 0, 								// Optional
	template     = 'flashMessage/message.html', 	// Optional
	showClose    = true, 							// Optional
	clickToClose = true; 							// Optional

    flashMessageProvider.setType(type, persist, delay, template, showClose, clickToClose);
}]);
```
Only the **type** is required. This is the name of your custom message type. Only alphanumeric values are allowed. The other parameters are optional. If not specified the defaults are used.

### The directive to show them

In the most simple form the directive will show all message types in the same wrapper:

```html
<div flash-message></div>
```

You can define which message type you want to show. You can even assign multipe types to one wrapper by using the comma separator.

```html
<div flash-message="success,info"></div>
```

If you want to use a different wrapper template:

```html
<div flash-message="success,info" flash-message-template="views/custom-wrapper.html"></div>
```

### The Styling

Each DOM element has got its own class. In this way you can easily style the messages for your project. Each message will get a message-type-specific class. (eq. flash-message-success) Angular-flashmessage is shipped with a simple, but effective css file.

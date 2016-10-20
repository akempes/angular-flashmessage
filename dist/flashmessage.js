angular.module('flashMessage', ['ng'])

.provider('flashMessage', [ function( ) {
    'use strict';

    var options = {
        viewChange      : ['$routeChangeSuccess'],
        persist         : 0,
        delay           : 0,
        wrapperTemplate : 'flashMessage/wrapper.html',
        template        : 'flashMessage/message.html',
        showClose       : true,
        clickToClose    : true,
        useTranslation  : false
    },
    types = [
        { 
            type  :'success',
            delay : 3000
        },
        { type : 'error' },
        { type : 'warning' },
        { type : 'info' }
    ];

    this.setType = function (type, persist, delay, template, showClose, clickToClose) {

        if(!/^[a-zA-Z0-9]+$/.test(type)){
            console.log('The message type `'+type+'` is not valid, use only alphanumeric characters.');
            return;
        }

        var index = types.map(function(x){ return x.type; }).indexOf(type),
        item = {
            type         : type,
            persist      : persist,
            delay        : delay,
            template     : template,
            showClose    : showClose,
            clickToClose : clickToClose
        };

        if(index<0){
            types.push(item);
        }else{
            types[index] = item;
        }

        return this;
    };

    this.setConfig = function (data) {
        options = angular.extend(options, data);

        return this;
    };

    this.$get = ['$q', '$interval', '$rootScope', function( $q, $interval, $rootScope ) {
        
        var me = {},
        getValue = function(data) {
            var i;
            for ( i = 0; i < data.length; i+=1) {
                if(data[i] !== undefined){
                    return data[i];
                }
            }
            return undefined;
        },
        updatePersistence = function function_name (amount) {
            angular.forEach(me.messages, function(msg){
                msg.persist_counter += amount;
                if(msg.persist>0 && msg.persist_counter<=0){
                    msg.close('viewChanged');
                }
            });
        };

        me.messages = [];

        me.getConfig = function () {
            return options;
        };

        angular.forEach(types, function (item) {
            me[item.type] = function (data, persist, delay, showClose, template, clickToClose, useTranslation) {

                var index = types.map(function(x){ return x.type; }).indexOf(item.type),
                msg;

                if(index<0){
                    console.log('Type not defined.');
                    return;
                }

                msg = {
                    type            : item.type,
                    data            : data,
                    defer           : $q.defer(),
                    persist         : getValue([ persist, types[index].persist, options.persist, 0 ]),
                    persist_counter : getValue([ persist, types[index].persist, options.persist, 0 ]),
                    delay           : getValue([ delay, types[index].delay, options.delay, 0 ]),
                    template        : getValue([ template, types[index].template, options.template, 0 ]),
                    clickToClose    : getValue([ clickToClose, types[index].clickToClose, options.clickToClose, 0 ]),
                    showClose       : getValue([ showClose, types[index].showClose, options.showClose, 0 ]),
                    useTranslation  : getValue([ useTranslation, types[index].useTranslation, options.useTranslation, false ]),

                    close           : function (data) {
                        if(data==='clickToClose' && !msg.clickToClose){
                            return;
                        }

                        var indexMsg = me.messages.map(function(x){ return x.$$hashKey; }).indexOf(msg.$$hashKey);
                        me.messages.splice(indexMsg, 1);

                        $interval.cancel(me.timeout);

                        msg.defer.resolve({result:data, msg:msg});
                    }
                };

                if(msg.delay && msg.delay > 0){
                    msg.timeout = $interval(function(){ msg.close('timedout'); }, msg.delay);
                }

                me.messages.push(msg);

                $rootScope.$broadcast('new-flash-message', msg);

                return msg.defer.promise;
            };
        });

        angular.forEach(options.viewChange, function(item){
            $rootScope.$on(item, function () {
                updatePersistence(-1);
            });
        });

        return me;
    }];
   
}])
.directive('flashMessage', ["flashMessage", function( flashMessage ) {
    'use strict';

    /*jslint unparam:true*/
    var link = {
        scope:{
            types: '@flashMessage'
        },
        templateUrl: function(element, attrs) {
            return attrs.flashMessageTemplate || flashMessage.getConfig().wrapperTemplate;
        },
        link: function ($scope) {

            if($scope.types){
                $scope.types =  $scope.types.split(',');
            }

            $scope.messages = flashMessage.messages;

            $scope.restrictTypes = function (msg) {
                return ( $scope.types==='' || $scope.types.indexOf(msg.type)>-1 );
            };
        }
    };
    /*jslint unparam:false*/

    return link;

}])
.filter('allowHtmlInMessage', ['$sce', function($sce) {
    'use strict';
    
    return function(value) {
        return $sce.trustAsHtml(value);
    };
}])
.run(['$templateCache',  function ($templateCache) {
    'use strict';

    $templateCache.put('flashMessage/wrapper.html',

        '<ul class="flash-message-wrapper">'+
            '<li ng-repeat="msg in messages | filter:restrictTypes" ng-include="msg.template" ng-click="msg.close(\'clickToClose\')" class="flash-message-item flash-message-{{msg.type}}" ng-class="{\'flash-message-clickable\': msg.clickToClose}"></li>'+
        '</ul>'

    );

    $templateCache.put('flashMessage/message.html',

        '<span class="flash-message-body" ng-if="!msg.useTranslation" ng-bind-html="msg.data | allowHtmlInMessage"></span>' +
        '<span class="flash-message-body" ng-if="msg.useTranslation"  ng-bind-html="msg.data | translate | allowHtmlInMessage"></span>' +
        '<span class="flash-message-close flash-message-clickable" ng-if="msg.showClose" ng-click="msg.close(\'close\')">&times;</span>'

    );

}]);
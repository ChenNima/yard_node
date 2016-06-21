/**
 * Copyright 2012 Tsvetan Tsvetkov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Author: Tsvetan Tsvetkov (tsekach@gmail.com)
 */
(function (win) {
    /*
     Safari native methods required for Notifications do NOT run in strict mode.
     */
    //"use strict";
    var PERMISSION_DEFAULT = "default",
        PERMISSION_GRANTED = "granted",
        PERMISSION_DENIED = "denied",
        PERMISSION = [PERMISSION_GRANTED, PERMISSION_DEFAULT, PERMISSION_DENIED],
        defaultSetting = {
            pageVisibility: false,
            autoClose: 0
        },
        empty = {},
        emptyString = "",
        isSupported = (function () {
            var isSupported = false;
            /*
             * Use try {} catch() {} because the check for IE may throws an exception
             * if the code is run on browser that is not Safar/Chrome/IE or
             * Firefox with html5notifications plugin.
             *
             * Also, we canNOT detect if msIsSiteMode method exists, as it is
             * a method of host object. In IE check for existing method of host
             * object returns undefined. So, we try to run it - if it runs
             * successfully - then it is IE9+, if not - an exceptions is thrown.
             */
            try {
                isSupported = !!(/* Safari, Chrome */win.Notification || /* Chrome & ff-html5notifications plugin */win.webkitNotifications || /* Firefox Mobile */navigator.mozNotification || /* IE9+ */(win.external && win.external.msIsSiteMode() !== undefined));
            } catch (e) {}
            return isSupported;
        }()),
        ieVerification = Math.floor((Math.random() * 10) + 1),
        isFunction = function (value) { return (value && (value).constructor === Function); },
        isString = function (value) {return (value && (value).constructor === String); },
        isObject = function (value) {return (value && (value).constructor === Object); },
        /**
         * Dojo Mixin
         */
        mixin = function (target, source) {
            var name, s;
            for (name in source) {
                s = source[name];
                if (!(name in target) || (target[name] !== s && (!(name in empty) || empty[name] !== s))) {
                    target[name] = s;
                }
            }
            return target; // Object
        },
        noop = function () {},
        settings = defaultSetting;
    function getNotification(title, options) {
        var notification;
        if (win.Notification) { /* Safari 6, Chrome (23+) */
            notification =  new win.Notification(title, {
                /* The notification's icon - For Chrome in Windows, Linux & Chrome OS */
                icon: isString(options.icon) ? options.icon : options.icon.x32,
                /* The notification’s subtitle. */
                body: options.body || emptyString,
                /*
                    The notification’s unique identifier.
                    This prevents duplicate entries from appearing if the user has multiple instances of your website open at once.
                */
                tag: options.tag || emptyString
            });
        } else if (win.webkitNotifications) { /* FF with html5Notifications plugin installed */
            notification = win.webkitNotifications.createNotification(options.icon, title, options.body);
            notification.show();
        } else if (navigator.mozNotification) { /* Firefox Mobile */
            notification = navigator.mozNotification.createNotification(title, options.body, options.icon);
            notification.show();
        } else if (win.external && win.external.msIsSiteMode()) { /* IE9+ */
            //Clear any previous notifications
            win.external.msSiteModeClearIconOverlay();
            win.external.msSiteModeSetIconOverlay((isString(options.icon) ? options.icon : options.icon.x16), title);
            win.external.msSiteModeActivate();
            notification = {
                "ieVerification": ieVerification + 1
            };
        }
        return notification;
    }
    function getWrapper(notification) {
        return {
            webNotification: notification,
            close: function () {
                if (notification) {
                    if (notification.close) {
                        //http://code.google.com/p/ff-html5notifications/issues/detail?id=58
                        notification.close();
                    }
                    else if (notification.cancel) {
                        notification.cancel();
                    } else if (win.external && win.external.msIsSiteMode()) {
                        if (notification.ieVerification === ieVerification) {
                            win.external.msSiteModeClearIconOverlay();
                        }
                    }
                }
            }
        };
    }
    function requestPermission(callback) {
        if (!isSupported) { return; }
        var callbackFunction = isFunction(callback) ? callback : noop;
        if (win.webkitNotifications && win.webkitNotifications.checkPermission) {
            /*
             * Chrome 23 supports win.Notification.requestPermission, but it
             * breaks the browsers, so use the old-webkit-prefixed
             * win.webkitNotifications.checkPermission instead.
             *
             * Firefox with html5notifications plugin supports this method
             * for requesting permissions.
             */
            win.webkitNotifications.requestPermission(callbackFunction);
        } else if (win.Notification && win.Notification.requestPermission) {
            win.Notification.requestPermission(callbackFunction);
        }
    }
    function permissionLevel() {
        var permission;
        if (!isSupported) { return; }
        if (win.Notification && win.Notification.permissionLevel) {
            //Safari 6
            permission = win.Notification.permissionLevel();
        } else if (win.webkitNotifications && win.webkitNotifications.checkPermission) {
            //Chrome & Firefox with html5-notifications plugin installed
            permission = PERMISSION[win.webkitNotifications.checkPermission()];
        } else if (win.Notification && win.Notification.permission) {
            // Firefox 23+
            permission = win.Notification.permission;
        } else if (navigator.mozNotification) {
            //Firefox Mobile
            permission = PERMISSION_GRANTED;
        } else if (win.external && (win.external.msIsSiteMode() !== undefined)) { /* keep last */
            //IE9+
            permission = win.external.msIsSiteMode() ? PERMISSION_GRANTED : PERMISSION_DEFAULT;
        }
        return permission;
    }
    /**
     *
     */
    function config(params) {
        if (params && isObject(params)) {
            mixin(settings, params);
        }
        return settings;
    }
    
    function createNotification(title, options) {
        var notification,
            notificationWrapper;
        /*
            Return undefined if notifications are not supported.

            Return undefined if no permissions for displaying notifications.

            Title and icons are required. Return undefined if not set.
         */
        if (isSupported && isString(title) && (options && (isString(options.icon) || isObject(options.icon))) && (permissionLevel() === PERMISSION_GRANTED)) {
            notification = getNotification(title, options);
        }
        notificationWrapper = getWrapper(notification);
        //Auto-close notification
        if (settings.autoClose && notification && !notification.ieVerification && notification.addEventListener) {
            notification.addEventListener("show", function () {
                var notification = notificationWrapper;
                win.setTimeout(function () {
                    notification.close();
                }, settings.autoClose);
            });
        }
        return notificationWrapper;
    }
    win.notify = {
        PERMISSION_DEFAULT: PERMISSION_DEFAULT,
        PERMISSION_GRANTED: PERMISSION_GRANTED,
        PERMISSION_DENIED: PERMISSION_DENIED,
        isSupported: isSupported,
        config: config,
        createNotification: createNotification,
        permissionLevel: permissionLevel,
        requestPermission: requestPermission
    };
    if (isFunction(Object.seal)) {
        Object.seal(win.notify);
    }
}(window));
;/**
 * 'showNotification' callback.
 *
 * @callback ShowNotificationCallback
 * @param {error} [error] - The error object in case of any error
 * @param {function} [hide] - The hide notification function
 */

/**
 * @ngdoc method
 * @function
 * @memberof! webNotification
 * @alias webNotification.initWebNotification
 * @private
 *
 * @description
 * Initializes the angular web notification service.
 *
 * @param {object} notifyLib - The HTML5 notification library instance
 */
(function initWebNotification(notifyLib) {
    'use strict';

    var webNotification = window.angular.module('angular-web-notification', []);

    /**
     * @ngdoc service
     * @name webNotification
     * @namespace webNotification
     * @author Sagie Gur-Ari
     * @returns {object} The service instance
     *
     * @description
     * The web notification service wraps the HTML 5 Web Notifications API as an angular service.
     */
    webNotification.factory('webNotification', function onCreateService() {
        var service = {};

        /**
         * True to enable automatic requesting of permissions if needed.
         *
         * @memberof! webNotification
         * @alias webNotification.allowRequest
         * @public
         */
        service.allowRequest = true; //true to enable automatic requesting of permissions if needed

        Object.defineProperty(service, 'permissionGranted', {
            /**
             * Returns the permission granted value.
             *
             * @function
             * @memberof! webNotification
             * @private
             * @returns {boolean} True if permission is granted, else false
             */
            get: function getPermission() {
                var permission = notifyLib.permissionLevel();

                /**
                 * True if permission is granted, else false.
                 *
                 * @memberof! webNotification
                 * @alias webNotification.permissionGranted
                 * @public
                 */
                var permissionGranted = false;
                if (permission === notifyLib.PERMISSION_GRANTED) {
                    permissionGranted = true;
                }

                return permissionGranted;
            }
        });

        /**
         * @ngdoc method
         * @function
         * @memberof! webNotification
         * @alias webNotification.isEnabled
         * @private
         *
         * @description
         * Checks if web notifications are permitted.
         *
         * @returns {boolean} True if allowed to show web notifications
         */
        var isEnabled = function () {
            var enabled = notifyLib.isSupported;

            if (enabled) {
                enabled = service.permissionGranted;
            }

            return enabled;
        };

        /**
         * @ngdoc method
         * @function
         * @memberof! webNotification
         * @alias webNotification.createAndDisplayNotification
         * @private
         *
         * @description
         * Displays the web notification and returning a 'hide' notification function.
         *
         * @param {string} title - The notification title text (defaulted to empty string if null is provided)
         * @param {object} options - Holds the notification data (web notification API spec for more info)
         * @param {number} [options.autoClose] - Auto closes the notification after the provided amount of millies (0 or undefined for no auto close)
         * @param {function} [options.onClick] - An optional onclick event handler
         * @returns {function} The hide notification function
         */
        var createAndDisplayNotification = function (title, options) {
            var autoClose = 0;
            if (options && options.autoClose && (typeof options.autoClose === 'number')) {
                autoClose = options.autoClose;
            }
            notifyLib.config({
                autoClose: autoClose
            });

            var notification = notifyLib.createNotification(title, options);

            //add onclick handler
            if (options.onClick && notification && notification.webNotification) {
                notification.webNotification.onclick = options.onClick;
            }

            return function hideNotification() {
                notification.close();
            };
        };

        /**
         * @ngdoc method
         * @function
         * @memberof! webNotification
         * @alias webNotification.parseInput
         * @private
         *
         * @description
         * Returns an object with the show notification input.
         *
         * @param {array} argumentsArray - An array of all arguments provided to the show notification function
         * @returns {object} The parsed data
         */
        var parseInput = function (argumentsArray) {
            //callback is always the last argument
            var callback = argumentsArray.pop();

            var title = null;
            var options = null;
            if (argumentsArray.length === 2) {
                title = argumentsArray[0];
                options = argumentsArray[1];
            } else if (argumentsArray.length === 1) {
                var value = argumentsArray.pop();
                if (typeof value === 'string') {
                    title = value;
                    options = {};
                } else {
                    title = '';
                    options = value;
                }
            }

            //set defaults
            title = title || '';
            options = options || {};

            return {
                callback: callback,
                title: title,
                options: options
            };
        };

        /**
         * Shows the notification based on the provided input.<br>
         * The callback invoked will get an error object (in case of an error, null in
         * case of no errors) and a 'hide' function which can be used to hide the notification.
         *
         * @function
         * @memberof! webNotification
         * @alias webNotification.showNotification
         * @public
         * @param {string} [title] - The notification title text (defaulted to empty string if null is provided)
         * @param {object} [options] - Holds the notification data (web notification API spec for more info)
         * @param {number} [options.autoClose] - Auto closes the notification after the provided amount of millies (0 or undefined for no auto close)
         * @param {function} [options.onClick] - An optional onclick event handler
         * @param {ShowNotificationCallback} callback - Called after the show is handled.
         * @example
         * ```js
         * webNotification.showNotification('Example Notification', {
         *    body: 'Notification Text...',
         *    icon: 'my-icon.ico',
         *    onClick: function onNotificationClicked() {
         *      console.log('Notification clicked.');
         *    },
         *    autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
         * }, function onShow(error, hide) {
         *    if (error) {
         *        window.alert('Unable to show notification: ' + error.message);
         *    } else {
         *        setTimeout(function hideNotification() {
         *            hide();
         *        }, 5000);
         *    }
         * });
         * ```
         */
        service.showNotification = function () {
            //convert to array to enable modifications
            var argumentsArray = Array.prototype.slice.call(arguments, 0);

            if ((argumentsArray.length >= 1) && (argumentsArray.length <= 3)) {
                var data = parseInput(argumentsArray);

                //get values
                var callback = data.callback;
                var title = data.title;
                var options = data.options;

                var hideNotification = null;
                if (isEnabled()) {
                    hideNotification = createAndDisplayNotification(title, options);
                    callback(null, hideNotification);
                } else if (service.allowRequest) {
                    notifyLib.requestPermission(function onRequestDone() {
                        if (isEnabled()) {
                            hideNotification = createAndDisplayNotification(title, options);
                            callback(null, hideNotification);
                        } else {
                            callback(new Error('Notifications are not enabled.'), null);
                        }
                    });
                } else {
                    callback(new Error('Notifications are not enabled.'), null);
                }
            }
        };

        return service;
    });
}(window.notify));
;/**
 * Created by yichen on 5/27/16.
 */
'use strict';

angular.module('myApp', [
    'ngRoute',
    'loginService',
    'restangular',
    'ngCookies',
    'dataFormat',
    'angular-web-notification',
    'ui.bootstrap'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider
        .when('/', {
            redirectTo: 'login'
        })
        .when('/chat', {
            templateUrl: 'javascripts/chat/chat.html',
            controller: 'ChatCtrl'
        })
        .when('/login', {
            templateUrl: 'javascripts/login/login.html',
            controller: 'LoginController'
        })
        .when('/register', {
            templateUrl: 'javascripts/login/register.html',
            controller: 'RegisterController'
        })
}]);;/**
 * Created by yichen on 6/2/16.
 */
angular.module('myApp')
    .controller('ChatCtrl',
        ['$scope',
            'Restangular',
            '$cookies',
            '$location',
            '$uibModal',
            'webNotification',
            'LoginService',
            'dataFormat',
            function ($scope, Restangular,$cookies,$location,$uibModal,webNotification,LoginService,dataFormat) {

                var sendData;

                var getFlag = false;

                var user = LoginService.getUserData();

                if (_.isEmpty(user)) {
                    $location.path('/login');
                }
                $scope.data={};
                $scope.toSend=[];
                $scope.data.name = user.nickName;
                var interval = setInterval(function () {
                    refresh();
                }, 2000);

                var refresh = function () {
                    if (getFlag){
                        return;
                    }
                    getFlag = true;
                    Restangular.one('/get_sms').get()
                        .then(function (data) {
                            if ($scope.datas &&  _.last(data)._id!=_.last($scope.datas)._id && _.last(data).name != $scope.data.name){
                                showNotify(_.last(data).name+": "+_.last(data).content);
                            }
                            if(!$scope.datas || _.last(data)._id!=_.last($scope.datas)._id){
                                $scope.datas = dataFormat.format(data);
                            }
                            getFlag = false;
                        });
                };


                var showNotify = function (body) {
                    webNotification.showNotification('陈先森的院子有新消息!', {
                        body: body,
                        icon: '/images/favicon.ico',
                        onClick: function onNotificationClicked() {
                            console.log('Notification clicked.');
                        },
                        autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
                    }, function onShow(error, hide) {
                        if (error) {
                            window.alert('Unable to show notification: ' + error.message);
                        } else {
                            console.log('Notification Shown.');

                            setTimeout(function hideNotification() {
                                console.log('Hiding notification....');
                                hide(); //manually close the notification (you can skip this if you use the autoClose option)
                            }, 5000);
                        }
                    });
                };

                var deepCopy = function (source) {
                    var result = {};
                    for (var key in source) {
                        result[key] = typeof source[key] === 'object' ? deepCoyp(source[key]) : source[key];
                    }
                    return result;
                };

                $scope.history = function (){
                    var res = $uibModal.open({
                        templateUrl: 'javascripts/chat/history.html',
                        controller: 'historyCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        resolve: {
                            content: function () {
                                return $scope.datas;
                            },
                        }
                    });
                };


                $scope.smsTest = function () {
                    var myDate = new Date();
                    var time = myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
                    $scope.data.date = time;
                    sendData = deepCopy($scope.data);
                    $scope.data.content = "";
                    $scope.toSend.push(sendData);
                    $scope.datas.splice(0,1);
                    $scope.datas[0].hide = false;
                    Restangular.one('/').post('add_sms', sendData)
                        .then(function (data) {
                            $scope.toSend.splice(0,1);
                            $scope.datas = dataFormat.format(data);
                        });
                };

                $scope.$on('$locationChangeStart', function (event, next, current) {
                        clearInterval(interval);
                }
                );


                refresh();
            }]);;/**
 * Created by CYF on 16/6/21.
 */
angular.module('myApp').controller('historyCtrl',[
    '$scope',
    'Restangular',
    '$uibModalInstance',
    'dataFormat',
    'content',
    function($scope,Restangular,$uibModalInstance,dataFormat,content){
        $scope.close = function(){
            $uibModalInstance.dismiss();
        }

    }

]);;/**
 * Created by yichen on 6/2/16.
 */
angular.module('myApp')
    .controller('HomeController',
        ['$scope',
            '$location',
            'LoginService',
            function ($scope, $location, LoginService) {
                LoginService.refresh();
                $scope.user = LoginService.getUserData();
                if (!_.isEmpty($scope.user)) {
                    $scope.logStatus = true;
                    $location.path('/chat');
                }

                $scope.logout = function(){
                    LoginService.clearUserData();
                    $scope.logStatus = false;
                    $location.path('/login');
                };

                $scope.$on("loginStatusChange",
                    function (event, msg) {
                        if(msg){
                            $scope.user = LoginService.getUserData();
                        }
                        $scope.logStatus = msg;
                    });
            }]);;/**
 * Created by yichen on 6/2/16.
 */
angular.module('myApp')
    .controller('LoginController',
        ['$scope',
            'Restangular',
            '$cookies',
            '$location',
            'LoginService',
            function ($scope,Restangular,$cookies,$location,LoginService) {

                var user = LoginService.getUserData();

                if (!_.isEmpty(user)) {
                    $location.path('/chat');
                }

                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 30);

                $scope.doLogin = function () {
                    Restangular.one('/login').get($scope.user)
                        .then(function (data) {
                            data.reqParams="";
                            $cookies.putObject('user', data, {'expires': expireDate.toUTCString()});
                            LoginService.saveUserData(data);
                            $scope.$emit("loginStatusChange", true);
                            $location.path('/chat');
                        },function(err){
                           alert(err.data.message);
                        });
                }
            }]);;/**
 * Created by yichen on 6/2/16.
 */
angular.module('myApp')
    .controller('RegisterController',
        ['$scope',
            'Restangular',
            '$cookies',
            '$location',
            'LoginService',
            function ($scope,Restangular,$cookies,$location,LoginService) {


                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 30);

                $scope.doRegister = function () {
                    if ($scope.repass!=$scope.user.pass){
                        alert("两次密码输入不匹配");
                        return;
                    }
                    Restangular.one('/').post("register",$scope.user)
                        .then(function (data) {
                            data.reqParams="";
                            $cookies.putObject('user', data, {'expires': expireDate.toUTCString()});
                            LoginService.saveUserData(data);
                            $scope.$emit("loginStatusChange", true);
                            $location.path('/chat');
                        },function(err){
                           alert(err.data.message);
                        });
                }
            }]);;angular.module('dataFormat', [])
    .factory('dataFormat',[
        function() {

            var service = {
                format:function (data) {
                    var temp = data;
                    for (var line=0;line<temp.length;line++){
                        var tempName = temp[line].name;
                        for(line-=-1;;line++ ){
                            if (line == temp.length){
                                break;
                            }
                            if(temp[line].name==tempName){
                                temp[line].hide = true;
                            }else{
                                line-=1;
                                break;
                            }
                        }
                    }
                    return temp;
                }
            };

            return service;
        }]);;/**
 * Created by yichen on 5/27/16.
 */
angular.module('loginService', [])
    .factory('LoginService',[
        '$cookies',
        function($cookies) {

            var localUser = {
            };

        var service = {
            saveUserData: function(user){
                localUser.name = user.name;
                localUser.nickName = user.nick_name;
                localUser.role = user.role;
                return localUser;
            },

            getUserData : function(){
                return _.isEmpty(localUser)?{}:{
                    name:localUser.name,
                    nickName:localUser.nickName,
                    role:localUser.role
                };
            },

            clearUserData : function(){
                localUser = {};
                $cookies.remove("user");
            },

            refresh : function(){
                if ($cookies.getObject("user")) {
                    service.saveUserData($cookies.getObject("user"));
                }else{
                    localUser = {};
                }
                return localUser;
            }
        };

        return service;
    }]);
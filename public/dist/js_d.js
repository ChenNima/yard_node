/**
 * Created by yichen on 5/27/16.
 */
'use strict';

angular.module('myApp', [
    'ngRoute',
    'loginService',
    'restangular',
    'ngCookies',
    'angular-web-notification'
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
            'webNotification',
            'LoginService',
            function ($scope, Restangular,$cookies,$location,webNotification,LoginService) {

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
                                dataFormat(data);
                            }
                            getFlag = false;
                        });
                };

                var dataFormat = function (data) {
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
                    $scope.datas = temp;
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
                            dataFormat(data);
                        });
                };

                $scope.$on('$locationChangeStart', function (event, next, current) {
                        clearInterval(interval);
                }
                );


                refresh();
            }]);;/**
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
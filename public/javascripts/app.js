/**
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
    'ui.bootstrap',
    'socketService',
])
    .config(['$locationProvider', '$routeProvider','RestangularProvider', function ($locationProvider, $routeProvider,RestangularProvider) {
    $locationProvider.hashPrefix('!');

        RestangularProvider.setBaseUrl('http://115.28.109.109:81/');

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
}]);
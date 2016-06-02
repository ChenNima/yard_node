/**
 * Created by yichen on 5/27/16.
 */
'use strict';

angular.module('myApp', [
    'ngRoute',
    'myApp.services',
    'restangular',
    'ngCookies'
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
    }]);
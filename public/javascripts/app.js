/**
 * Created by yichen on 5/27/16.
 */
'use strict';

angular.module('myApp', [
        'ngRoute',
        'myApp.services',
        'restangular'
    ])
    .controller('HomeController',
            ['$scope',
            'HitService',
            'Restangular',
            function($scope, HitService,Restangular) {
        //HitService.count()
        //    .then(function(data) {
        //        $scope.hits = data;
        //    });


        Restangular.one('/hits').get()
            .then(function (data){
                $scope.hits = data.hits;
            });

        $scope.registerHit = function() {
            Restangular.one('/hit').post()
                .then(function (data){
                    $scope.hits = data.hits;
                });

            //HitService.doHit()
            //    .then(function (data){
            //    $scope.hits = data;
            //});
        }
    }]);

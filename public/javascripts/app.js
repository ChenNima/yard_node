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
            function ($scope, HitService, Restangular) {
                //HitService.count()
                //    .then(function(data) {
                //        $scope.hits = data;
                //    });
                var sendData;

                setInterval(function () {
                    refresh();
                }, 1000);

                $scope.registerHit = function () {
                    Restangular.one('/hit').post()
                        .then(function (data) {
                            $scope.hits = data.hits;
                        });
                };

                var refresh = function(){
                    Restangular.one('/get_sms').get()
                        .then(function (data){
                            $scope.datas = data.smsArray.reverse();
                        });
                };

                var deepCopy= function(source) {
                    var result={};
                    for (var key in source) {
                        result[key] = typeof source[key]==='object'? deepCoyp(source[key]): source[key];
                    }
                    return result;
                };

                $scope.smsTest = function () {
                    var myDate = new Date();
                    var time = myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
                    $scope.data.date = time;
                    sendData = deepCopy($scope.data);
                    $scope.data.content = "";
                    Restangular.one('/').post('add_sms', {data: sendData})
                        .then(function (data) {
                            $scope.datas = data.smsArray.reverse();
                        });
                };

                refresh();
            }]);

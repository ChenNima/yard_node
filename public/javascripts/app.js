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

        setInterval(function(){
            Restangular.one('/get_sms').get()
                .then(function (data){
                    $scope.datas = data.smsArray.reverse();
                });
        },1000);

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

                $scope.smsTest = function() {
                    var myDate = new Date();
                    var time = myDate.getHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds();
                    $scope.data.date = time;
                    Restangular.one('/').post('add_sms', {data:$scope.data})
                        .then(function (data) {
                            $scope.datas = data.smsArray.reverse();
                            $scope.data.content="";
                        });
                }
    }]);

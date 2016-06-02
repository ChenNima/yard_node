/**
 * Created by yichen on 6/2/16.
 */
angular.module('myApp')
    .controller('ChatCtrl',
        ['$scope',
            'Restangular',
            '$cookieStore',
            '$location',
            function ($scope, Restangular,$cookieStore,$location) {

                var sendData;

                if (!$cookieStore.get("chatname")) {
                    $location.path('/login');
                    $location.replace();
                }
                $scope.data={};
                $scope.data.name = $cookieStore.get("chatname");

                setInterval(function () {
                    refresh();
                }, 1000);

                var refresh = function () {
                    Restangular.one('/get_sms').get()
                        .then(function (data) {
                            $scope.datas = data.smsArray.reverse();
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
                    Restangular.one('/').post('add_sms', {data: sendData})
                        .then(function (data) {
                            $scope.datas = data.smsArray.reverse();
                        });
                };

                $scope.logout =function(){
                    $cookieStore.remove("chatname");
                    $location.path('/login');
                    $location.replace();
                };

                refresh();
            }]);
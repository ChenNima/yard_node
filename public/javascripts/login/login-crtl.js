/**
 * Created by yichen on 6/2/16.
 */
angular.module('myApp')
    .controller('LoginController',
        ['$scope',
            '$cookieStore',
            '$location',
            function ($scope, $cookieStore,$location) {
                if ($cookieStore.get("chatname")) {
                    $scope.username = $cookieStore.get("chatname");
                    $location.path('/chat');
                    $location.replace();
                }

                $scope.doLogin = function () {
                    $cookieStore.put("chatname", $scope.username);
                    $location.path('/chat');
                    $location.replace();
                }
            }]);
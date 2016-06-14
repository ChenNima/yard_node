/**
 * Created by yichen on 6/2/16.
 */
angular.module('myApp')
    .controller('LoginController',
        ['$scope',
            '$cookieStore',
            '$cookies',
            '$location',
            function ($scope, $cookieStore,$cookies,$location) {
                if ($cookies.get("chatname")) {
                    $scope.username = $cookies.get("chatname");
                    $location.path('/chat');
                }

                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 30);

                $scope.doLogin = function () {
                    //$cookieStore.put("chatname", $scope.username);
                    $cookies.put('chatname', $scope.username, {'expires': expireDate.toUTCString()});
                    $location.path('/chat');
                }
            }]);
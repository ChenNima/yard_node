/**
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
            }]);
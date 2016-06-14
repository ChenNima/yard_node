/**
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
            }]);
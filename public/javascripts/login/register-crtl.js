/**
 * Created by yichen on 6/2/16.
 */
angular.module('myApp')
    .controller('RegisterController',
        ['$scope',
            'Restangular',
            '$cookies',
            '$location',
            'LoginService',
            function ($scope,Restangular,$cookies,$location,LoginService) {


                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 30);

                $scope.doRegister = function () {
                    if ($scope.repass!=$scope.user.pass){
                        alert("两次密码输入不匹配");
                        return;
                    }
                    Restangular.one('/').post("register",$scope.user)
                        .then(function (data) {
                            data.reqParams="";
                            $cookies.putObject('user', data, {'expires': expireDate.toUTCString()});
                            LoginService.saveUserData(data);
                            $location.path('/chat');
                        },function(err){
                           alert(err.data.message);
                        });
                }
            }]);
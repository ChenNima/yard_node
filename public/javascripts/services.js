/**
 * Created by yichen on 5/27/16.
 */
angular.module('myApp.services', [])
    .factory('LoginService',[
        '$cookies',
        function($cookies) {

            var localUser = {
            };

        var service = {
            saveUserData: function(user){
                localUser.name = user.name;
                localUser.nickName = user.nick_name;
                localUser.role = user.role;
                return localUser;
            },

            getUserData : function(){
                return localUser.nickName?localUser:null;
            },

            clearUserData : function(){
                localUser = {};
                $cookies.remove("user");
            },

            refresh : function(){
                if ($cookies.getObject("user")) {
                    service.saveUserData($cookies.getObject("user"));
                }else{
                    localUser = {};
                }
                return localUser;
            }
        };

        return service;
    }]);
/**
 * Created by yichen on 5/27/16.
 */
angular.module('myApp.services', [])
    .factory('HitService',[
        '$q',
        '$http',
        'Restangular',
        function($q, $http,Restangular) {

        var service = {
            count: function() {
                var d = $q.defer();
                $http.get('/hits')
                    .success(function(data, status) {
                        d.resolve(data.hits);
                    }).error(function(data, status) {
                    d.reject(data);
                });
                return d.promise;
            },
            registerHit: function() {
                var d = $q.defer();
                $http.post('/hit', {})
                    .success(function (data, status) {
                        d.resolve(data.hits);
                    }).error(function (data, status) {
                    d.reject(data);
                });
                return d.promise;

            },

        };
        return service;
    }]);
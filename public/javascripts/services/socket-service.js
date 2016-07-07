/**
 * Created by CYF on 16/6/28.
 */
angular.module('socketService', [])
    .factory('socketService',[
        '$rootScope',
        function ($rootScope) {
    var socket = io.connect('http://115.28.109.109:81/');
    return {
        reconnect : function () {
            if(socket.connected){
                socket.disconnect();
            }
            socket = io.connect('http://115.28.109.109:81/');
        },
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        },
        disconnect:function(){
            socket.disconnect();
        }
    };
}]);
/**
 * Created by yichen on 6/2/16.
 */
angular.module('myApp')
    .controller('ChatCtrl',
        ['$scope',
            'Restangular',
            '$cookies',
            '$location',
            '$uibModal',
            'webNotification',
            'LoginService',
            'dataFormat',
            'socketService',
            function ($scope, Restangular,$cookies,$location,$uibModal,webNotification,LoginService,dataFormat,socketService) {

                var sendData;

                //var getFlag = false;

                var user = LoginService.getUserData();

                $scope.onlineUsers = [];

                if (_.isEmpty(user)) {
                    $location.path('/login');
                }

                $scope.data={};
                $scope.toSend=[];
                $scope.data.name = user.nickName;
                socketService.reconnect();

                socketService.emit('login',{userName:user.nickName});

                socketService.on('chats',function(data){
                    if ($scope.datas &&  _.last(data)._id!=_.last($scope.datas)._id && _.last(data).name != $scope.data.name){
                        showNotify(_.last(data).name+": "+_.last(data).content);
                    }
                    if(!$scope.datas || _.last(data)._id!=_.last($scope.datas)._id){
                        $scope.datas = dataFormat.format(data);
                    }
                });

                socketService.on('chat_added',function(data){
                    console.log('posted');
                    //$scope.toSend.splice(0,1);
                });

                socketService.on('user_login_change',function(data){
                    $scope.onlineUsers = data;
                });


                var showNotify = function (body) {
                    webNotification.showNotification('陈先森的院子有新消息!', {
                        body: body,
                        icon: '/images/favicon.ico',
                        onClick: function onNotificationClicked() {
                            console.log('Notification clicked.');
                        },
                        autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
                    }, function onShow(error, hide) {
                        if (error) {
                            window.alert('Unable to show notification: ' + error.message);
                        } else {
                            console.log('Notification Shown.');

                            setTimeout(function hideNotification() {
                                console.log('Hiding notification....');
                                hide(); //manually close the notification (you can skip this if you use the autoClose option)
                            }, 5000);
                        }
                    });
                };

                var deepCopy = function (source) {
                    var result = {};
                    for (var key in source) {
                        result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
                    }
                    return result;
                };

                $scope.history = function (){
                    var res = $uibModal.open({
                        templateUrl: 'javascripts/chat/history.html',
                        controller: 'historyCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        resolve: {
                            user: function () {
                                return $scope.data.name;
                            }
                        }
                    });
                };


                $scope.smsTest = function () {
                    var myDate = new Date();
                    var time = myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
                    $scope.data.date = time;
                    sendData = deepCopy($scope.data);
                    $scope.data.content = "";

                    socketService.emit('add_new',{
                        data : sendData
                    })
                };

                $scope.$on('$locationChangeStart', function (event, next, current) {
                        socketService.disconnect();
                }
                );

            }]);
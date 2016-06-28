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
            'socket',
            function ($scope, Restangular,$cookies,$location,$uibModal,webNotification,LoginService,dataFormat,socket) {

                var sendData;

                //var getFlag = false;

                var user = LoginService.getUserData();

                if (_.isEmpty(user)) {
                    $location.path('/login');
                }

                $scope.data={};
                $scope.toSend=[];
                $scope.data.name = user.nickName;
                socket.reconnect();

                socket.emit('login',{userName:user.nickName});

                socket.on('chats',function(data){
                    if ($scope.datas &&  _.last(data)._id!=_.last($scope.datas)._id && _.last(data).name != $scope.data.name){
                        showNotify(_.last(data).name+": "+_.last(data).content);
                    }
                    if(!$scope.datas || _.last(data)._id!=_.last($scope.datas)._id){
                        $scope.datas = dataFormat.format(data);
                    }
                });

                socket.on('chat_added',function(data){
                    console.log('posted');
                    //$scope.toSend.splice(0,1);
                });

                //var interval = setInterval(function () {
                //    refresh();
                //}, 2000);

                //var refresh = function () {
                //    if (getFlag){
                //        return;
                //    }
                //    getFlag = true;
                //    Restangular.one('/get_sms').get()
                //        .then(function (data) {
                //            if ($scope.datas &&  _.last(data)._id!=_.last($scope.datas)._id && _.last(data).name != $scope.data.name){
                //                showNotify(_.last(data).name+": "+_.last(data).content);
                //            }
                //            if(!$scope.datas || _.last(data)._id!=_.last($scope.datas)._id){
                //                $scope.datas = dataFormat.format(data);
                //            }
                //            getFlag = false;
                //        });
                //};


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
                        result[key] = typeof source[key] === 'object' ? deepCoyp(source[key]) : source[key];
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
                            content: function () {
                                return $scope.datas;
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

                    //$scope.toSend.push(sendData);
                    //$scope.datas.splice(0,1);
                    //$scope.datas[0].hide = false;

                    //Restangular.one('/').post('add_sms', sendData)
                    //    .then(function (data) {
                    //        $scope.toSend.splice(0,1);
                    //        $scope.datas = dataFormat.format(data);
                    //    });
                    socket.emit('add_new',{
                        data : sendData
                    })
                };

                $scope.$on('$locationChangeStart', function (event, next, current) {
                        socket.disconnect();
                        //clearInterval(interval);
                }
                );


                //refresh();
            }]);
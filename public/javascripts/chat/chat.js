/**
 * Created by yichen on 6/2/16.
 */
angular.module('myApp')
    .controller('ChatCtrl',
        ['$scope',
            'Restangular',
            '$cookieStore',
            '$location',
            'webNotification',
            function ($scope, Restangular,$cookieStore,$location,webNotification) {

                var sendData;

                var getFlag = false;


                if (!$cookieStore.get("chatname")) {
                    $location.path('/login');
                    $location.replace();
                }
                $scope.data={};
                $scope.data.name = $cookieStore.get("chatname");
                $scope.names = [];
                setInterval(function () {
                    refresh();
                }, 2000);

                var refresh = function () {
                    if (getFlag){
                        return;
                    }
                    getFlag = true;
                    Restangular.one('/get_sms').get()
                        .then(function (data) {
                            if ($scope.datas &&  _.last(data)._id!=_.last($scope.datas)._id && _.last(data).name != $scope.data.name){
                                showNotify(_.last(data).name+": "+_.last(data).content);
                            }
                            if(!$scope.datas || _.last(data)._id!=_.last($scope.datas)._id){
                                dataFormat(data);
                            }
                            getFlag = false;
                        });
                };

                var dataFormat = function (data) {
                    var temp = data;
                    $scope.names = [];
                    for (var line=0;line<temp.length;line++){
                        var tempName = temp[line].name;
                        $scope.names.push(temp[line].name);
                        for(line-=-1;;line++ ){
                            if (line == temp.length){
                                break;
                            }
                            if(temp[line].name==tempName){
                                $scope.names.push(temp[line].name);
                                temp[line].name="";
                                temp[line].date="";
                            }else{
                                line-=1;
                                break;
                            }
                        }
                    }
                    $scope.datas = temp;
                };

                var showNotify = function (body) {
                    webNotification.showNotification('陈先森的院子有新消息!', {
                        body: body,
                        icon: '/public/images/favicon.ico',
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

                $scope.smsTest = function () {
                    var myDate = new Date();
                    var time = myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
                    $scope.data.date = time;
                    sendData = deepCopy($scope.data);
                    $scope.data.content = "";
                    Restangular.one('/').post('add_sms', sendData)
                        .then(function (data) {
                            dataFormat(data);
                        });
                };

                $scope.logout =function(){
                    $cookieStore.remove("chatname");
                    $location.path('/login');
                    $location.replace();
                };

                refresh();
            }]);
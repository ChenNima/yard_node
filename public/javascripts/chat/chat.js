/**
 * Created by yichen on 6/2/16.
 */
angular.module('myApp')
    .controller('ChatCtrl',
        ['$scope',
            'Restangular',
            '$cookieStore',
            '$location',
            function ($scope, Restangular,$cookieStore,$location) {

                var sendData;

                var refreshFlag = false;

                if (!$cookieStore.get("chatname")) {
                    $location.path('/login');
                    $location.replace();
                }
                $scope.data={};
                $scope.data.name = $cookieStore.get("chatname");
                $scope.names = [];
                setInterval(function () {
                    refresh();
                }, 1000);

                var refresh = function () {
                    if(refreshFlag){
                        return;
                    }
                    refreshFlag = true;
                    Restangular.one('/get_sms').get()
                        .then(function (data) {
                            var temp = data.smsArray.reverse();
                            $scope.protoDatas = new Array(data.smsArray);
                            for (var line=0;line<temp.length;line++){
                                var tempName = temp[line].data.name;
                                $scope.names.push(temp[line].data.name);
                                for(line-=-1;;line++ ){
                                    if (line == temp.length){
                                        break;
                                    }
                                    if(temp[line].data.name==tempName){
                                        $scope.names.push(temp[line].data.name);
                                        temp[line].data.name="";
                                        temp[line].data.date="";
                                    }else{
                                        line-=1;
                                        break;
                                    }
                                }
                            }
                            $scope.datas = temp;
                            refreshFlag = false;
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
                    Restangular.one('/').post('add_sms', {data: sendData})
                        .then(function (data) {
                            $scope.datas = data.smsArray.reverse();
                        });
                };

                $scope.logout =function(){
                    $cookieStore.remove("chatname");
                    $location.path('/login');
                    $location.replace();
                };

                refresh();
            }]);
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
                }, 2000);

                var refresh = function () {
                    if(refreshFlag){
                        return;
                    }
                    refreshFlag = true;
                    Restangular.one('/get_sms').get()
                        .then(function (data) {
                            //if($scope.datas && _.last(data.smsArray).data._id==_.last($scope.datas).data._id){
                            //    //return;
                            //}
                            dataFormat(data);
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
                    refreshFlag = false;
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
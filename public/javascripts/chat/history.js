/**
 * Created by CYF on 16/6/21.
 */
angular.module('myApp').controller('historyCtrl',[
    '$scope',
    'Restangular',
    '$uibModalInstance',
    'dataFormat',
    'user',
    function($scope,Restangular,$uibModalInstance,dataFormat,user){
        $scope.limit = 10;
        $scope.totalItems = 834;
        $scope.currentPage = 1;
        $scope.data ={};
        $scope.data.name = user;

        Restangular.one('sms-count').get().then(function(data){
            $scope.totalItems = data.count;
            getPage();
        });

        var getPage = function(){
            var page = arguments[0]||0;
            Restangular.all('sms').getList({page:page,limit:$scope.limit}).then(function(data){
                $scope.datas = dataFormat.format(data);
            })
        };

        $scope.setPage = function (pageNo) {
            if(Math.ceil($scope.totalItems/$scope.limit)>=pageNo&&pageNo>0){
                $scope.currentPage = pageNo;
                $scope.pageChanged();
            }
        };

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.currentPage);
            getPage($scope.currentPage-1);
        };

        $scope.maxSize = 5;

        $scope.close = function(){
            $uibModalInstance.dismiss();
        };

    }

]);
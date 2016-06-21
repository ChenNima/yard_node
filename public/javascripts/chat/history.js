/**
 * Created by CYF on 16/6/21.
 */
angular.module('myApp').controller('historyCtrl',[
    '$scope',
    'Restangular',
    '$uibModalInstance',
    'dataFormat',
    'content',
    function($scope,Restangular,$uibModalInstance,dataFormat,content){
        $scope.close = function(){
            $uibModalInstance.dismiss();
        }

    }

]);
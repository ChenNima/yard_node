/**
 * Created by CYF on 16/8/29.
 */
var kMedoids = require('../task/k-medoids');
var lab = require('../lab');
var _ = require('underscore');

var dataPromise = lab.getAllData();

var distance = Number.MAX_VALUE;

var currentClusters = {};

var dataNum = 0;

var dataSort = function(data){
    return _.sortBy(data,'distance').reverse();
};


exports.exec = function(num){
    if(num<=1){
        return;
    }

    dataPromise.then(function(dataSet){

        dataNum = dataSet.length;

        var threshold = Math.round((dataNum/num)*0.3);
        console.log(threshold);
        currentClusters = dataSort(kMedoids.learn(dataSet,2).clusters);

        for(var i=0; currentClusters.length<=num-1;i++){
            var tempCluster = currentClusters[0].cluster;
            currentClusters.splice(0,1);
            var res = kMedoids.learn(tempCluster,2).clusters;
            var addCluster = [];
            var zeroFlag = false;
            res.forEach(function(data,index){
                if(data.cluster.length>=threshold){
                    addCluster.push(res[index]);
                    console.log(data.cluster.length+'个数据被添加');
                }else{
                    dataNum -= data.cluster.length;
                    threshold = Math.round(((dataNum)/num)*0.3);
                    console.log('阈值更新:'+threshold);
                }
                if(data.cluster.length==0){
                    zeroFlag = true;
                }
            });
            if(!zeroFlag){
                currentClusters = currentClusters.concat(addCluster);
            }
            currentClusters = dataSort(currentClusters);
        }

        var totalDistance = 0;
        currentClusters.forEach(function(cluster){
            totalDistance += cluster.distance;
            console.log('中心点:'+cluster.center.lat+','+cluster.center.long+' 集群点数: '+cluster.cluster.length+' 方差: '+cluster.distance);
        });
        console.log('总方差:'+totalDistance);

    });


};
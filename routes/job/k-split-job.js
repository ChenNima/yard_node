/**
 * Created by CYF on 16/8/29.
 */
var kMedoids = require('../task/k-medoids');
var lab = require('../lab');
var _ = require('underscore');

var dataPromise = lab.getAllData();

var distance;

var currentClusters;

var dataNum = 0;

var dataSort = function(data){
    return _.sortBy(data,'distance').reverse();
};

var judgeDeltaDistance = function(dis,originDis){
    return dis<=originDis;
};

exports.noKExec = function(){
    distance = Number.MAX_VALUE;

    var doneClusters = [];

    var threshold;

    dataPromise.then(function(dataSet){

        var start = new Date();

        var totalDistance=0;

        dataNum = dataSet.length;

        currentClusters = dataSort(kMedoids.learn(dataSet,2).clusters);

        var testDistance = (currentClusters[0].distance+currentClusters[1].distance)/(2/0.7);
        console.log('方差阈值：'+testDistance);
        for(var i=0; currentClusters.length>0;i++){
            var deltaDisFlag = true;
            threshold = Math.round((dataNum/(doneClusters.length+currentClusters.length))*0.25);
            console.log('阈值：'+threshold);
            var originClusterHolder = currentClusters[0];
            currentClusters.splice(0,1);
            var originDistance = originClusterHolder.distance;
            var originClusters = originClusterHolder.cluster;
            console.log('母数据方差:'+originDistance);
            var res = kMedoids.learn(originClusters,2).clusters;
            res.forEach(function(cluster){
                if(cluster.cluster.length<=threshold){
                    dataNum -= cluster.distance;
                    console.log('抛弃：'+cluster.cluster.length);
                }else if(judgeDeltaDistance(cluster.distance,testDistance)){
                    deltaDisFlag = false;
                    doneClusters.push(cluster);
                    dataNum -= cluster.distance;
                    console.log('接受方差：'+cluster.distance);
                }else{
                    currentClusters.push(cluster);
                    console.log('继续：'+cluster.cluster.length)
                }
            });
            currentClusters = dataSort(currentClusters);
            console.log('当前学习次数：'+i);
            console.log('当前完成分类：'+doneClusters.length);
            console.log('待分类：'+currentClusters.length);
        }
        console.log('总完成时间:'+(new Date() - start));
        var totalNum =0;
        doneClusters.forEach(function(cluster){
            totalNum+=cluster.cluster.length;
            totalDistance += cluster.distance;
            console.log('中心点:'+cluster.center.lat+','+cluster.center.long+' 集群点数: '+cluster.cluster.length+' 方差: '+cluster.distance);
        });
        console.log('全局平均方差:'+(totalDistance/doneClusters.length));
        console.log('剩余点数:'+totalNum);
    });
};

exports.exec = function(num){

    distance = Number.MAX_VALUE;

    currentClusters = {};

    if(num<=1){
        return;
    }

    dataPromise.then(function(dataSet){
        var start = new Date();
        console.log('开始k-split,已获取数据');

        dataNum = dataSet.length;

        var threshold = Math.round((dataNum/num)*0.2);
        console.log(threshold);
        currentClusters = dataSort(kMedoids.learn(dataSet,2).clusters);

        for(var i=0; currentClusters.length<=num-1;i++){
            var tempCluster = currentClusters[0].cluster;
            console.log('母数据方差:'+currentClusters[0].distance);
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
                    threshold = Math.round(((dataNum)/num)*0.2);
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
            console.log('当前学习次数：'+i);
        }
        console.log('总完成时间:'+(new Date() - start));
        var totalDistance = 0;
        currentClusters.forEach(function(cluster, index){
            totalDistance += cluster.distance;
            lab.saveCluster(cluster, index);
            console.log('中心点:'+cluster.center.lat+','+cluster.center.long+' 集群点数: '+cluster.cluster.length+' 方差: '+cluster.distance);
        });
        console.log('全局平均方差:'+(totalDistance/num));
        console.log('剩余点数:'+dataNum);

    });


};
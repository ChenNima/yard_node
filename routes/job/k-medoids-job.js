/**
 * Created by CYF on 16/8/29.
 */
var kMedoids = require('../task/k-medoids');
var lab = require('../lab');

var dataPromise = lab.getAllData();

exports.exec = function(num,it){

    var distance = Number.MAX_VALUE;

    var cluster = {};
    dataPromise.then(function(dataSet){
        var start = new Date();

        for(var i=0;i<it;i++){
            var clusterHolder = kMedoids.learn(dataSet,num);
            if(clusterHolder.distance<distance){
                distance = clusterHolder.distance;
                cluster = clusterHolder;
            }
        }
        console.log('完成时间:'+(new Date() - start));
        console.log('最小距离：'+distance);
        cluster.clusters.forEach(function(cluster){
            console.log('中心点:'+cluster.center.lat+','+cluster.center.long+' 集群点数: '+cluster.cluster.length+' 方差: '+cluster.distance);
        });
    });


};
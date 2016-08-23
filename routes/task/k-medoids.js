/**
 * Created by fan on 2016/8/23.
 */
var lab = require('../lab');

var dataPromise = lab.getAllData();

var loc = function(lat,long){
    this.lat = ((lat-31)*100).toFixed(3);
    this.long = ((long-121)*100).toFixed(3);
};

var getRandomSpot = function(num,array,center,clusters){
    for(var i =0;i<num;i++){
        center.push(array[parseInt(Math.random()*array.length)]);
        clusters.push([]);
    }
};

var findNearestCenter = function(center,clusters,locations){
    for(var i=0;i<clusters.length;i++){
        clusters[i] = [];
    }
    locations.forEach(function(location){
        var distance = Number.MAX_VALUE;
        var index = 0;
        for(var i=0;i<center.length;i++){
            var currentDis = getEuclidDis(location,center[i]);
            if(currentDis < distance){
                index =i;
                distance = currentDis;
            }
        }
        clusters[index].push(location);
    });
};

var findBestCenter = function(center,clusters){
    var localDis = 0;
    clusters.forEach(function(cluster,index){
        var centerSpot = center[index];
        var minDis = Number.MAX_VALUE;
        cluster.forEach(function(location){
            var sumDis = 0;
            cluster.forEach(function(loc){
                sumDis += Number(getEuclidDis(loc,location));
            });
            if(sumDis<minDis){
                minDis = sumDis;
                centerSpot = location;
            }
        });
        center[index] = centerSpot;
        localDis+=minDis;
    });
    return localDis;
};

var getEuclidDis = function(pointA,pointB){
    var deltaLat = pointA.lat-pointB.lat;
    var deltaLong = pointA.long-pointB.long;
    return Math.sqrt(deltaLat*deltaLat+deltaLong*deltaLong).toFixed(3)
};

var learn = function(dataSet){
    var localLocations = [];

    var localCenter = [];

    var localClusters = [];

    var localDistance = Number.MAX_VALUE;

        dataSet.forEach(function(data){
            localLocations.push(new loc(data.lat,data.long));
        });
        getRandomSpot(4,localLocations,localCenter,localClusters);

        for(var i=0;i<10;i++){
            findNearestCenter(localCenter,localClusters,localLocations);
            var tempDistance = findBestCenter(localCenter,localClusters);
            if(tempDistance<localDistance){
                localDistance = tempDistance;
            }
            console.log('当前学习次数：'+i+' 当前各个集群大小：'+localClusters[0].length+' '+localClusters[1].length+' '+localClusters[2].length+' '+localClusters[3].length);
        }

        localCenter.forEach(function(spot){
            spot.lat = (spot.lat/100)+31;
            spot.long = (spot.long/100)+121;
        });
        console.log(localCenter);
        console.log('总计距离：'+localDistance);
        return {
            center:localCenter,
            clusters:localClusters,
            distance:localDistance
        }
};

exports.exec = function(){

    var distance = Number.MAX_VALUE;

    var cluster = {};
    dataPromise.then(function(dataSet){
        for(var i=0;i<20;i++){
            var clusterHolder = learn(dataSet);
            if(clusterHolder.distance<distance){
                distance = clusterHolder.distance;
                cluster = clusterHolder;
            }
        }

        console.log('最小距离：'+distance+',最优分类：'+JSON.stringify(cluster.center));
        console.log('最佳各个集群大小：'+cluster.clusters[0].length+' '+cluster.clusters[1].length+' '+cluster.clusters[2].length+' '+cluster.clusters[3].length);

        lab.saveCluster(cluster.center);
    });


};
/**
 * Created by fan on 2016/8/23.
 */
var lab = require('../lab');
var _ = require('underscore');

var loc = function(lat,long){
    //this.lat = ((lat-31)*100);
    //this.long = ((long-121)*100);
    this.lat = lat;
    this.long = long;
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
            if(location === center[i]){
                index =i;
                distance = 0;
                break;
            }
            var currentDis = getEuclidDis(location,center[i]);
            if(currentDis < distance){
                index =i;
                distance = currentDis;
            }
        }
        clusters[index].push(location);
    });
};

var findBestCenter = function(center,clusters,distances){
    var localDis = 0;
    clusters.forEach(function(cluster,index){
        var centerSpot = center[index];
        var minDis = Number.MAX_VALUE;
        cluster.forEach(function(location){
            var sumDis = 0;
            cluster.forEach(function(loc){
                sumDis += Number(getEuclidDis(loc,location));
            });
            sumDis /= cluster.length>1?(cluster.length-1):cluster.length;
            if(sumDis<minDis){
                minDis = sumDis;
                centerSpot = location;
            }
        });
        distances[index] = minDis;
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

var learn = function(dataSet,num){

    var localLocations = [];

    var localCenter = [];

    var localClusters = [];

    var localDistances = [];

    var localDistance = Number.MAX_VALUE;

        dataSet.forEach(function(data){
            //localLocations.push(new loc(data.lat,data.long));
            localLocations.push(data);
        });
        getRandomSpot(num,localLocations,localCenter,localClusters);

        for(var i=0;i<10;i++){
            var previousCluster = localClusters.slice();
            findNearestCenter(localCenter,localClusters,localLocations);
            var tempDistance = findBestCenter(localCenter,localClusters,localDistances);
            if(tempDistance<localDistance){
                localDistance = tempDistance;
            }
            console.log('当前学习次数：'+i+' 当前各个集群大小：');
            var length = '';
            localClusters.forEach(function(cluster){
                length += ' '+cluster.length;
            });
            console.log(length);
            if(_.isEqual(previousCluster,localClusters)){
                break;
            }
        }

        //localCenter.forEach(function(spot){
        //    spot.lat = (spot.lat/100)+31;
        //    spot.long = (spot.long/100)+121;
        //});
    //localClusters.forEach(function(Cluster){
    //    Cluster.forEach(function(spot){
    //        spot.lat = (spot.lat/100)+31;
    //        spot.long = (spot.long/100)+121;
    //    });
    //});
    //    console.log(localCenter);
        console.log('平均方差：'+(localDistance/num));
        localDistances.forEach(function(data){
            console.log(data+' ');
        });
        var clusters = [];
        localCenter.forEach(function(center,index){
            clusters.push({
                center:center,
                cluster:localClusters[index],
                distance:localDistances[index]
            });
        });

        return {
            clusters:clusters,
            distance: localDistance
        }
};


exports.learn = learn;
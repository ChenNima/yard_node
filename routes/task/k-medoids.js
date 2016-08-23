/**
 * Created by fan on 2016/8/23.
 */
var lab = require('../lab');

var dataPromise = lab.getAllData();

var loc = function(lat,long){
    this.lat = lat;
    this.long = long;
};

var locations = [];

exports.exec = function(){
    dataPromise.then(function(dataSet){
        dataSet.forEach(function(data){
            locations.push(new loc(data.lat,data.long));
        });
        console.log(locations.length);
    });
};
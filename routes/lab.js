/**
 * Created by yichen on 6/3/16.
 */
var mongoose = require('mongoose');
var _ = require('underscore');
var q = require("q");

var labSchema = new mongoose.Schema({
    date: Date,
    month:Number,
    day:Number,
    lat: Number,
    long:Number,
    network:String,
    heading:Number,
    accuracy:Number,
    bandwidth:Number
});

var clusterSchema = new mongoose.Schema({
    code: Number,
    center: labSchema,
    cluster:[labSchema],
    distance: Number
});

var daySchema = new mongoose.Schema({
    date: Date,
    locations: [Number],
    cluster:[labSchema]
});

var cluster = mongoose.model('cluster',clusterSchema);

var lab = mongoose.model('lab', labSchema);

var day = mongoose.model('day', daySchema);

exports.post = function(req, res){
    var myLab =  req.body;
    var myDate = new Date(myLab.date);
    myLab.month = myDate.getMonth();
    myLab.day = myDate.getDate();
    var newLab = new lab(myLab);
    newLab.save(function (err, lab) {
        if (err) return console.error(err);
        res.status(200).send(lab);
    });
};

exports.getAllData = function(){
  return lab.find().exec();
};

exports.saveCluster = function(centerCluster, code){
    var newCluster = new cluster({
        code: code,
        center: centerCluster.center,
        cluster: centerCluster.cluster,
        distance: centerCluster.distance
    });
    newCluster.save(function (err, cluster){});
};

exports.groupDay = function(){
    q.all([lab.find().exec(), cluster.find().exec()]).spread(function(dataSet, clusters) {
        var group = _.groupBy(dataSet, function(data) {
            var date = data.date;
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        });

        var locCodeArray = [];
        _.each(clusters, function(cluster) {
            _.each(cluster.cluster, function(point) {
                locCodeArray.push({
                    code: cluster.code,
                    id: point.id
                });
            });
        });

        _.each(group, function(locations) {
            var locArray = [];
            _.each(locations, function(location) {
                var match = locCodeArray.filter(function(locCode) {
                    return locCode.id === location.id;
                });
                if(match.length) {
                    if(!locArray.length || locArray[locArray.length-1] !== match[0].code){
                        locArray.push(match[0].code);
                    }
                }
            });
            var newDay = new day({
                date: locations[0].date,
                locations: locArray,
                cluster: locations
            });

            newDay.save();
            //console.log(locArray);
        });

    });

    //lab.find().exec().then(function(dataSet) {
    //    var group = _.groupBy(dataSet, function(data) {
    //        var date = data.date;
    //        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    //    });
    //
    //    cluster.find().exec().then(function() {
    //
    //    });
    //
    //    console.log(group.length);
    //});
};

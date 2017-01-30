/**
 * Created by yichen on 6/3/16.
 */
var mongoose = require('mongoose');

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

var cluster = mongoose.model('cluster',clusterSchema);

var lab = mongoose.model('lab', labSchema);

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

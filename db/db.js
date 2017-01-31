var mongoose = require('mongoose');
var lab = require('../routes/lab');
var kdays = require('../routes/task/k-medoids-day');
var kMedoids = require('../routes/task/k-medoids');
var kMedoidsJob = require('../routes/job/k-medoids-job');
var kSplitJob = require('../routes/job/k-split-job');


exports.connect = function(){
    //mongoose.connect('mongodb://yifei.chen:FFff1122@ds021663.mlab.com:21663/mrc_mongo');
    mongoose.connect('mongodb://yifei:ffffff@mrchen.pub:27028');
    //mongoose.connect('mongodb://mrchen.pub:27017/mrc_mongo');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        console.log("DB connected");

        //lab.getAllDays().then(function(dataSet) {
        //    var test = kdays.learn(dataSet, 3);
        //    test.clusters.forEach(function(cluster, index) {
        //        lab.saveDayCluster(cluster, index);
        //    });
        //    console.log(test);
        //});
        //lab.groupDay();
        //for(var i=0;i<10;i++){
        //    kMedoidsJob.exec(7,7);
        //    kSplitJob.exec(7);
        //    kSplitJob.noKExec();
        //}

        //kMedoidsJob.exec(5,7);
        //kSplitJob.exec(5);
        //kSplitJob.noKExec();
    });
};
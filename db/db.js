var mongoose = require('mongoose');
var kMedoids = require('../routes/task/k-medoids');

exports.connect = function(){
    //mongoose.connect('mongodb://yifei.chen:FFff1122@ds021663.mlab.com:21663/mrc_mongo');
    mongoose.connect('mongodb://mrchen.pub:27017/mrc_mongo');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        console.log("DB connected");
        kMedoids.exec();
    });
};
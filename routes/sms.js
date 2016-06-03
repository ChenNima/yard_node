/**
 * Created by yichen on 6/1/16.
 */
var mongoose = require('mongoose');

var chatLogSchema = new mongoose.Schema({
    name: String,
    content:String,
    date:String
});
var chatLog = mongoose.model('chat_log', chatLogSchema);

var smsArray = [];

//var refresh = function(callback){
//    chatLog.find(function (err, logs) {
//        if (err) return console.error(err);
//        smsArray = [];
//        for (var index in logs){
//            smsArray.push({data:logs[index]._doc});
//        }
//        if(callback){
//            callback();
//        }
//    });
//};

var refresh = function(callback){
    chatLog.count({},function (err, count){
        chatLog
            .find()
            .skip(count-25)
            .limit(25)
            .exec(function (err, logs) {
                if (err) return console.error(err);
                smsArray = [];
                for (var index in logs){
                    smsArray.push({data:logs[index]._doc});
                }
                if(callback){
                    callback();
                }
            });
    });
};

refresh();


//chatLog.findById(new mongoose.Types.ObjectId("575025d58f87990300fdb35a"),function (err, doc) {
//    if (err) return console.error(err);
//    console.log(doc);
//});



exports.get = function(req, res){
    refresh(function(){
        res.send(200, {
            smsArray: smsArray
        });
    });
};
exports.addNew = function(req, res) {
    var new_log = new chatLog(req.body.data);

    new_log.save(function (err, test) {
        if (err) return console.error(err);
        console.log(test.name+"saved");
    });
    smsArray.push(req.body);
    refresh(function(){
        res.send(200, {
            smsArray: smsArray
        });
    });
};
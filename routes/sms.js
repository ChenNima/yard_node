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

chatLog.find(function (err, logs) {
    if (err) return console.error(err);
    for (var index in logs){
        smsArray.push({data:logs[index]._doc});
    }
});



exports.get = function(req, res){
    res.send(200, {
        smsArray: smsArray
    });
};
exports.addNew = function(req, res) {
    var new_log = new chatLog(req.body.data);

    new_log.save(function (err, test) {
        if (err) return console.error(err);
        console.log(test.name+"saved");
    });
    smsArray.push(req.body);
    res.send(200, {
        smsArray: smsArray
    });
};
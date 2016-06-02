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

//var test = new chatLog({
//    name: "testName",
//    content:"testContent"
//});

//test.save(function (err, test) {
//    if (err) return console.error(err);
//
//});

var smsArray = [];

exports.get = function(req, res){
    res.send(200, {
        smsArray: smsArray
    });
};
exports.addNew = function(req, res) {
    var new_log = new chatLog({
        name: req.body.data.name,
        content:req.body.data.content,
        date:req.body.data.date
    });

    new_log.save(function (err, test) {
        if (err) return console.error(err);
        console.log(test.name+"saved");
    });
    smsArray.push(req.body);
    res.send(200, {
        smsArray: smsArray
    });
};
/**
 * Created by yichen on 6/1/16.
 */
var mongoose = require('mongoose');

var chatLogSchema = new mongoose.Schema({
    name: String,
    content: String,
    date: String
});
var chatLog = mongoose.model('chat_log', chatLogSchema);

var smsArray = [];

var refresh = function (callback) {
    chatLog.count({}, function (err, count) {
        chatLog
            .find()
            .skip(count - 25)
            .limit(25)
            .exec(function (err, logs) {
                if (err) return console.error(err);
                smsArray = [];
                for (var index in logs) {
                    smsArray.push(logs[index]._doc);
                }
                if (callback) {
                    callback();
                }
            });
    });
};

refresh();

exports.get = function (req, res) {
    refresh(function () {
        res.send(200, smsArray);
    });
};
exports.addNew = function (req, res) {
    var new_log = new chatLog(req.body);

    new_log.save(function (err, test) {
        if (err) return console.error(err);
        console.log(test.name + "saved");
        refresh(function () {
            res.send(200, smsArray);
        });
    });
    //smsArray.push(req.body);
};

exports.socketGet = function (callback) {
    refresh(function () {
        if(callback){
            callback(smsArray);
        }
    });
};

exports.socketPost = function (chat) {
    var new_log = new chatLog(chat);

    new_log.save(function (err, test) {
        if (err) {
            console.error(err);
            return {message: false}
        }
        console.log(test.name + "saved by socket");
        return {message: true}
    });
};
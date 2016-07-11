/**
 * Created by yichen on 6/1/16.
 */
var mongoose = require('mongoose');
var io = require('../socket/io');

var chatLogSchema = new mongoose.Schema({
    name: String,
    content: String,
    date: String
});
var chatLog = mongoose.model('chat_log', chatLogSchema);

var smsArray = [];

var refresh = function (page,limit,name,callback) {
    var myPage = parseInt(page);
    var myLimit = parseInt(limit);
    var skip = (myPage+1)*myLimit;
    var user = name||{$exists:true};
    chatLog.count({'name':user}, function (err, count) {
        if(skip>count){
            myLimit = skip - count;
            skip=count;
        }
        chatLog
            .find({name:user})
            .skip(count - skip)
            .limit(myLimit)
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

exports.getList = function (req, res) {
    var query = req.query;
    var page = query.page||0;
    var limit = query.limit||25;
    var user = query.name;
    refresh(page,limit,user,function () {
        res.status(200).send(smsArray);
    });
};
exports.addNew = function (req, res) {
    var new_log = new chatLog(req.body);

    new_log.save(function (err, test) {
        if (err) return console.error(err);
        console.log(test.name + "saved");
        io.postBroadcast();
        res.status(200).send(req.body)
    });
};

exports.count = function(req, res){
    var user = req.query.name||{$exists:true};
    chatLog.count({name:user}, function (err, count) {
        if (err) return console.error(err);
        res.status(200).send({count:count});
    });
};

exports.socketGet = function (callback) {
    refresh(0,25,null,function () {
        if(callback){
            callback(smsArray);
        }
    });
};

exports.socketPost = function (chat,callback) {
    var new_log = new chatLog(chat);

    new_log.save(function (err, test) {
        if (err) {
            console.error(err);
            callback(false);
            return;
        }
        console.log(test.name + "saved by socket");
        callback(true);
    });
};
/**
 * Created by CYF on 16/6/28.
 */
var chat = require('../routes/sms');
var _ = require('underscore');

var socketIo;

var chats=[];

var onlineUsers = [];

var refresh = function(){
    chat.socketGet(function(res){
        chats = res;
        socketIo.emit('chats',chats);
    });
};

var notifyLogin = function (name){
  if(!_.contains(onlineUsers,name)){
      onlineUsers.push(name);
      console.log('当前在线:'+onlineUsers);
      socketIo.emit('user_login_change',onlineUsers);
  }
};

var notifyLogout = function (name){
    if(_.contains(onlineUsers,name)){
        onlineUsers.splice(_.indexOf(onlineUsers,name),1);
        console.log('当前在线:'+onlineUsers);
        socketIo.emit('user_login_change',onlineUsers);
    }
};

exports.set = function(io){
    socketIo = io;
    socketIo.on('connection', function (socket) {
        console.log('user connected');

        refresh();

        socket.on('login', function(obj) {
            socket.name = obj.userName;
            console.log(socket.name+'登陆了');
            notifyLogin(socket.name);
        });

        socket.on('add_new',function(obj){
            chat.socketPost(obj.data,function(status){
                if(!status){
                    socket.emit('chat_added',{message:false});
                    return;
                }
                refresh();
                socketIo.emit('chat_added',{message:true});
            })
        });



        socket.on('disconnect', function(){
            console.log(socket.name+'登出了');
            notifyLogout(socket.name);
        });
    });

};

exports.postBroadcast = function(){
    refresh();
};
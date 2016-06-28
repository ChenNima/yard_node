/**
 * Created by CYF on 16/6/28.
 */
var chat = require('../routes/sms');

var socketIo;

var chats=[];

var refresh = function(socket){
    chat.socketGet(function(res){
        chats = res;
        socket.emit('chats',chats);
    });
};

exports.set = function(io){
    socketIo = io;
    socketIo.on('connection', function (socket) {
        console.log('user connected');

        refresh(socket);

        socket.on('login', function(obj) {
            socket.name = obj.userName;
            console.log(socket.name+'登陆了');
        });

        socket.on('add_new',function(obj){
            if(chat.socketPost(obj.data)){
                refresh(socket);
            }
        });



        socket.on('disconnect', function(){
            console.log(socket.name+'登出了');
        });
    });

};
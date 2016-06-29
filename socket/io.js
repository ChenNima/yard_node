/**
 * Created by CYF on 16/6/28.
 */
var chat = require('../routes/sms');

var socketIo;

var chats=[];

var refresh = function(){
    chat.socketGet(function(res){
        chats = res;
        socketIo.emit('chats',chats);
    });
};

exports.set = function(io){
    socketIo = io;
    socketIo.on('connection', function (socket) {
        console.log('user connected');

        refresh();

        socket.on('login', function(obj) {
            socket.name = obj.userName;
            console.log(socket.name+'登陆了');
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
        });
    });

};

exports.postBroadcast = function(){
    refresh();
};
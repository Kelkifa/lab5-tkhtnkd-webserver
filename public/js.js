var socket = io('http://localhost:3000');

var database;
socket.on('Send-to-all', data => {
    console.log(data);
})
socket.on('First-data', data => {
    database = data;
    console.log(data);
})
$(document).ready(() => {
    $('.btn').click(() => {
        socket.emit('Client-send-data', "huan bo doi");
    })


});
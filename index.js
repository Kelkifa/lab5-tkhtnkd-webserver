const express = require('express');
const port = 3000;
const path = require('path');
const app = express();


const data = { temperature: 12 }
app.use(express.static(path.join(__dirname, 'public')));

/** MQTT */
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://mqtt.flespi.io:1883', {
    username: 'FlespiToken OsiCBKm6ehY9L9iPXHCLLqxSBxlXdJUR22htDrpFzbCa8LNViguSuSAWfLJgkrVa'
});
const TOPIC = '/topic/qos0';

client.on('connect', function () {
    console.log(`connected to MQTT broker`);

    client.subscribe(TOPIC);
});
client.on('message', function (topic, message) {
    console.log(message.toString());

})

/** Socket IO */
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
    console.log('co nguoi ket noi: ', socket.id);
    socket.emit('First-data', data);

    socket.on('Client-send-data', data => {
        console.log(data);
    });

    socket.on('disconnect', () => {
        console.log('co nguoi disconnect', socket.id);
    })
})
// setInterval(() => {
//     io.sockets.emit('Send-to-all', "send all kia")
// }, 5000);

/** Server */
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

server.listen(port, () => {
    console.log(`Web at localhost:${port}`);
});

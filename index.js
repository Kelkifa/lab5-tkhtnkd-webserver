const express = require('express');
const port = 3000;
const path = require('path');
const app = express();



const data = { temperature: 12 }
app.use(express.static(path.join(__dirname, 'public')));

/** Connect to database */
const db = require('./src/core/connectDb');
db.connect();
/** get data from database */
const temperatureModel = require('./src/models/temperatureModel');


/** MQTT */
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://mqtt.flespi.io:1883', {
    username: 'FlespiToken OsiCBKm6ehY9L9iPXHCLLqxSBxlXdJUR22htDrpFzbCa8LNViguSuSAWfLJgkrVa'
});

const TOPIC = '/topic/qos0';

client.on('connect', function () {
    console.log(`[MQTT] connected to MQTT broker`);
    client.subscribe(TOPIC);
});

client.on('message', function (topic, message) {   //khi có message đến
    console.log(`[MQTT] message: ${message.toString()}`);


})

/** Socket IO */
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
    console.log(`[SOCKET] co nguoi ket noi: ${socket.id}`);  //Có client kết nối thì in id của client đó ra
    socket.emit('First-data', data);

    socket.on('Client-send-data', async (data) => {         //Khi socket client gửi dữ liệu
        try {
            const data = await temperatureModel.find();     //Lấy tất cả dữ liệu từ database 
            io.sockets.emit('Server-send-data', data)
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`[SOCKET] co nguoi disconnect: ${socket.id}`);
    })
})

/** Server */
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

server.listen(port, () => {
    console.log(`[SERVER] Web at localhost: ${port}`);
});

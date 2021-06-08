const express = require('express');
const port = 3000;
const path = require('path');
const app = express();



const data = { temperature: 12 }
app.use(express.static(path.join(__dirname, 'public')));

/** Connect to database */
const db = require('./src/core/connectDb');
db.connect();
/** require model data from database */
const temperatureModel = require('./src/models/temperatureModel');


const server = require('http').Server(app);


/** Socket IO */
const io = require('socket.io')(server);
io.on('connection', async socket => {
    try {
        const data = await temperatureModel.find().sort({ 'createdAt': 'DESC' }).limit(15).select('temperature createdAt -_id'); //lấy 5 giá trị mới nhất từ data base
        console.log(`[SOCKET] co nguoi ket noi: ${socket.id}`);  //Có client kết nối thì in id của client đó ra
        socket.emit('First-data', data);
        // await temperatureModel.deleteMany();
        socket.on('Client-send-data', async (data) => {         //Khi socket client gửi dữ liệu
            try {
                const data = await temperatureModel.find();     //Lấy tất cả dữ liệu từ database 
                io.sockets.emit('Server-send-data', data);
            }
            catch (error) {
                console.log(error);
            }
        });

        socket.on('disconnect', () => {                         //Khi có socket client disconnect
            console.log(`[SOCKET] co nguoi disconnect: ${socket.id}`);
        });

    } catch (error) {
        console.log(`Internal server: ${error.message}`);
    }
});

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

client.on('message', async function (topic, message) {   //khi có message đến
    console.log(`[MQTT] message: ${message.toString()}`);
    try {
        const temperature = new temperatureModel({ temperature: message });
        await temperature.save();
        console.log(`[SERVER] data is saved`);
        const data = await temperatureModel.find().sort({ 'createdAt': 'DESC' }).limit(15).select('temperature createdAt -_id'); //lấy 5 giá trị mới nhất từ data base
        io.sockets.emit('Server-send-data', data);
        console.log(`[SERVER] Data get: ${data}`);

    } catch (error) {
        console.log(`[SERVER] can't save: ${error}`);
    }
})


/** Server */
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

server.listen(port, () => {
    console.log(`[SERVER] Web at localhost: ${port}`);
});

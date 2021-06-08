var socket = io('http://localhost:3000');

// var database;

socket.on('Server-send-data', data => {
    // var database = data;
    rawChart(data.reverse());
    // console.log(data.reverse());
})
socket.on('First-data', data => {
    // database = data;
    rawChart(data.reverse());
    // console.log(data);
})
$(document).ready(() => {
    $('.btn').click(() => {


    });

});

function rawChart(data) {

    var tempArr = data.map(value => value.temperature);
    var timeArr = data.map(value => {
        var re = /(?<=T)\d+|(?<=:)\d+/g;
        var arr = value.createdAt.match(re);
        return `${arr[0]}:${arr[1]}:${arr[2]}`;
    });
    console.log(timeArr);
    console.log(tempArr);

    //Qủa biểu đồ
    let myChart = document.getElementById('myChart').getContext('2d');
    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 15;
    Chart.defaults.global.defaultFontColor = '#777';

    let massPopChart = new Chart(myChart, {
        type: 'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
            labels: timeArr,
            datasets: [{
                label: 'temperature',
                data: tempArr,
                //backgroundColor:'green',
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderWidth: 2,
                borderColor: '#c04000',
                hoverBorderWidth: 3,
                hoverBorderColor: '#000'
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Biểu đồ nhiệt độ đo đo từ ESP',
                fontSize: 25
            },
            legend: {
                display: true,
                position: 'right',
                labels: {
                    fontColor: '#000'
                }
            },
            layout: {
                padding: {
                    left: 50,
                    right: 0,
                    bottom: 0,
                    top: 40
                },
            },
            tooltips: {
                enabled: true
            }
        }
    });
}
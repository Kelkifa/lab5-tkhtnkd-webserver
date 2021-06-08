var socket = io('http://localhost:3000');

// var styledata ={createAt: String, temperature: String, humidity: String}

socket.on('Server-send-data', data => {
    // var database = data;
    rawChart(data.reverse(), 'temperature', 'myChart');
    rawChart(data, 'humidity', 'myChartHumidity');

})
socket.on('First-data', data => {
    // database = data;
    rawChart(data.reverse(), 'temperature', 'myChart');
    rawChart(data, 'humidity', 'myChartHumidity');
    // console.log(data);
})
$(document).ready(() => {
    $('.btn').click(() => {


    });

});

function rawChart(data, type, element) {

    var tempArr = data.map(value => value[type]);
    var timeArr = data.map(value => {
        var re = /(?<=T)\d+|(?<=:)\d+/g;
        var arr = value.createdAt.match(re);
        arr[0] = (parseInt(arr[0]) + 7) % 24;
        arr[0] = arr[0] < 10 ? "0" + arr[0] : arr[0];
        return `${arr[0]}:${arr[1]}:${arr[2]}`;
    });
    console.log(timeArr);
    console.log(tempArr);

    //Qủa biểu đồ
    let myChart = document.getElementById(element).getContext('2d');
    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 15;
    Chart.defaults.global.defaultFontColor = '#777';

    let massPopChart = new Chart(myChart, {
        type: 'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
            labels: timeArr,
            datasets: [{
                label: type === 'temperature' ? 'temperature' : 'humidity     ',
                data: tempArr,
                //backgroundColor:'green',
                backgroundColor: type === 'temperature' ? 'rgba(255, 99, 132, 0.5)' : "rgba(26, 113, 243, 0.5)",
                borderWidth: 2,
                borderColor: type === 'temperature' ? '#c04000' : '#165df5',
                hoverBorderWidth: 3,
                hoverBorderColor: '#f88017',
                // fill: false,
                tension: 0,

            }]
        },
        options: {
            title: {
                display: true,
                text: type === 'temperature' ? 'Biểu đồ nhiệt độ đo từ ESP' : 'Biểu đồ độ ẩm đo từ ESP',
                fontSize: 25,
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
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: type === 'temperature' ? 'temparature (C)' : 'humidity (%)'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'time (hh/mm/ss)'
                    }
                }],
            }
        }
    });
}
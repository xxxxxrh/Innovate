var dom = document.getElementById("weatherTimeLine");
var weatherChart = echarts.init(dom);
d3.json("../json/201901.json", function (error,data11) {

    if (error) {
        console.log(error);
    }
    console.log(data11);
    //获取数据
    data = []
    var dataList = data11.showapi_res_body.list;
    // console.log(dataList);
    dataList.forEach(element => {
        // console.log(element);
        time = element.time
        year = time.substring(0, 4);
        month = time.substring(4, 6);
        day = time.substring(6, 8);

        data.push([
            [year, month, day].join('/'),
            element.aqi
        ])
    });

    weatherChart.setOption({
        series: [{
            // 根据名字对应到相应的系列
            name: '污染指数',
            data: data
        }]
    });
});

var weatherOption = {
    // 悬浮框
    tooltip: {
        trigger: 'axis',
        // 悬浮框位置
        position: function (pt) {
            return [pt[0], '25%'];
        }
    },
    title: {
        left: 'center',
        text: '天气因素影响物价',
    },
    /* 
    // 右上角辅助功能
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        }
     },
     */
    xAxis: {
        type: 'category',   // 离散时间类型
        boundaryGap: false
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '10%']
    },
    // 时间轴默认选取长度
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 50
    }, {
        start: 0,
        end: 50
    }],
    series: [
        {
            name: 'aqi',
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {},
        }
    ]
};
if (weatherOption && typeof weatherOption === 'object') {
    weatherChart.setOption(weatherOption);
}

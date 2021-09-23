function pigPrice(area = 0) {

    var dom = document.getElementById("pigPrice");
    var priceChart = echarts.init(dom);

    var priceOption;

    // 数据 2020-1-8开始 2021-7-6结束
    d3.csv('csv/2020pig.csv', function (error, data) {
        console.log(data.length);
        daySet = []
        // 0    江都太阳城
        // 1    石塔
        // 2    美琪
        // 3    荷花池
        titleSet = ["江都太阳城农贸市场 猪肉价格", "石塔农贸市场 猪肉价格", "美琪农贸市场 猪肉价格", "荷花池农贸市场 猪肉价格"];
        priceSet0 = []
        priceSet1 = []
        priceSet2 = []
        priceSet3 = []

        if (error) {
            console.log(error);
        } else {
            for (var i = 0; i < data.length; i++) {
                // 添加数据
                daySet.push(data[i].day);
                priceSet0.push(parseFloat(data[i].price0));
                priceSet1.push(parseFloat(data[i].price1));
                priceSet2.push(parseFloat(data[i].price2));
                priceSet3.push(parseFloat(data[i].price3));
            }
        }
        priceSet = [priceSet0, priceSet1, priceSet2, priceSet3];
        // console.log(priceSet);

        priceChart.setOption(priceOption = {
            title: {
                text: titleSet[area],
                left: '1%'
            },
            tooltip: {
                trigger: 'axis'
            },
            // 表格位置
            grid: {
                left: '5%',
                right: '15%',
                bottom: '10%'
            },
            xAxis: {
                data: daySet
            },
            yAxis: {},
            /*  
            // 右上角辅助功能
            toolbox: {
                 right: 10,
                 feature: {
                     dataZoom: {
                         yAxisIndex: 'none'
                     },
                     restore: {},
                     saveAsImage: {}
                 }
             }, 
             */
            dataZoom: [{
                startValue: '2020-01-08',
            }, {
                type: 'inside'
            }],
            visualMap: {
                top: 50,
                right: 10,
                pieces: [{
                    gt: 10,
                    lte: 20,
                    color: '#93CE07'
                }, {
                    gt: 20,
                    lte: 30,
                    color: '#FC7D02'
                }, {
                    gt: 30,
                    lte: 40,
                    color: '#FD0100'
                }],
                outOfRange: {
                    color: '#999' // 灰色
                }
            },
            series: {
                name: '猪肉价格',
                type: 'line',
                data: priceSet[area],
                /*
                markLine: {
                    silent: true,
                    lineStyle: {
                        color: '#333'
                    },
                     data: [{
                        yAxis: 10
                    }, {
                        yAxis: 20
                    }, {
                        yAxis: 30
                    }, {
                        yAxis: 40
                    }] 
                }
                */
            }
        });
    });


    priceChart.on('click',function(params){
        console.log('click it');
        console.log(params);
    });

    if (priceOption && typeof priceOption === 'object') {
        priceChart.setOption(priceOption);
    }
}
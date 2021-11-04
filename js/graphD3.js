

// var offsetWidth = document.getElementById('mainBody').offsetWidth;
// var clientWidth = document.getElementById('mainBody').clientWidth;
// var offsetHeight = document.getElementById('mainBody').offsetHeight;
// console.log(offsetHeight);
// console.log(offsetWidth);
// console.log(clientWidth);

// 知识图谱的长和宽
var width = 940
var height = 660
// graphChart
document.getElementById('graphChart').style.height = height

var radius = 6
// 搜索框获取所有公司名称
var searchCompanyName = []
// 折线图存储 lineStackOption 中的 series 和 横坐标legend
var lineStackSeries = []
var lineStackLegend = []

// 企业类型
var categories = [
    { "name": "独资企业" },
    { "name": "合资企业" },
    { "name": "私营企业" },
    { "name": "国有企业" },
    { "name": "股份制企业" },
    { "name": "集体所有" }
]
// 颜色比例尺
var colorline = d3.scale.category10()
var cloudFill = d3.scale.category20()


// ------------------------------------------------------
// |                                                    |
// |                                                    |
// |                    左中资产图                       |
// |                    Pie Chart                       |
// |                                                    |
// |                                                    |
// ------------------------------------------------------
var pieIncome = randomArray(5);
var pieDom = document.getElementById("pieChart");
var pieChart = echarts.init(pieDom);
var pieOption;
pieOption = {
    tooltip: {
        trigger: 'item'
    },
    title: {
        text: '',
        left: "center",
        top: "40%",
        textStyle: {
            color: "rgb(50,197,233)",
            fontSize: 14,
            align: "center"
        }
    },
    series: [{
        name: '',
        type: 'pie',
        radius: ['30%', '50%'],
        avoidLabelOverlap: false,
        label: {
            show: true,
            position: 'outside'
        },
        labelLine: {
            show: true
        },

    }]
};
// ------------------------------------------------------
// |                                                    |
// |                                                    |
// |                    左下词云图                       |
// |                    wordCloud                       |
// |                                                    |
// |                                                    |
// ------------------------------------------------------
function creatWordCloud() {

    // 先删除之前生成的词云图
    $("#wordCloud svg").remove();
    d3.json("json/graph.json", function (error, d) {
        if (error) throw error;
        wordCloudKeyWords = d.wordCloudKeyWords
        let myWords = []
        for (let name in wordCloudKeyWords) {
            myWords.push({
                word: name,
                size: Math.sqrt(wordCloudKeyWords[name])
            })
        }
        let wordCloudSize = {
            width: 460,
            height: 280
        }
        // 创建词云布局
        let wordCloudLayout = d3.layout.cloud()
            .size([wordCloudSize.width, wordCloudSize.height])
            .words(myWords.map(function (d) { return { text: d.word, size: d.size }; }))
            .padding(5)
            // ~~的作用是去掉小数部分
            .rotate(function () { return ~~(Math.random() * 2) * 90; })
            // 字体大小
            .fontSize(function (d) { return d.size * 30; })
            .on("end", draw)

        wordCloudLayout.start();

        // 从 词云 中获取信息并绘制
        function draw(words) {
            d3.select("#wordCloud").append("svg")
                .attr("width", wordCloudLayout.size()[0])
                .attr("height", wordCloudLayout.size()[1])
                .append("g")
                .attr("transform", "translate(" + wordCloudLayout.size()[0] / 2 + "," + wordCloudLayout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                // 字体大小
                .style("font-size", function (d) { return d.size; })
                .style("fill", function (d, i) { return cloudFill(i); })
                .attr("text-anchor", "middle")
                .style("font-family", "Impact")
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) { return d.text; });
        }

    })
}



// ------------------------------------------------------
// |                                                    |
// |                                                    |
// |                    左上桑基图                       |
// |                   sankey Echarts                   |
// |                                                    |
// |                                                    |
// ------------------------------------------------------

var sankeyDom = document.getElementById('sankeyChart');
var sankeyChart = echarts.init(sankeyDom);
var sankeyOption;
sankeyOption = {
    // title: {
    //     text: ""
    // },
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
    },
    series: [
        {
            type: 'sankey',
            data: [],
            links: [],
            emphasis: {
                focus: 'adjacency'
            },
            lineStyle: {
                color: 'gradient',
                curveness: 0.5
            }
        }
    ]
}



// ------------------------------------------------------
// |                                                    |
// |                                                    |
// |                  右中 经营动态图                    |
// |                    Bar Chart                       |
// |                                                    |
// |                                                    |
// ------------------------------------------------------
var barLabelDom = document.getElementById("barLabel");
var barLabelChart = echarts.init(barLabelDom);
var barLabelOption;

barLabelOption = {
    title: {
        text: '经营动态图',
        textStyle: {
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: 'normal',
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: []
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'top',
        feature: {
            myTool2: {
                show: true,
                title: '返回',
                iconStyle: {
                    borderColor: '#515151'
                },
                icon: "path://M864.704 291.328V160H896v192h-192v-32h140.64A383.84 383.84 0 0 0 512 128C299.936 128 128 299.936 128 512s171.936 384 384 384c190.272 0 348.224-138.4 378.688-320h32.416C892.32 775.36 720 928 512 928 282.24 928 96 741.76 96 512S282.24 96 512 96c148.704 0 279.168 78.016 352.704 195.328z",
                onclick: function () {
                    barLabelOption.series.length = 0
                    barLabelOption.legend.data.length = 0
                    barLabelChart.clear()
                    barLabelChart.setOption(barLabelOption);
                }
            }
        }
    },
    xAxis: [
        {
            type: 'category',
            data: ['行政许可', '行政处罚', '失信次数', '异常经营', '未缴税']
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: []
};
if (barLabelOption && typeof barLabelOption === 'object') {
    barLabelChart.setOption(barLabelOption);
}


// ------------------------------------------------------
// |                                                    |
// |                                                    |
// |                    中上 具体企业图                  |
// |                Graph Company Echarts               |
// |                                                    |
// |                                                    |
// ------------------------------------------------------

function creategraphCompany() {
    let graphCompany = document.getElementById("graphCompany");
    let companyChart = echarts.init(graphCompany);
    let companyOption;
    // ROOT_PATH = "https://echarts.apache.org/examples"

    companyChart.showLoading();
    $.getJSON('json/graph.json', function (graph) {
        companyChart.hideLoading();

        graph.nodes.forEach(function (node) {
            node.label = {
                show: node.symbolSize > 1
            };
        });
        companyOption = {
            // 标题
            title: {
                text: '具体企业关系图',
                top: 'top',
                left: 'left'
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'top',
                feature: {
                    myTool1: {    //必须要my开头
                        show: true,
                        title: '返回',
                        iconStyle: {
                            borderColor: '#707070'
                        },
                        icon: 'path://M262.9 174.1h526v-110h-636v895.6h636v-110h-526z M706.5 774.6L929 506 706.1 248.3l-83.2 72 113.9 131.6H365.1v120h366.4L621.8 704.4z',
                        onclick: function () {
                            let graphChartStyle = document.getElementById("graphChart");
                            let graphCompanyStyle = document.getElementById("graphCompany");
                            graphChartStyle.style.display = "block";
                            graphCompanyStyle.style.display = "none";

                            let lineStackStyle = document.getElementById("lineStack");
                            let lineWithBarStyle = document.getElementById("lineWithBar");
                            lineWithBarStyle.style.display = "none";
                            lineStackStyle.style.display = "block";
                            // $("#lineWithBar div").remove();


                            // 清空折线图数据
                            lineStackOption.series.splice(0, lineStackOption.series.length);
                            lineStackOption.legend.data.splice(0, lineStackOption.legend.data.length);
                            if (lineStackOption && typeof lineStackOption === 'object') {
                                lineStackChart.setOption(lineStackOption);
                            }
                            // createGraph()
                        }
                    },
                }
            },
            animationDuration: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
                {
                    type: 'graph',
                    layout: 'force',
                    data: graph.nodes, // 企业数据
                    links: graph.links, // 企业关系
                    categories: graph.categories, // 企业种类
                    roam: true,
                    draggable: true,

                    // 圆形上文字样式
                    // label: {
                    //     position: 'right',
                    //     formatter: '{b}'
                    // },
                    lineStyle: {
                        // 关系图连接线颜色
                        color: '#000',
                        curveness: 0.3
                    },
                    //鼠标移入动态的时候显示的默认样式
                    emphasis: {
                        focus: 'adjacency',
                        lineStyle: {
                            width: 3
                        }
                    },
                    borderColor: "#FF1493",  //边框颜色
                    borderWidth: 2, //边框线宽
                    force: {
                        edgeLength: 5,
                        repulsion: 200,
                        gravity: 0.2

                    }
                }
            ]
        };
        if (companyOption && typeof companyOption === 'object') {
            companyChart.setOption(companyOption);
        }
    });
}

// ------------------------------------------------------
// |                                                    |
// |                                                    |
// |                    中下折线图                       |
// |                 Line Stack Chart                   |
// |                                                    |
// |                                                    |
// ------------------------------------------------------
var lineStackDom = document.getElementById("lineStack");
var lineStackChart = echarts.init(lineStackDom);
var lineStackOption;

lineStackOption = {
    title: {
        text: '营业额'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        left: '40%',  //图例距离左的距离
        data: []
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },

    toolbox: {
        show: true,
        orient: 'vertical',
        // left: 'right',
        right:"30px",                               //组件离容器右侧的距离,'20%'

        top: 'top',
        feature: {
            myTool3: {
                show: true,
                title: '返回',
                iconStyle: {
                    borderColor: '#515151'
                },
                icon: "path://M864.704 291.328V160H896v192h-192v-32h140.64A383.84 383.84 0 0 0 512 128C299.936 128 128 299.936 128 512s171.936 384 384 384c190.272 0 348.224-138.4 378.688-320h32.416C892.32 775.36 720 928 512 928 282.24 928 96 741.76 96 512S282.24 96 512 96c148.704 0 279.168 78.016 352.704 195.328z",
                onclick: function () {
                    lineStackOption.series.length = 0 //具体
                    lineStackOption.legend.data.length = 0 // 图例
                    lineStackOption.xAxis.data.length = 0 // 横坐标
                    lineStackSeries.length = 0
                    lineStackLegend.length = 0



                    lineStackChart.clear()
                    lineStackChart.setOption(lineStackOption);
                }
            }
        }
    },
    // 折线图x轴
    xAxis: {
        type: 'category',
        boundaryGap: false,
        // lineStackOption.xAxis.data.push(d.fiance[i].year)
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: []
};

if (lineStackOption && typeof lineStackOption === 'object') {
    lineStackChart.setOption(lineStackOption);
};

// ------------------------------------------------------
// |                                                    |
// |                                                    |
// |                    中下折线图                       |
// |                 Line Stack Chart                   |
// |                                                    |
// |                                                    |
// ------------------------------------------------------
function creatLineWithBar() {
    var lineWithBarDom = document.getElementById('lineWithBar');
    var lineWithBarChart = echarts.init(lineWithBarDom);
    var lineWithBarOption;

    lineWithBarOption = {
        //     grid: {
        //         left: '2%',
        //         right: '2%',
        //         containLabel: true,
        //         show:'true',
        //         borderWidth:'0'
        //    },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        legend: {
            data: ['行政许可', '行政处罚', '失信次数', '经营异常', '未缴税', '营业额', '负债', '净利润']
        },
        xAxis: [
            {
                type: 'category',
                data: ['2015', '2016', '2017', '2018', '2019'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '营业额',
                axisLabel: {
                    formatter: '{value} 万元'
                }
            },
            {
                type: 'value',
                name: '发生次数',
                axisLabel: {
                    formatter: '{value} 次'
                }
            }
        ],
        series: [
            {
                name: '营业额',
                type: 'line',
                yAxisIndex: 0,
                data: [777.9, 988.65, 863.65, 143.87, 0]
            },
            {
                name: '负债',
                type: 'line',
                yAxisIndex: 0,
                data: [27140, 45500, 45610, 45490, 45660]
            },
            {
                name: '净利润',
                type: 'line',
                yAxisIndex: 0,
                data: [-29330, -24240, -3532, -17210, -1807.78]
            },
            {
                name: '行政许可',
                type: 'bar',
                // barWidth: 30,//柱图宽度
                stack: '信息',
                yAxisIndex: 1,
                emphasis: {
                    focus: 'series'
                },
                data: [0, 0, 0, 0, 0]
            },
            {
                name: '行政处罚',
                type: 'bar',
                yAxisIndex: 1,
                // barWidth: 30,//柱图宽度
                stack: '信息',
                emphasis: {
                    focus: 'series'
                },
                data: [0, 0, 0, 0, 0]
            },
            {
                name: '失信次数',
                type: 'bar',
                // barWidth: 30,//柱图宽度

                yAxisIndex: 1,

                stack: '信息',
                emphasis: {
                    focus: 'series'
                },
                data: [2, 2, 0, 1, 1]
            },
            {
                name: '经营异常',
                type: 'bar',
                // barWidth: 30,//柱图宽度

                yAxisIndex: 1,

                stack: '信息',
                emphasis: {
                    focus: 'series'
                },
                data: [0, 0, 1, 1, 1]
            },
            {
                name: '未缴税',
                type: 'bar',
                // barWidth: 30,//柱图宽度

                yAxisIndex: 1,

                stack: '信息',
                emphasis: {
                    focus: 'series'
                },
                data: [0, 0, 0, 0, 0]
            }

        ]
    };

    lineWithBarOption && lineWithBarChart.setOption(lineWithBarOption);
}

// ------------------------------------------------------
// |                                                    |
// |                                                    |
// |                   中上关系图                        |
// |                   graph D3                         |
// |                                                    |
// |                                                    |
// ------------------------------------------------------
// function createGraph() {
// 创建 力引导
var force = d3.layout.force()
    // 参数设置
    .gravity(0.1)
    .charge(-90)
    .linkDistance(50)
    .size([width, height])


var svg = d3.select("#graphChart").append("svg")
    .attr("width", width)
    .attr("height", height);

//箭头
var marker =
    svg.append("marker")
        // .attr("id", function(d) { return d; })
        .attr("id", "resolved")
        //.attr("markerUnits","strokeWidth")//设置为strokeWidth箭头会随着线的粗细发生变化
        .attr("markerUnits", "userSpaceOnUse")
        .attr("viewBox", "0 -5 10 10")//坐标系的区域
        .attr("refX", 15)//箭头坐标
        .attr("refY", -1)
        .attr("markerWidth", 10)//标识的大小
        .attr("markerHeight", 10)
        .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
        .attr("stroke-width", 2)//箭头宽度
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")//箭头的路径
        .attr('fill', '#000000');//箭头颜色



// 获取关系图的 json 数据
var NodesAndLinks

d3.json("json/lyp_network.json", function (error, graph) {
    if (error) throw error;
    // 浅拷贝 获取关系图的 json 数据
    NodesAndLinks = graph;
    graph.nodes.forEach(e => {
        searchCompanyName.push(e.name)
    });

    // 根据投资关系创造公司联系 开始
    dataLink = []
    dataNodes = graph.nodes
    dataNodes.forEach(function (d, i) {
        d.touzi.forEach(function (company) {
            let index = dataNodes.findIndex(v => v.name === company)

            let templink = {
                "source": i,
                "target": index,
                "rela": "投资"
            }
            dataLink.push(templink)

        })
    })
    graph.links = dataLink;
    // 根据投资关系创造公司联系 结束


    // 连接线
    var link = svg.selectAll("line")
        // .data(dataLink)
        .data(graph.links)
        .enter()
        .append("line")
        .style("stroke-width", 1)//线条粗细
        .style("stroke", (d) => {
            //根据关系的不同设置线条颜色
            if (d.rela == "投资") {
                return "rgb(87, 87, 87)";
            } else if (d.rela == "合伙") {
                return "rgb(87, 87, 87)";
            }
        })
        .attr("marker-end", "url(#resolved)");//根据箭头标记的id号标记箭头
    var timeout = null; // 解决鼠标单击与双击冲突
    // 圆圈 结点
    var node = svg.selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", () => 7)
        .attr("id", (d) => d.name)
        .attr("class", (d) => {
            if (d.level == "A") {
                return "levelA"
            } else if (d.level == "B") {
                return "levelB"
            } else if (d.level == "C") {
                return "levelC"
            }
        })
        // 圆圈颜色
        // .style("fill", d => colorline(d.group))
        .style("fill", d => {
            // A优秀（90-100）  B良好（80-89） C一般（70-79） D可能有风险（60-69） E有风险（50-59） F失信（<50
            if (d.grades >= 90) return "#4575b4"
            else if (d.grades >= 80) return "#91bfdb"
            else if (d.grades >= 70) return "#e0f3f8"
            else if (d.grades >= 60) return "#fee090"
            else if (d.grades >= 50) return "#fc8d59"
            else return "#d73027"
        })
        // 描边颜色
        // .style("stroke", function (d) {
        // 	return "#808080";
        // })
        // .style("stroke-width", 3)//线条粗细
        // 拖动事件
        .call(force.drag)
        // 鼠标单击事件
        .on("click", function (d) {
            clearTimeout(timeout); // 解决鼠标单击与双击冲突
            timeout = setTimeout(function () {
                // 解决点击同一家企业的问题
                let repeatClick = barLabelOption.legend.data.indexOf(d.name)
                // 通过查找柱状图中是否已经存在这家企业来判断
                if (repeatClick == -1) {
                    // 生成 经营动态 柱状图
                    // 随机生成五个数字
                    let barLabelArr = [d.administrativeLicence, d.administrativeSanction, d.dishonest, d.abnormal, d.taxViolation]
                    barLabelTemp = {
                        name: d.name,
                        type: 'bar',
                        data: barLabelArr
                    }
                    barLabelOption.series.push(barLabelTemp)
                    barLabelOption.legend.data.push(d.name)
                    // 实时更新图表

                    if (barLabelOption && typeof barLabelOption === 'object') {
                        barLabelChart.setOption(barLabelOption);
                    }
                    // 折线图伴随堆叠柱状图


                    // 生成 营业额 折线图
                    // 折线图存储 lineStackOption 中的 series 和 横坐标legend
                    let lineStack = d.fiance;
                    // 横坐标更新 将年份添加到横坐标中
                    lineStackOption.xAxis.data = []
                    // 添加 营业额、年份 数据
                    let lineStackIncome = []
                    for (let i = 0; i < lineStack.length; i++) {
                        lineStackLegend.push(lineStack[i].year)
                        lineStackIncome.push(lineStack[i].turnover)
                    }
                    lineStackLegend = Array.from(new Set(lineStackLegend));	// 数组去重
                    lineStackLegend.sort((a, b) => { return a - b }) // 年份从小到大排序

                    incomeSeries = {
                        name: d.name,
                        type: 'line',
                        data: lineStackIncome
                    }
                    lineStackSeries.push(incomeSeries)
                    lineStackOption.series = [] // 先清空数据
                    // 再更新数据，并把之前清空的数据补上
                    lineStackSeries.forEach((d) => {
                        let len = d.data.length;
                        // 如果该公司的注册时间大于横坐标里的最早注册年份
                        for (let i = 0; i < lineStackLegend.length - len; i++) {
                            // 从开头添加数据 “0”
                            d.data.unshift(0);
                        }
                        lineStackOption.series.push(d)
                    })
                    // lineStackOption.series.push(incomeSeries)
                    lineStackOption.legend.data.push(d.name)
                    for (let i = 0; i < lineStackLegend.length; i++) {
                        lineStackOption.xAxis.data.push(lineStackLegend[i])
                    }
                    // 实时更新图表
                    if (lineStackOption && typeof lineStackOption === 'object') {
                        lineStackChart.setOption(lineStackOption, true);
                    }





                    creatWordCloud()
                }
                // 生成 企业资产分布图 饼图
                let pieIncome = randomArray(5);
                pieOption.series[0]['data'] = [{ value: pieIncome[0], name: '流动资产' },
                { value: pieIncome[1], name: '固定资产' },
                { value: pieIncome[2], name: '长期资产' },
                { value: pieIncome[3], name: '无形资产' },
                { value: pieIncome[4], name: '其他资产' }]

                let sumMoney = "合计\n" + sum(pieIncome) + "亿元";
                pieOption.title.text = sumMoney
                // 实时更新图表
                if (pieOption && typeof pieOption === 'object') {
                    pieChart.clear();
                    pieChart.setOption(pieOption);
                }
                // 生成 企业投资关系/现金流量图 桑基图
                // 清空 sankeyOption 内的数据
                sankeyOption.series[0].data = []
                sankeyOption.series[0].links = []
                // sankeyOption.series[0].data 名字太长了，换一个变量名
                let sankeyOptionData = sankeyOption.series[0].data
                let sankeyOptionLinks = sankeyOption.series[0].links
                // 存储桑基图的节点名称
                let sankeyTempData = []
                link.style("font-style", function (line) {
                    if (line.source.name == d.name) {
                        // 存储桑基图的关系
                        let sankeyTempLink = {}
                        sankeyTempData.push(d.name)
                        sankeyTempData.push(line.target.name)
                        sankeyTempLink.source = d.name
                        sankeyTempLink.target = line.target.name
                        sankeyTempLink.value = Math.floor(Math.random() * 10 + 1)
                        sankeyOptionLinks.push(sankeyTempLink)
                    } else if (line.target.name == d.name) {
                        let sankeyTempLink = {}
                        sankeyTempData.push(d.name)
                        sankeyTempData.push(line.source.name)
                        sankeyTempLink.source = line.source.name
                        sankeyTempLink.target = d.name
                        sankeyTempLink.value = Math.floor(Math.random() * 10 + 1)
                        sankeyOptionLinks.push(sankeyTempLink)
                    }

                    return "normal"
                })
                sankeyTempData = Array.from(new Set(sankeyTempData));	// 数组去重
                // 将结点名称存储到 sankeyOption 中
                for (let i = 0; i < sankeyTempData.length; i++) {
                    sankeyOptionData.push({ "name": sankeyTempData[i] })
                }
                // 生成桑基图
                if (sankeyOption && typeof sankeyOption === 'object') {
                    sankeyChart.setOption(sankeyOption);
                }

                


            }, 300)

        })
        // 鼠标双击事件
        .on("dblclick", function (d) {
            clearTimeout(timeout); // 解决鼠标单击与双击冲突

            tip.hide(d);	// 隐藏悬浮窗
            let graphChartStyle = document.getElementById("graphChart");
            let graphCompanyStyle = document.getElementById("graphCompany");
            graphChartStyle.style.display = "none";
            graphCompanyStyle.style.display = "block";
            creategraphCompany();


            let lineStackStyle = document.getElementById("lineStack");
            let lineWithBarStyle = document.getElementById("lineWithBar");
            lineStackStyle.style.display = "none";
            lineWithBarStyle.style.display = "block";
            creatLineWithBar();
        })
        // 鼠标移入后显示悬浮窗
        .on("mouseover", function (d) {

            tip.show(d); 	// 隐藏悬浮窗
            // 改变连接线的透明度
            tempNodes = []
            focusNode0 = []
            link.style("opacity", function (line) {
                if (line.source.name == d.name || line.target.name == d.name) {
                    // 创建缩略图所用的关系图结点
                    tempNodes.push(line.source)
                    tempNodes.push(line.target)

                    // detailedNodes =  delRepeat(tempNodes)// 数组去重
                    // 创建缩略图所用的关系图连线
                    // 将结点有关的结点姓名加入到数组中
                    focusNode0.push(line.source.name)
                    focusNode0.push(line.target.name)
                    return 1;
                } else {
                    node.style("opacity", 0.1)
                    return 0.05;
                }
            });

            focusNode = Array.from(new Set(focusNode0));	// 数组去重
            // 改变圆圈的透明度 fill-opacity
            node.style("opacity", function (n) {
                if (focusNode.indexOf(n.name) != -1) {
                    return 1
                } else {
                    return 0.35
                }
            })

        })
        // 鼠标移出后隐藏悬浮窗
        .on("mouseout", function (d) {
            tip.hide(d); // 隐藏悬浮窗
            // 将透明度改回正常值
            node.style("opacity", 1)
            link.style("opacity", 1)
        });

    // 知识图谱 标题

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .on("tick", tick)
        .start();
    // 图例
    var graphTitle = "企业关系图谱"
    var legend = svg
    .append("g")
        .attr("class", "legend")
        .selectAll("g")
        .data(categories)
        .enter()
        .append("g")
        // .attr("transform", function(d, i) { return "translate(-30," + (i * 20 + 30) + ")"; });  //transform属性便是整个图例的坐标

        .attr("transform", function () {
            return "translate(10," + 30 + ")";
        })
    legend.append("text")
        .attr("x", 20)
        .attr("dy", "0.50em")
        .style("font-size", "20px")
        .text(graphTitle)

        console.log(graph);
    
 

    // 添加悬浮窗 d3-tip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([80, 110])
        .html(function (d) {
            return "<strong>公司名称：</strong><span class='details'>" + d.name + "<br></span>"
                + "<strong>注册时间：</strong><span class='details'>" + d.time + "<br></span>"
                + "<strong>注册金额：</strong><span class='details'>" + d.radius + "万<br></span>"
                + "<strong>企业类型：</strong><span class='details'>" + d.categories + "<br></span>"
                + "<strong>信用分数：</strong><span class='details'>" + d.grades + "<br></span>"
                ;

            // return "<strong>物价指数: </strong><span class='details'>" +   + "<br></span>" + "<strong>Confirmed: </strong><span class='details'>" + "xxrh" + "</span>";
        });

    svg.call(tip);
    function tick() {
        node.attr("cx", function (d) { return d.x = Math.max(d.radius, Math.min(width - radius, d.x)); })
            .attr("cy", function (d) { return d.y = Math.max(d.radius, Math.min(height - radius, d.y)); });

        link.attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });
    }
})
function changGraph1() {
    // alert("ASdasd")
    d3.selectAll("circle")
        .style("fill", "#87CEFA")
        .style("stroke-width", 3)

        // 描边颜色
        .style("stroke", function (d) {
            let lev = d3.select(this).attr("class")
            if (lev == "levelC") {
                return "#FF4500";
            }
        })
}
function changGraph2() {
    d3.selectAll("circle")
        .style("fill", d => {
            // A优秀（90-100）  B良好（80-89） C一般（70-79） D可能有风险（60-69） E有风险（50-59） F失信（<50
            if (d.grades >= 90) return "#4575b4"
            else if (d.grades >= 80) return "#91bfdb"
            else if (d.grades >= 70) return "#e0f3f8"
            else if (d.grades >= 60) return "#fee090"
            else if (d.grades >= 50) return "#fc8d59"
            else return "#d73027"
        })
        // 描边大小
        .style("stroke-width", 0)
}
// 根据 公司名称 获取与之相关的结点与边

function getNodesAndLinks(nodeName) {
    // NodesAndLinks 用来存储 json 数据
    let nodes = NodesAndLinks.nodes;
    let links = NodesAndLinks.links;

    let result = {} // 返回最终的结果
    let resultNodes = []    // 返回最终的结果
    let resultLinks = []    // 返回最终的结果
    let nodesName = []  // 与 nodeName 有关系的结点名称

    links.forEach(function (d) {
        if (d.source.name == nodeName || d.target.name == nodeName) {
            resultLinks.push(d)
            // 将与 nodeName 有关系的结点名称放到数组中
            nodesName.push(d.source.name)
            nodesName.push(d.target.name)
        }
    })

    nodesName = Array.from(new Set(nodesName));	// 数组去重
    nodesName.forEach((name) => {
        let index = nodes.findIndex(v => v.name === name)
        resultNodes.push(nodes[index])
    })
    // 如果是单节点，没有和其他公司有关联
    if (resultNodes.length == 0 && resultLinks.length == 0) {
        let index = nodes.findIndex(v => v.name === nodeName)
        resultNodes.push(nodes[index])
    }
    result.nodes = resultNodes;
    result.links = resultLinks;

    return result;

}

// ------------------------------------------------------
// |                                                    |
// |                                                    |
// |                   自动搜索框                        |
// |                   模糊搜索框                        |
// |                                                    |
// |                                                    |
// ------------------------------------------------------
var ele_key = document.getElementById("inputKey");
ele_key.onkeyup = function () {

    //获取输入框里匹配的数据
    var val = this.value;
    var srdata = [];
    for (let i = 0; i < searchCompanyName.length; i++) {
        if (val.trim().length > 0 && searchCompanyName[i].indexOf(val) > -1) {
            srdata.push(searchCompanyName[i]);
        }
    }

    //获取到的数据准备追加显示, 前期要做的事情: 清空数据,然后显示数据列表,如果获取到的数据为空,则不显示
    var ele_datalist = document.getElementById("datalist");
    ele_datalist.style.visibility = "visible";
    ele_datalist.innerHTML = "";

    if (srdata.length == 0) {
        ele_datalist.style.visibility = "hidden";
    }

    //将搜索到的数据追加到显示数据列表, 然后每一行加入点击事件, 点击后将数据放入搜索框内, 数据列表隐藏
    var self = this;
    for (let i = 0; i < srdata.length; i++) {
        let ele_li = document.createElement("li");
        let ele_a = document.createElement("a");
        ele_a.textContent = srdata[i];
        // 搜索框点击后 生成缩略图
        // bug1：同时搜索两次相同的企业 柱状图会重复生成，折线图图例会重复生成
        ele_li.onclick = function () {
            // 获取输入框的内容
            self.value = this.textContent;
            // 隐藏候选框
            ele_datalist.style.visibility = "hidden";
            // 获取和输入框有关的 结点 与 边
            let searchNodesAndLinks = getNodesAndLinks(this.textContent);

            // ------------------------------------------------------
            // |                                                    |
            // |                                                    |
            // |                    右上关系图                       |
            // |                Detail Graph Echarts                |
            // |                                                    |
            // |                                                    |
            // ------------------------------------------------------


            let detailedDom = document.getElementById("detailedGraphChart");
            let detailedGraph = echarts.init(detailedDom);
            let detailedOption = {
                series: [
                    {
                        type: 'graph',
                        layout: 'force',
                        data: [],
                        links: [],
                        categories: categories,
                        roam: true,
                        label: {
                            show: true,
                            position: 'inside'
                        },
                        force: {
                            repulsion: 100
                        }
                    }
                ]
            };
            // 清空 detailedOption 内的数据
            detailedOption.series[0].links = []
            detailedOption.series[0].data = []
            // detailedOption.series[0].links 名字太长了，换一个变量名
            let detailedOptionData = detailedOption.series[0].data
            let detailedOptionLinks = detailedOption.series[0].links

            searchNodesAndLinks.nodes.forEach(function (node) {
                node.symbolSize = node.radius * 1;
                node.category = function () {
                    if (node.level == "A") {
                        node.itemStyle = {}
                        node.itemStyle.color = '#91CC75'
                        return 0;
                    } else if (node.level == "C") {
                        node.itemStyle = {}
                        node.itemStyle.color = '#FAC858'
                        return 1;
                    } else if (node.level == "E") {
                        node.itemStyle = {}
                        node.itemStyle.color = '#EE6666'
                        return 2;
                    }
                }()

                detailedOptionData.push(node)
            });
            //  searchNodesAndLinks 中的内容过于庞杂，不符合 echarts 规范，需要简化数据。
            searchNodesAndLinks.links.forEach((d) => {
                let templinks = {
                    "source": d.source.name,
                    "target": d.target.name
                }
                detailedOptionLinks.push(templinks)
            })
            console.log(detailedOption);
            if (detailedOption && typeof detailedOption === 'object') {
                detailedGraph.setOption(detailedOption);
            }
            // 关系图结束
            let thisNodeindex = searchNodesAndLinks.nodes.findIndex(v => v.name === this.textContent)
            let thisNode = searchNodesAndLinks.nodes[thisNodeindex]
            // 修改右上详细信息的值
            let Ataxpayer = document.getElementById("Ataxpayer");
            let cuntoms = document.getElementById("cuntoms");
            let administrativeLicence = document.getElementById("administrativeLicence");
            let administrativeSanction = document.getElementById("administrativeSanction");
            let taxViolation = document.getElementById("taxViolation");
            let arrearsFarmers = document.getElementById("arrearsFarmers");
            let dishonest = document.getElementById("dishonest");
            let water = document.getElementById("water");

            let AtaxpayerBtn = document.getElementById("AtaxpayerBtn");
            let cuntomsBtn = document.getElementById("cuntomsBtn");
            let administrativeLicenceBtn = document.getElementById("administrativeLicenceBtn");
            let administrativeSanctionBtn = document.getElementById("administrativeSanctionBtn");
            let taxViolationtBtn = document.getElementById("taxViolationtBtn");
            let arrearsFarmersBtn = document.getElementById("arrearsFarmersBtn");
            let dishonestBtn = document.getElementById("dishonestBtn");
            let waterBtn = document.getElementById("waterBtn");


            if (thisNode.taxViolation > 1) {
                taxViolationtBtn.classList.add("btn-danger")
            }
            else {
                taxViolationtBtn.classList.remove("btn-danger")
            }
            if (thisNode.arrearsFarmers > 0) {
                arrearsFarmersBtn.classList.add("btn-danger")

            } else {
                arrearsFarmersBtn.classList.remove("btn-danger")

            }
            if (thisNode.dishonest > 1) {
                dishonestBtn.classList.add("btn-danger")

            } else if (thisNode.dishonest == 1) {
                dishonestBtn.classList.add("btn-warning")
            } else {
                dishonestBtn.classList.remove("btn-danger")
                dishonestBtn.classList.remove("btn-warning")
            }
            if (thisNode.water > 1) {

                waterBtn.classList.add("btn-danger")
            } else if (thisNode.water == 1) {
                waterBtn.classList.add("btn-warning")

            } else {
                waterBtn.classList.remove("btn-warning")
                waterBtn.classList.remove("btn-danger")

            }


            if (thisNode.Ataxpayer > 1) {
                AtaxpayerBtn.classList.add("btn-success")
            } else {
                AtaxpayerBtn.classList.remove("btn-success")
            }

            if (thisNode.cuntoms > 2) {
                cuntomsBtn.classList.add("btn-success")
            } else {
                cuntomsBtn.classList.remove("btn-success")
            }

            if (thisNode.administrativeLicence > 2) {
                administrativeLicenceBtn.classList.add("btn-success")
            } else {
                administrativeLicenceBtn.classList.remove("btn-success")
            }

            if (thisNode.administrativeSanction > 2) {
                administrativeSanctionBtn.classList.add("btn-danger")

            } else if (thisNode.administrativeSanction == 0) {
                administrativeSanctionBtn.classList.add("btn-success")

            } else {
                administrativeSanctionBtn.classList.add("btn-warning")
                administrativeSanctionBtn.classList.remove("btn-success")
            }
            Ataxpayer.innerHTML = thisNode.Ataxpayer;
            cuntoms.innerHTML = thisNode.cuntoms;
            administrativeLicence.innerHTML = thisNode.administrativeLicence;
            administrativeSanction.innerHTML = thisNode.administrativeSanction;
            taxViolation.innerHTML = thisNode.taxViolation;
            arrearsFarmers.innerHTML = thisNode.arrearsFarmers;
            dishonest.innerHTML = thisNode.dishonest;
            water.innerHTML = thisNode.water;
            // 重复 d3 的点击工作 开始
            // 先解决重复搜索同一个家企业的问题。通过查找 折线图 中是否已经存在这家企业来判断
            let repeatClick = lineStackOption.legend.data.indexOf(this.textContent)
            if (repeatClick == -1) {
                // 生成 经营动态 柱状图
                let barLabelArr = [
                    thisNode.administrativeLicence,
                    thisNode.administrativeSanction,
                    thisNode.dishonest,
                    thisNode.abnormal,
                    thisNode.taxViolation
                ]
                barLabelTemp = {
                    name: thisNode.name,
                    type: 'bar',
                    data: barLabelArr
                }
                barLabelOption.series.push(barLabelTemp)
                barLabelOption.legend.data.push(thisNode.name)
                // 实时更新图表
                if (barLabelOption && typeof barLabelOption === 'object') {
                    barLabelChart.setOption(barLabelOption);
                }
                let lineStackStyle = document.getElementById("lineStack");
                let lineWithBarStyle = document.getElementById("lineWithBar");
                lineStackStyle.style.display = "none";
                lineWithBarStyle.style.display = "block";
                creatLineWithBar();
                /* // 生成 营业额 折线图
                // 折线图存储 lineStackOption 中的 series 和 横坐标legend
                let lineStack = thisNode.fiance;
                // 横坐标更新 将年份添加到横坐标中
                lineStackOption.xAxis.data = []
                // 添加 营业额、年份 数据
                let lineStackIncome = []
                for (let i = 0; i < lineStack.length; i++) {
                    lineStackLegend.push(lineStack[i].year)
                    lineStackIncome.push(lineStack[i].turnover)
                }
                lineStackLegend = Array.from(new Set(lineStackLegend));	// 数组去重
                lineStackLegend.sort((a, b) => { return a - b }) // 年份从小到大排序

                incomeSeries = {
                    name: thisNode.name,
                    type: 'line',
                    data: lineStackIncome
                }
                lineStackSeries.push(incomeSeries)
                lineStackOption.series = [] // 先清空数据

                // 再更新数据，并把之前清空的数据补上
                lineStackSeries.forEach((d) => {
                    let len = d.data.length;
                    // 如果该公司的注册时间大于横坐标里的最早注册年份
                    for (let i = 0; i < lineStackLegend.length - len; i++) {
                        // 从开头添加数据 “0”
                        d.data.unshift(0);
                    }
                    lineStackOption.series.push(d)
                })
                // lineStackOption.series.push(incomeSeries)
                lineStackOption.legend.data.push(thisNode.name)
                for (let i = 0; i < lineStackLegend.length; i++) {
                    lineStackOption.xAxis.data.push(lineStackLegend[i])
                }
                // 实时更新图表
                if (lineStackOption && typeof lineStackOption === 'object') {
                    lineStackChart.setOption(lineStackOption, true);
                } */
            }
            // 生成 企业资产分布图 饼图
            let pieIncome = randomArray(5);
            // 固定资产 8.68亿	流动资产 9.56亿	无形资产 4311.73万	 长期1.05万 
            pieOption.series[0]['data'] = [{ value: 95600, name: '流动资产' },
            { value: 86800, name: '固定资产' },
            { value: 2, name: '长期资产' },
            { value: 4311.73, name: '无形资产' },
            { value: 132, name: '其他资产' }]
            // pieOption.series[0]['data'] = [{ value: pieIncome[0], name: '流动资产' },
            // { value: pieIncome[1], name: '固定资产' },
            // { value: pieIncome[2], name: '长期资产' },
            // { value: pieIncome[3], name: '无形资产' },
            // { value: pieIncome[4], name: '其他资产' }]
            let sumMoney = "合计\n" + 18.6 + "亿元";
            // let sumMoney = "合计\n" + sum(pieIncome) + "亿元";
            pieOption.title.text = sumMoney
            // 实时更新图表
            if (pieOption && typeof pieOption === 'object') {
                pieChart.clear();
                pieChart.setOption(pieOption);
            }



            // 生成 企业投资关系/现金流量图 桑基图
            // 先清空 sankeyOption 内的数据
            sankeyOption.series[0].data = []
            sankeyOption.series[0].links = []
            // sankeyOption.series[0].data 名字太长了，换一个变量名
            let sankeyOptionData = sankeyOption.series[0].data
            let sankeyOptionLinks = sankeyOption.series[0].links

            // 将结点名称存储到 sankeyOption 中
            for (let i = 0; i < searchNodesAndLinks.nodes.length; i++) {
                sankeyOptionData.push({ "name": searchNodesAndLinks.nodes[i].name })
            }
            for (let i = 0; i < searchNodesAndLinks.links.length; i++) {
                sankeyOptionLinks.push(
                    {
                        "source": searchNodesAndLinks.links[i].source.name,
                        "target": searchNodesAndLinks.links[i].target.name,
                        "value": Math.floor(Math.random() * 5 + 1)
                    }
                )
            }
            // 生成桑基图
            if (sankeyOption && typeof sankeyOption === 'object') {
                sankeyChart.setOption(sankeyOption);
            }



            // 重复 d3 的点击工作 结束

            // 搜索框与知识图谱交互
            let graphChartStyle = document.getElementById("graphChart");
            let graphCompanyStyle = document.getElementById("graphCompany");
            graphChartStyle.style.display = "none";
            graphCompanyStyle.style.display = "block";

            creategraphCompany();// 知识图谱更新成具体企业
            creatWordCloud() //创建词云
        }


        ele_li.appendChild(ele_a);
        ele_datalist.appendChild(ele_li);
    }

}


// 随机生成数组
function randomArray(num, times = 500) {
    // 随机生成 num 个数字
    // 定义声明一个数组, 放随机生成的 num 个数字
    let randomArr = [];
    for (let i = 0; i < num; i++) {
        // 采用四舍五入包含0和100
        let n = Math.round(Math.random() * times);
        // 检测重复
        let off = false;//假设随机出来数字不重复
        for (let j = 0; j < randomArr.length; j++) {
            if (n == randomArr[j]) {
                // 如果重复就更改off的状态
                off = true;
                // 跳出当前代码块
                break;
            }
        }
        // 判断off的状态
        if (off) {
            i--
        } else {
            randomArr.push(n + 3);
        }
    }
    return randomArr
}
function sum(arr) {
    return eval(arr.join("+"));
}

function delRepeat(arr) {
    let result = [];
    let obj = {};
    // 根据对象中的 name 去重
    for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i].name]) {
            result.push(arr[i]);
            obj[arr[i].name] = true;
        }
    }
    return result;
}
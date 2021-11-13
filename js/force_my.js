// 行业门类点
function hyml_points() {
    hyml_list = ['A', 'B', 'C', 'D', 'E', 'F', 'G',
     'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R']
    hyml_name = ['农、林、牧、渔业', '采矿业', '制造业',
        '电力、热力、燃气及水生产和供应业', '建筑业', '批发和零售',
        '交通运输、仓储和邮政业', '住宿和餐饮业', '信息传输、软件和信息技术服务业',
        '金融业', '房地产业', '租赁和商务服务业', '科学研究和技术服务业',
        '水利、环境和公共设施管理业', '居民服务、修理和其他服务业', '教育',
        '卫生和社会工作', '文化、教育和娱乐业'
    ];
    let scaleOrdinal = d3.scaleOrdinal()
        .domain(hyml_list)
        .range(hyml_name)

    hyml_point_list = []
    hyml_list.forEach(function (value, index) {
        name1 = scaleOrdinal(value);
        let dict = {
            id: value,
            name: name1,
            symbolSize: 10,
            category:index+1,///////////////////////
            itemStyle: {
                color: 'red'
            }
        }
        hyml_point_list.push(dict);
    })
    return hyml_point_list;
}

//行业代码点的生成
function hydm_points(all_data) {
    hyml_list = ['A', 'B', 'C', 'D', 'E', 'F', 'G',
     'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];
    color_list=['#FFCCCC', '#FF6666', '#996600', '#CCCCFF', '#99CC66', '#99CCCC', '#996699',
    '#FF6600', '#009966', '#999933', '#CC9999', '#666666', '#FF9966', '#CCFF66', '#CCCC33', '#0099CC', 'Q#FF6666', '#33CC33'];
    let scaleOrdinal = d3.scaleOrdinal()
        .domain(hyml_list)
        .range(color_list)
    // var color_list = d3.scaleOrdinal(d3.schemeCategory20);
    let hydm_point_list = [];
    all_data.forEach(function (value, index) {
        value['IndustryCode'].forEach(function (value2, index2) {
            let dict_point = {
                id: value['HYML']+value2['HYDM'],
                name: value['HYML']+value2['HYDM'],
                category:index+1,///////////////////////////////
                itemStyle: {
                    color: scaleOrdinal(value['HYML'])
                }
            };
            hydm_point_list.push(dict_point);
            // console.log(value2)
        });
    })
    return hydm_point_list;
}

//行业门类和行业代码link生成
function hyml_hydm_links(all_data){
    
    let links_hyml_hydm=[]
    all_data.forEach(function (value, index) {
        value['IndustryCode'].forEach(function (value2, index2) {
            let links = {
                source:value['HYML'],
                target:value['HYML']+value2['HYDM']
                }
            links_hyml_hydm.push(links);
            // console.log(value2)
        });
    })
    return links_hyml_hydm;
}

//具体企业点的生成
function qiye_nodes(all_data){
    hyml_list = ['A', 'B', 'C', 'D', 'E', 'F', 'G',
     'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];
    color_list=['#FFCCCC', '#FF6666', '#996600', '#CCCCFF', '#99CC66', '#99CCCC', '#996699',
    '#FF6600', '#009966', '#999933', '#CC9999', '#666666', '#FF9966', '#CCFF66', '#CCCC33', '#0099CC', 'Q#FF6666', '#33CC33'];
    let scaleOrdinal = d3.scaleOrdinal()
        .domain(hyml_list)
        .range(color_list)
    
    let nodes_list=[];
    all_data.forEach(function(value,index){
        value['IndustryCode'].forEach(function (value2, index2) {
            value2["Enterprise"].forEach(function(value3,index3){
                let dict11 = {
                    color: scaleOrdinal(value['HYML'])
                }
                value3['itemStyle']=dict11;
                nodes_list.push(value3);
            })
        });
    })
    // return nodes_list;
    nodes_list.forEach(function(value,index,array){
        array[index]['id']=value['ID'];
        array[index]['name']=value['QYMC'];
    })
    return nodes_list;
    // console.log(nodes_list);
}




function drwa_myforce() {
    var ROOT_PATH = './json/qydjxxDataByCategory.json';
    var chartDom = document.getElementById('div_2');
    var myChart = echarts.init(chartDom);
    var option;
    myChart.showLoading();
    $.get(ROOT_PATH, function (qiye_data) {
        myChart.hideLoading();
        // console.log(qiye_data['Category'])
        // graph.nodes.forEach(function (node) {
        //     node.symbolSize = 5;
        // });

        var new_points = [];
        var new_links=[];
        //获取行业门类节点
        points_hyml = hyml_points();
        //获取行业代码节点
        points_hydm = hydm_points(qiye_data['Category']);
        //获取行业门类和行业代码之间的关系
        new_links=hyml_hydm_links(qiye_data['Category']);
        //获取所有企业节点，太卡了，注释了
        // points_qiye = qiye_nodes(qiye_data['Category']);

        new_points = points_hyml;
        new_points=new_points.concat(points_hydm);
        //太卡了，注释了
        // new_points=new_points.concat(points_qiye);

        // console.log(new_points)
        
        option = {
            animation:false,
            title: {
                text: '企业知识图谱',
                subtext: 'Default layout',
                top: 'bottom',
                left: 'right'
            },
            tooltip: {},
            // legend: [{
            //     // selectedMode: 'single',
            //     data: graph.categories.map(function (a) {
            //         return a.name;
            //     })
            // }],
            series: [{
                name: '类名',
                type: 'graph',
                layout: 'force',
                data: new_points,
                links: new_links,
                // categories: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
                // Categories:[111,222,333,555,777],
                roam: true,
                label: {
                    position: 'right'
                },
                force: {
                    repulsion: 100,
                    gravity:0.8,
                    // 禁止初始化时的转动动画
                    layoutAnimation:false
                },
                zoom:0.5
            }]
        };

        // myChart.on('click',function(params){
        //     // console.log(params) 
        //     // new_points[]
        //     // new_points.splice(1,20)
        //     // new_points[0]['category']=new_points[0]['category']*(-1)
        //     // myChart.setOption({
        //     //     series:[{
        //     //         data:new_points
        //     //     }]
        //     // })
            
        //     // console.log(new_points)
        // })

        myChart.setOption(option);
    });

    option && myChart.setOption(option);
    

}
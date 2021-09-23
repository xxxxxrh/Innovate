    width = 500
    height = 600
    // 投影
    var projection = d3.geoMercator()
        // 扬州经纬度
        .center([119.5, 32.5])
        // 缩放
        .scale(15000)
        .translate([width / 2, height / 2])


    var path = d3.geoPath()
        .projection(projection);


    var svg = d3.select("#yangzhouMap").insert("svg:svg")
        //.append('svg')//
        .attr('width', width + 'px')
        .attr('height', height + 'px');

    // 地图
    var states = svg.append("svg:g")
        .attr("id", "city");
    // 添加红点
    var circles = svg.append("svg:g")
        .attr("id", "circles");
    // 添加城市名
    var texts = svg.append("svg:g")
        .attr("id", "texts");




    // 加载扬州城市数据
    d3.json("json/yangzhou.json", function (data) {
        console.log(data.features);

        // 设置颜色值
        var ss2 = d3.schemeGnBu[9];
        var sp2 = d3.schemeYlOrRd[5];


        states.selectAll("path")
            .data(data.features)
            .enter().append("svg:path")
            .attr("d", path)
            // 区域边界线
            .attr('fill', '#ddd')
            // .attr('stroke', '#222')
            // .attr('stroke-width', '1px')
            .attr("fill", function (d, i) {
                return ss2[i % 5]
            })
            .on("mouseover", function (d, i) {
                tip.show(d);

                d3.select(this)
                    .attr("fill", sp2[i % 3]);
            })
            .on("mouseout", function (d, i) {
                tip.hide(d);

                d3.select(this)
                    .attr("fill", ss2[i % 5]);
            })
            /*
            0   宝应县
            1   高邮市
            2   广陵区
            3   江都区
            4   仪征市
            5   邗江区
            */
            .on("click", function(d,i){
                console.log(d);
                console.log(i);
                // 添加交互内容
            });
            ;

        console.log(data.points.features);
        // 获取各区的中心经纬坐标
        var points = data.points.features;
        var coo = function (d) {
            // 获取实际的经纬度
            var lngLat = d.geometry.coordinates;
            // 转化为映射在svg图上的坐标
            var coo = projection(lngLat);
            // console.log(coo);
            return coo;
        }
        // 添加红点
        circles.selectAll("circle")
            .data(points)
            .enter().append("svg:circle")
            // 添加经纬度
            .attr("cx", function (d) {
                return coo(d)[0];
            })
            .attr("cy", function (d) {
                return coo(d)[1];
            })
            .attr("r", 3)
            .attr('fill', 'red');



        // 添加城市名称
        texts.selectAll("text")
            .data(points)
            .enter().append("svg:text")
            .text(function (d) { return d.properties.name; })
            // 添加经纬度
            .attr("x", function (d) {
                return coo(d)[0] - 20;
            })
            .attr("y", function (d) {
                return coo(d)[1] - 10;
            })
            .attr('fill', '#000')
            .attr('font-size', '14px')
            ;



        // 添加鼠标悬浮窗
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([20, 0])
            .html(function (d) {
                return "<strong>物价指数: </strong><span class='details'>" + (93+ Math.round(Math.random()*17)) + "%" + "<br></span>";

                // return "<strong>物价指数: </strong><span class='details'>" +   + "<br></span>" + "<strong>Confirmed: </strong><span class='details'>" + "xxrh" + "</span>";
            });


        svg.call(tip);

    })


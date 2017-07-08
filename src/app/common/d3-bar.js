//
var d3 = require('d3');
var tip = require('d3-tip');
d3.tip = tip;
exports = module.exports = function () {
  'use strict';

  // Public variables with default settings
  var backgroundColor = '#f1f1f1';
  var padding = {
    top: 20,
    rigth: 100,
    bottom: 30,
    left: 40
  };

  var data; // 数据
  var stackColor = ['hsla(0,0%,0%,.1)', '#33ff33', '#ff3333', 'hsla(0,0%,0%,.1)'];

  var legendLineX1 = -6;
  var legendLineX2 = 6;
  var legendLineStroke = '#000';
  var legendTextX = 9;
  var legendTextDY = '0.35em';
  var legendTextColor = '#000';

  var lineColor = 'red';
  var lineWidth = 1;

  var stackLabelCustom = {};
  var defaultYear = new Date().getFullYear();
  // Private variables
  var WORK_MINUTE = (8 + 1.5) * 60; // 8工作小时+1.5小时午休
  var ALL_MINUTE = 24 * 60;
  var STACK_LABEL = ['workBefore', 'wokring', 'workOver', 'workAfter'];
  var STACK_LABEL_ZH = {
    'workBefore': 'Are you OK?',
    'wokring': '工作时间',
    'workOver': '加班时间',
    'workAfter': '下班'
  };

  function bar(selection) {
    selection.each(function () {
      // 指定图表区域与尺寸
      var svg = d3.select(this);
      var width = +svg.attr('width') - padding.left - padding.rigth;
      var height = +svg.attr('height') - padding.top - padding.bottom;
      var chart = svg.append('g')
        .attr('fill', backgroundColor)
        .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');
      // x比例尺
      var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .align(0.1);
      // y比例尺
      var y = d3.scaleLinear()
        .rangeRound([height, 0]);
      var yTime = d3.scaleTime()
        .domain([0, 24])
        .rangeRound([height, 0]);
      // 堆积图颜色
      var z = d3.scaleOrdinal()
        .domain(STACK_LABEL)
        .range(stackColor);
      // 堆积图定义
      var stack = d3.stack()
        .offset(d3.stackOffsetExpand);
      // 提示框
      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function (d) {
          var str = '<h3>' + d.data.xAxis + '<h3>' +
            '<p><span>工作时间:</span>' + formatTime(d.data[STACK_LABEL[1]]-90) + '</p>' +
            '<p><span>加班时间:</span>' + formatTime(d.data[STACK_LABEL[2]]) + '</p>';
          return str;
        });
      svg.call(tip);

      // 画堆叠图
      var newData = type(data);
      x.domain(newData.map(function (d) {
        return d.xAxis;
      }));
      var serie = chart.selectAll('.serie')
        .data(stack.keys(STACK_LABEL)(newData))
        .enter()
        .append('g')
        .attr('class', 'serie')
        .attr('fill', function (d) {
          return z(d.key);
        });
      serie.selectAll('rect')
        .data(function (d) {
          return d;
        })
        .enter()
        .append('rect')
        .attr('x', function (d) {
          return x(d.data.xAxis);
        })
        .attr('y', function (d) {
          return y(d[1]);
        })
        .attr('height', function (d) {
          return y(d[0]) - y(d[1]);
        })
        .attr('width', x.bandwidth())
        .on('mouseenter.tip', tip.show)
        .on('mouseleave.tip', tip.hide);
      // 画图例
      var legend = serie.append('g')
        .attr('class', 'legend')
        .attr('transform', function (d) {
          var d = d[d.length - 1];
          return 'translate(' + (x(d.data.xAxis) + x.bandwidth()) + ',' + ((y(d[0]) + y(d[1])) / 2) + ')';
        });
      legend.append('line')
        .attr('x1', legendLineX1)
        .attr('x2', legendLineX2)
        .attr('stroke', legendLineStroke);
      legend.append('text')
        .attr('x', legendTextX)
        .attr('dy', legendTextDY)
        .attr('fill', legendTextColor)
        .text(function (d) {
          if (stackLabelCustom.workBefore && stackLabelCustom.wokring && stackLabelCustom.workOver && stackLabelCustom.workAfter) {
            return stackLabelCustom[d.key];
          }
          return STACK_LABEL_ZH[d.key];
        });
      // 画坐标轴
      chart.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));
      chart.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y).ticks(24, 's'));
      // 画线
      drawLine(chart, y(570 / ALL_MINUTE), width);
      drawLine(chart, y(1080 / ALL_MINUTE), width);

    });

    /**
     * 数据转换为堆叠图格式
     *
     * @param {any} data 原始数据
     * @returns 堆叠图数据
     */
    function type(data) {
      var result = [];
      for (var i = 0; i < data.values.length; i++) {
        var day = new Date(defaultYear + '-' + data.axisX[i]).getDay();
        var isWeekend = (day == 6 || day == 0) ? true : false;

        var arr1 = data.values[i][0].split(':');
        var arr2 = data.values[i][1].split(':');

        var t1 = parseInt(arr1[0]) * 60 + parseInt(arr1[1]);
        var t2 = parseInt(arr2[0]) * 60 + parseInt(arr2[1]);

        var o = {
          xAxis: data.axisX[i],
          isWeekend: isWeekend,
          all: ALL_MINUTE
        };
        o[STACK_LABEL[0]] = t1;
        o[STACK_LABEL[1]] = (t2 - t1) > WORK_MINUTE ? WORK_MINUTE : (t2 - t1);;
        o[STACK_LABEL[2]] = (t2 - t1) > WORK_MINUTE ? (t2 - t1 - WORK_MINUTE) : 0;;
        o[STACK_LABEL[3]] = ALL_MINUTE - t2;
        result.push(o);
      }
      return result;
    }

    function formatTime(time) {
      return Math.round((time/60))+'小时';
    }

    /**
     * 画迟到早退红线
     *
     * @param {any} dom 操作区域
     * @param {any} point 线的起点
     * @param {any} width 线的长度
     */
    function drawLine(dom, point, width) {
      dom.append('line')
        .attr('x1', 0)
        .attr('y1', point)
        .attr('x2', width)
        .attr('y2', point)
        .attr('stroke-width', lineWidth)
        .attr('stroke', lineColor);
    }

  }
  // 暴露对外方法
  bar.data = function (_) {
    if (!arguments.length) {
      return data;
    }
    data = _;
    return bar;
  };

  return bar;
};

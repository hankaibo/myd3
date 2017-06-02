//
var d3 = require('d3');
var tip = require('d3-tip');
d3.tip = tip;
exports = module.exports = function () {
  'use strict';

  // Public variables with default settings
  var data; // 数据
  var barColor = ['#ff6868', '#002f3f']; // 柱子颜色
  var barBackgroundColor = '#f5fbfd'; // 柱子背景色
  var barHeight = 30; // 柱子的高度
  var barTextColor = '#000'; // 柱子文字颜色
  var barTextOffset = 30; // 柱子文字偏移量
  var labelTextAnchor = 'end'; // Y轴标签文字起点
  var chartWidth = 400; // 图表宽度
  var gapBetweenGroups = 30; // 每组柱形图的间距
  var spaceForLabels = 150; // 图表左部分宽度
  var spaceForLegend = 150; // 图表右部分宽度
  // Private variables
  var zippedData = [];
  var groupHeight;
  var chartHeight;

  function bar(selection) {
    selection.each(function () {
      // 抽取数据方便使用
      for (var i = 0; i < data.labels.length; i++) {
        for (var j = 0; j < data.series.length; j++) {
          zippedData.push(data.series[j].values[i]);
        }
      }

      // 组高度与图表高度
      groupHeight = barHeight * data.series.length;
      chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

      // x与y比例尺
      var x = d3.scaleLinear()
        .domain([0, d3.max(zippedData)])
        .range([0, chartWidth]);
      var y = d3.scaleLinear()
        .range([chartHeight + gapBetweenGroups, 0]);

      // y轴
      var yAxis = d3.axisLeft()
        .scale(y)
        .tickFormat('')
        .tickSize(0);

      // 指定图表区域与尺寸
      var chart = d3.select(this)
        .append('svg')
        .attr('width', spaceForLabels + chartWidth + spaceForLegend)
        .attr('height', chartHeight);

      // 提示框
      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function (d) {
          var firstValue = this.parentElement.children.item(3).innerHTML;
          var outerValue=firstValue ? firstValue : this.parentElement.previousSibling.children.item(3).innerHTML;
          return '<p>' +  outerValue + '</p><p>' + d + '</p>';
        });
      chart.call(tip);

      // 创建
      var bar = chart.selectAll('g')
        .data(zippedData)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          return 'translate(' + spaceForLabels + ',' + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i / data.series.length))) + ')';
        });

      // 创建指定长度的柱形图
      bar.append('rect')
        .attr('fill', barBackgroundColor)
        .attr('class', 'barBackgroundColor')
        .attr('width', function () {
          return x(3000);
        })
        .attr('height', barHeight - 1);
      bar.append('rect')
        .attr('fill', function (d, i) {
          return barColor[i % 2];
        })
        .attr('class', 'bar')
        .attr('width', x)
        .attr('height', barHeight - 1);

      // 柱形图添加文字
      bar.append('text')
        .attr('x', function (d) {
          return x(d) + barTextOffset;
        })
        .attr('y', barHeight / 2)
        .attr('fill', barTextColor)
        .attr('dy', '.35em')
        .text(function (d) {
          return d;
        });

      // 创建Y标签
      bar.append('text')
        .attr('class', 'label')
        .attr('x', function (d) {
          return -10;
        })
        .attr('y', groupHeight / 2)
        .attr('dy', '.35em')
        .text(function (d, i) {
          if (i % data.series.length === 0) {
            return data.labels[Math.floor(i / data.series.length)];
          } else {
            return ''
          }
        })
        .attr('text-anchor', labelTextAnchor);

      // 提示框效果
      bar.selectAll('rect.bar,rect.barBackgroundColor')
        .on('mouseenter', tip.show)
        .on('mouseleave', tip.hide);

      // Y轴
      chart.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + spaceForLabels + ', ' + -gapBetweenGroups / 2 + ')')
        .call(yAxis);

    });
  }
  // 暴露对外方法
  bar.data = function (_) {
    if (!arguments.length) {
      return data;
    }
    data = _;
    return bar;
  };
  bar.barColor = function (_) {
    if (!arguments.length) {
      return barColor;
    }
    barColor = _;
    return bar;
  };
  bar.barBackgroundColor = function (_) {
    if (!arguments.length) {
      return barBackgroundColor;
    }
    barBackgroundColor = _;
    return bar;
  };
  bar.barHeight = function (_) {
    if (!arguments.length) {
      return barHeight;
    }
    barHeight = _;
    return bar;
  };
  bar.barTextColor = function (_) {
    if (!arguments.length) {
      return barTextColor;
    }
    barTextColor = _;
    return bar;
  };
  bar.barTextOffset = function (_) {
    if (!arguments.length) {
      return barTextOffset;
    }
    barTextOffset = _;
    return bar;
  };
  bar.chartWidth = function (_) {
    if (!arguments.length) {
      return chartWidth;
    }
    chartWidth = _;
    return bar;
  };
  bar.gapBetweenGroups = function (_) {
    if (!arguments.length) {
      return gapBetweenGroups;
    }
    gapBetweenGroups = _;
    return bar;
  };
  bar.spaceForLabels = function (_) {
    if (!arguments.length) {
      return spaceForLabels;
    }
    spaceForLabels = _;
    return bar;
  };
  bar.spaceForLegend = function (_) {
    if (!arguments.length) {
      return spaceForLegend;
    }
    spaceForLegend = _;
    return bar;
  };

  return bar;
};

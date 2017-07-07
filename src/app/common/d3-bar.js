//
var d3 = require('d3');
var tip = require('d3-tip');
d3.tip = tip;
exports = module.exports = function () {
  'use strict';

  // Public variables with default settings
  var data; // 数据
  var margin = {
    top: 0,
    rigth: 0,
    bottom: 0,
    left: 0
  };
  var padding = {
    top: 20,
    rigth: 60,
    bottom: 30,
    left: 40
  };
  // Private variables

  function bar(selection) {
    selection.each(function () {
      // 指定图表区域与尺寸
      var svg = d3.select(this);
      var width = +svg.attr('width') - padding.left - padding.rigth;
      var height = +svg.attr('height') - padding.top - padding.bottom;
      var chart = svg.append('g')
        .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');

      var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .align(0.1);
      var y = d3.scaleLinear()
        .rangeRound([height, 0]);
      var yTime = d3.scaleTime()
        .domain([0, 24])
        .rangeRound([height, 0]);

      var z = d3.scaleOrdinal()
        .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);
      var stack = d3.stack()
        .offset(d3.stackOffsetNone);
      // .offset(d3.stackOffsetExpand);

      d3.csv('data.csv', type, function (error, data) {
        if (error) throw error;
        // data.sort(function (a, b) {
        //   return b[data.columns[1]] / b.total - a[data.columns[1]] / a.total;
        // });
        x.domain(data.map(function (d) {
          return d.State;
        }))
        z.domain(data.columns.slice(1));

        var serie = chart.selectAll('.serie')
          .data(stack.keys(data.columns.slice(1))(data))
          .enter().append('g')
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
            return x(d.data.State);
          })
          .attr('y', function (d) {
            return y(d[1]);
          })
          .attr('height', function (d) {
            return y(d[0]) - y(d[1]);
          })
          .attr('width', x.bandwidth());

        chart.append('g')
          .attr('class', 'axis axis--x')
          .attr('transform', 'translate(0,' + height + ')')
          .call(d3.axisBottom(x));

        chart.append('g')
          .attr('class', 'axis axis--y')
          .call(d3.axisLeft(yTime).ticks(24, ':00'));

        var legend = serie.append('g')
          .attr('class', 'legend')
          .attr('transform', function (d) {
            var d = d[d.length - 1];
            return 'translate(' + (x(d.data.State) + x.bandwidth()) + ',' + ((y(d[0]) + y(d[1])) / 2) + ')'
          });

        legend.append('line')
          .attr('x1', -6)
          .attr('x2', 6)
          .attr('stroke', '#000');

        legend.append('text')
          .attr('x', 9)
          .attr('dy', '0.35em')
          .attr('fill', '#000')
          .style('font', '10px sans-serif')
          .text(function (d) {
            return d.key;
          });
      });

      function type(d, i, columns) {
        var t;
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;
        return d;
      }

      function toSecond(timeStr) {
        var arr = timeStr.split(':');
        return parseInt(arr[0]) * 60 * 60 + parseInt(arr[1]) * 60;
      }

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

  return bar;
};

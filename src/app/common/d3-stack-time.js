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
    left: 80
  };

  var data; // 数据
  var stackColor = [
    'hsla(0,0%,0%,.1)',
    '#99ff33',
    'hsla(0,0%,0%,.1)',
    '#33ff33',
    'hsla(0,0%,0%,.1)',
    'hsla(0,0%,0%,.1)',
    'hsla(0,0%,0%,.1)',
    '#33ff33',
    'hsla(0,0%,0%,.1)',
    'yellow',
    'hsla(0,0%,0%,.1)'
  ];
  var stackPadding = 0.3;
  var stackAlign = 0.1;

  var xAxisNum = 24;

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

  var workMinute = 8 * 60; // 8工作时间
  var elasticStart = 8 * 60 + 30; // 弹性上班最早开始时间
  var elasticEnd = 9 * 60 + 30; // 弹性上班最晚开始时间
  var restMinute = 1.5 * 60; //午休时间
  // Private variables
  var ALL_MINUTE = 24 * 60; // 全天时间
  var HALF_MINUTE = 12 * 60; // 半天时间
  var AFTERNOON_START = HALF_MINUTE + restMinute; // 下午上班时间
  var AFTERNOON_END = workMinute + elasticStart + restMinute; // 下午下班最早时间
  var STACK_LABEL = ['workBefore', 'workPre', 'workingAMLate', 'workingAM', 'workingAMEarly', 'lunchTime', 'workingPMLate', 'workingPM', 'workingPMEarly', 'workOver', 'workAfter'];
  var STACK_LABEL_ZH = {
    'workBefore': '休息时间',
    'workPre': '预备时间',
    'workingAMLate': '上午迟到时间',
    'workingAM': '上午工作时间',
    'workingAMEarly': '上午早退时间',
    'lunchTime': '午休时间',
    'workingPMLate': '下午迟到时间',
    'workingPM': '下午工作时间',
    'workingPMEarly': '下午早退时间',
    'workOver': '加班时间',
    'workAfter': '休息时间'
  };

  function chart(selection) {
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
        .padding(stackPadding)
        .align(stackAlign);
      // y比例尺
      var y = d3.scaleLinear()
        .rangeRound([height, 0]);
      var yTime = d3.scaleTime()
        .domain([new Date(defaultYear, 0, 1, 0, 0, 0), new Date(defaultYear, 0, 1, 23, 59, 59)])
        .range([height, 0]);
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
          var isWeekend = d.data['isWeekend'];
          var t1 = d.data[STACK_LABEL[0]];
          var t2 = d.data[STACK_LABEL[1]];
          var t3 = d.data[STACK_LABEL[2]];
          var t4 = d.data[STACK_LABEL[3]];
          var t5 = d.data[STACK_LABEL[4]];
          var t6 = d.data[STACK_LABEL[5]];
          var t7 = d.data[STACK_LABEL[6]];
          var t8 = d.data[STACK_LABEL[7]];
          var t9 = d.data[STACK_LABEL[8]];
          var t10 = d.data[STACK_LABEL[9]];
          var t11 = d.data[STACK_LABEL[10]];
          if (isWeekend && (t4 + t8) <= 0) {
            return '<h3>' + d.data.xAxis + '<h3><p>周末休息</p>';
          }
          if (!isWeekend && (t4 + t8) <= 0) {
            return '<h3>' + d.data.xAxis + '<h3><p>今日未打卡</p>';
          }
          var startTime = 0;
          var endTime = 0;
          var addTime = 0;
          if (t4 <= 0) {
            startTime = HALF_MINUTE + t6 + t7;
            endTime = startTime + t8;
            addTime = t10 <= 0 ? endTime : (endTime + t9 + t10);
          } else if (t8 <= 0) {
            startTime = t1 + t2 + t3;
            endTime = startTime + t4;
            addTime = endTime;
          } else {
            startTime = t1 + t2 + t3;
            endTime = HALF_MINUTE + t6 + t7 + t8;
            addTime = t10 <= 0 ? endTime : (endTime + t9 + t10);
          }
          var addTimeStr = t10 > 0 ? (convert(endTime) + '--' + convert(addTime)) : 'none';
          var str = '<h3>' + d.data.xAxis + '<h3>' +
            '<p><span>工作时间:</span>' +
            formatTime(t4 + t8) +
            '<small>(' + convert(startTime) + '--' + convert(endTime) + ')</small></p>' +
            '<p><span>加班时间:</span>' +
            formatTime(t10) +
            '<small>(' + addTimeStr + ')</small></p>';
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
          var h = y(d[0]) - y(d[1]);
          return h > 0 ? h : 0;
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
          return stackLabelCustom[d.key] ? stackLabelCustom[d.key] : STACK_LABEL_ZH[d.key];
        });
      // 画坐标轴
      chart.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));
      chart.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(yTime).ticks(xAxisNum));
      // 画线
      drawLine(chart, y(elasticEnd / ALL_MINUTE), width);
      drawLine(chart, y(AFTERNOON_END / ALL_MINUTE), width);

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
        // tepm object
        var o = {
          xAxis: data.axisX[i],
          isWeekend: isWeekend,
          all: ALL_MINUTE
        };

        var len = data.values[i].length;
        if (len >= 2) {
          var arr1 = data.values[i][0].split(':');
          var arr2 = data.values[i][len - 1].split(':');
          var t1 = parseInt(arr1[0]) * 60 + parseInt(arr1[1]); // 上班打卡时间
          var t2 = parseInt(arr2[0]) * 60 + parseInt(arr2[1]); // 下班打卡时间

          var s1; // 休息时间
          var s2; // 预备时间
          var s3; // 上午迟到时间
          var s4; // 上午工作时间
          var s5; // 上午早退时间
          var s6; // 午休时间
          var s7; // 下午迟到时间
          var s8; // 下午工作时间
          var s9; // 下午早退时间
          var s10; // 加班时间
          var s11; // 休息时间

          if (t1 < HALF_MINUTE) {
            // s2
            if (t1 < elasticStart) {
              s2 = (t2 > elasticStart ? elasticStart : t2) - t1;
            } else {
              s2 = 0;
            }
            // s3
            if (t1 > elasticEnd) {
              s3 = t1 - elasticEnd;
            } else {
              s3 = 0;
            }
            // s4
            if (t2 <= elasticStart) {
              s4 = 0;
            } else if (t1 <= elasticStart && t2 <= HALF_MINUTE) {
              s4 = t2 - elasticStart;
            } else if (t1 <= elasticStart && t2 > HALF_MINUTE) {
              s4 = HALF_MINUTE - elasticStart;
            } else if (t1 > elasticStart && t2 <= HALF_MINUTE) {
              s4 = t2 - t1;
            } else if (t1 > elasticStart && t2 > HALF_MINUTE) {
              s4 = HALF_MINUTE - t1;
            } else {
              s4 = 0;
            }
            // s5
            if (t2 < HALF_MINUTE) {
              s5 = HALF_MINUTE - t2;
            } else {
              s5 = 0;
            }
            // s1
            if (t1 >= 0) {
              s1 = HALF_MINUTE - s2 - s3 - s4 - s5;
            }
          } else {
            s1 = elasticEnd;
            s2 = 0;
            s3 = HALF_MINUTE - elasticEnd;
            s4 = 0;
            s5 = 0;
          }
          s6 = restMinute;
          // s7
          if (t1 > AFTERNOON_START && t1 < AFTERNOON_END + (elasticEnd - elasticStart)) {
            s7 = t1 - AFTERNOON_START
          } else if (t1 > AFTERNOON_END + (elasticEnd - elasticStart)) {
            s7 = AFTERNOON_END + (elasticEnd - elasticStart) - AFTERNOON_START;
          } else {
            s7 = 0;
          }
          // s8
          if (t2 <= AFTERNOON_START) {
            s8 = 0;
          } else {
            s8 = (t2 - (t1 <= AFTERNOON_START ? AFTERNOON_START : t1) + s4 >= workMinute) ? (workMinute - s4) : (t2 - (t1 <= AFTERNOON_START ? AFTERNOON_START : t1));
          }
          // s10
          if (s4 + s8 < workMinute) {
            s10 = 0;
          } else {
            s10 = t2 - (t1 < elasticStart ? elasticStart : t1) - workMinute - restMinute;
          }
          // s11
          if (t2 <= ALL_MINUTE) {
            s11 = ALL_MINUTE - t2;
          }
          // s9
          s9 = HALF_MINUTE - s6 - s7 - s8 - s10 - s11;

          o[STACK_LABEL[0]] = s1;
          o[STACK_LABEL[1]] = s2;
          o[STACK_LABEL[2]] = s3;
          o[STACK_LABEL[3]] = s4;
          o[STACK_LABEL[4]] = s5;
          o[STACK_LABEL[5]] = s6;
          o[STACK_LABEL[6]] = s7;
          o[STACK_LABEL[7]] = s8;
          o[STACK_LABEL[8]] = s9;
          o[STACK_LABEL[9]] = s10;
          o[STACK_LABEL[10]] = s11;
          console.log((s1 + s2 + s3 + s4 + s5) == (s11 + s10 + s6 + s7 + s8 + s9));
          result.push(o);
        } else {
          o[STACK_LABEL[0]] = HALF_MINUTE;
          o[STACK_LABEL[1]] = 0;
          o[STACK_LABEL[2]] = 0;
          o[STACK_LABEL[3]] = 0;
          o[STACK_LABEL[4]] = 0;
          o[STACK_LABEL[5]] = 0;
          o[STACK_LABEL[6]] = 0;
          o[STACK_LABEL[7]] = 0;
          o[STACK_LABEL[8]] = 0;
          o[STACK_LABEL[9]] = 0;
          o[STACK_LABEL[10]] = HALF_MINUTE;
          result.push(o);
        }
      }
      return result;
    }

    function formatTime(time) {
      var hour;
      var minute;
      hour = Math.floor(time / 60);
      if (time % 60 === 0) {
        minute = 0;
      } else {
        minute = time % 60;
      }
      if (hour === 0) {
        return minute + '分钟';
      } else if (hour !== 0 && minute === 0) {
        return hour + '小时';
      } else {
        return hour + '小时' + minute + '分钟';
      }
    }

    function convert(time) {
      var hour;
      var minute;
      hour = Math.floor(time / 60);
      if (time % 60 === 0) {
        minute = 0;
      } else {
        minute = time % 60;
      }
      return hour + ':' + (minute < 10 ? ('0' + minute) : minute);
    }

    /**
     * 画线
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
  chart.backgroundColor = function (_) {
    if (!arguments.length) {
      return backgroundColor;
    }
    backgroundColor = _;
    return chart;
  };
  chart.padding = function (_) {
    if (!arguments.length) {
      return padding;
    }
    padding = _;
    return chart;
  };
  chart.data = function (_) {
    if (!arguments.length) {
      return data;
    }
    data = _;
    return chart;
  };
  chart.stackColor = function (_) {
    if (!arguments.length) {
      return stackColor;
    }
    stackColor = _;
    return chart;
  };
  chart.stackPadding = function (_) {
    if (!arguments.length) {
      return stackPadding;
    }
    stackPadding = _;
    return chart;
  };
  chart.stackAlign = function (_) {
    if (!arguments.length) {
      return stackAlign;
    }
    stackAlign = _;
    return chart;
  };
  chart.xAxisNum = function (_) {
    if (!arguments.length) {
      return xAxisNum;
    }
    xAxisNum = _;
    return chart;
  };
  chart.legendLineX1 = function (_) {
    if (!arguments.length) {
      return legendLineX1;
    }
    legendLineX1 = _;
    return chart;
  };
  chart.legendLineX2 = function (_) {
    if (!arguments.length) {
      return legendLineX2;
    }
    legendLineX2 = _;
    return chart;
  };
  chart.legendLineStroke = function (_) {
    if (!arguments.length) {
      return legendLineStroke;
    }
    legendLineStroke = _;
    return chart;
  };
  chart.legendTextX = function (_) {
    if (!arguments.length) {
      return legendTextX;
    }
    legendTextX = _;
    return chart;
  };
  chart.legendTextDY = function (_) {
    if (!arguments.length) {
      return legendTextDY;
    }
    legendTextDY = _;
    return chart;
  };
  chart.legendTextColor = function (_) {
    if (!arguments.length) {
      return legendTextColor;
    }
    legendTextColor = _;
    return chart;
  };
  chart.lineColor = function (_) {
    if (!arguments.length) {
      return lineColor;
    }
    lineColor = _;
    return chart;
  };
  chart.lineWidth = function (_) {
    if (!arguments.length) {
      return lineWidth;
    }
    lineWidth = _;
    return chart;
  };
  chart.stackLabelCustom = function (_) {
    if (!arguments.length) {
      return stackLabelCustom;
    }
    stackLabelCustom = _;
    return chart;
  };
  chart.defaultYear = function (_) {
    if (!arguments.length) {
      return defaultYear;
    }
    defaultYear = _;
    return chart;
  };
  chart.workMinute = function (_) {
    if (!arguments.length) {
      return workMinute;
    }
    workMinute = _;
    return chart;
  };
  chart.elasticStart = function (_) {
    if (!arguments.length) {
      return elasticStart;
    }
    elasticStart = _;
    return chart;
  };
  chart.elasticEnd = function (_) {
    if (!arguments.length) {
      return elasticEnd;
    }
    elasticEnd = _;
    return chart;
  };
  chart.restMinute = function (_) {
    if (!arguments.length) {
      return restMinute;
    }
    restMinute = _;
    return chart;
  };

  return chart;
};

var d3 = require('d3');
var tip = require('d3-tip');
d3.tip = tip;
exports = module.exports = function () {
  'use strict';
  // Public variables with default settings
  var backgroundColor = '#f1f1f1';
  var padding = {
    top: 40,
    rigth: 100,
    bottom: 30,
    left: 80
  };
  var data;
  var stackColor = [
    'hsla(0,0%,0%,.1)',
    '#33ff33',
    'hsla(0,0%,0%,.1)',
    'red',
    '#33ff33',
    'yellow',
    'hsla(0,0%,0%,.1)',
    'red',
    '#33ff33',
    'yellow',
    '#33ff33',
    'hsla(0,0%,0%,.1)'
  ];
  var stackPadding = 0.3;
  var stackAlign = 0.1;
  var threshold = 6 * 60;
  var titleText = 'title';
  var titleTextX = 9;
  var titleTextDY = '0.35em';
  var titleTranslateX = 0;
  var titleTranslateY = 0;
  var titleColor = '#000';
  var titleFontSize = '18';
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
  var elasticFirst = 8 * 60 + 30; // 弹性上班最早开始时间
  var elasticLatest = 9 * 60 + 30; // 弹性上班最晚开始时间
  var restMinute = 1.5 * 60; //午休时间
  // Private variables
  var ALL_MINUTE = 24 * 60; // 全天时间
  var HALF_MINUTE = 12 * 60; // 半天时间
  var AFTERNOON_START = HALF_MINUTE + restMinute; // 下午上班时间
  var AFTERNOON_FIRST = workMinute + elasticFirst + restMinute; // 下午下班最早时间
  var AFTERNOON_LATEST = workMinute + elasticLatest + restMinute; // 下午下班最晚时间
  var STACK_LABEL = ['AMBefore', 'AMOver', 'AMRest', 'AMLate', 'AMWork', 'AMEarly', 'PMRest', 'PMLate', 'PMWork', 'PMEarly', 'PMOver', 'PMAfter'];
  var STACK_LABEL_ZH = {
    'AMBefore': '休息时间',
    'AMOver': '加班时间',
    'AMRest': '上午休息时间',
    'AMLate': '上午迟到时间',
    'AMWork': '上午工作时间',
    'AMEarly': '上午早退时间',

    'PMRest': '午休时间',
    'PMLate': '下午迟到时间',
    'PMWork': '下午工作时间',
    'PMEarly': '下午早退时间',
    'PMOver': '加班时间',
    'PMAfter': '休息时间'
  };

  function chart(selection) {
    selection.each(function () {
      // 指定图表区域与尺寸
      var svg = d3.select(this);
      var width = +svg.attr('width') - padding.left - padding.rigth;
      var height = +svg.attr('height') - padding.top - padding.bottom;
      var chart = svg.append('g')
        .attr('fill', backgroundColor)
        .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
        .attr('viewbox', function () {
          return (padding.left + ' ' + padding.top + ' ' + width + ' ' + height);
        });
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
        // .range(d3.schemeCategory20);
        .range(stackColor);
      // 堆积图定义
      var stack = d3.stack()
        .offset(d3.stackOffsetExpand);
      // 提示框
      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function (d) {
          var isWeekend = d.data['isWeekend'];
          var t1 = d.data[STACK_LABEL[0]]; // 休息时间
          var t2 = d.data[STACK_LABEL[1]]; // 上午加班时间
          var t3 = d.data[STACK_LABEL[2]]; // 上午休息时间
          var t4 = d.data[STACK_LABEL[3]]; // 上午迟到时间
          var t5 = d.data[STACK_LABEL[4]]; // 上午工作时间
          var t6 = d.data[STACK_LABEL[5]]; // 上午早退时间

          var t7 = d.data[STACK_LABEL[6]]; // 下午休息时间
          var t8 = d.data[STACK_LABEL[7]]; // 下午迟到时间
          var t9 = d.data[STACK_LABEL[8]]; // 下午工作时间
          var t10 = d.data[STACK_LABEL[9]]; // 下午早退时间
          var t11 = d.data[STACK_LABEL[10]]; // 下午加班时间
          var t12 = d.data[STACK_LABEL[11]]; // 休息时间
          if (isWeekend && (t2 + t5 + t9 + t11) <= 0) {
            return '<h3>' + d.data.xAxis + '<h3><p>周末休息</p>';
          }
          if (!isWeekend && (t2 + t5 + t9 + t11) <= 0) {
            return '<h3>' + d.data.xAxis + '<h3><p>今日未打卡</p>';
          }
          var startTime = 0;
          var endTime = 0;
          var amOverTime = 0;
          var pmOverTime = 0;

          // 上午之间打卡
          if (t2 + t5 > 0) {
            startTime = HALF_MINUTE - t5 - t6;
          } else {
            startTime = HALF_MINUTE + t7 + t8;
          }
          endTime = HALF_MINUTE - t6 + t7 + t8 + t9;
          amOverTime = t1;
          pmOverTime = HALF_MINUTE + t7 + t9 + t11;

          var amOverTimeStr = t2 > 0 ? (convert(amOverTime) + '--' + convert(startTime)) : 'none';
          var pmOverTimeStr = t11 > 0 ? (convert(endTime) + '--' + convert(pmOverTime)) : 'none';
          var str = '<h3>' + d.data.xAxis + '<h3>' +
            '<p><span>工作时间:</span>' +
            formatTime(t5 + t9) +
            '<small>(' + convert(startTime) + '--' + convert(endTime) + ')</small></p>';;
          if (t2) {
            str += '<p><span>上午加班时间:</span>' +
              formatTime(t2) +
              '<small>(' + amOverTimeStr + ')</small></p>'
          }
          if (t11) {
            str += '<p><span>下午加班时间:</span>' +
              formatTime(t11) +
              '<small>(' + pmOverTimeStr + ')</small></p>'
          }
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
      // 画标题
      var title = chart.append('g')
        .attr('class', 'title')
        .attr('transform', function (d) {
          return 'translate(' + (width / 2 + titleTranslateX) + ',' + (-padding.top / 2 + titleTranslateY) + ')';
        });
      title.append('text')
        .attr('x', titleTextX)
        .attr('dy', titleTextDY)
        .attr('fill', titleColor)
        .attr('fontSize', titleFontSize)
        .text(titleText);
      // 画图例
      // var legend = serie.append('g')
      //   .attr('class', 'legend')
      //   .attr('transform', function (d) {
      //     var d = d[d.length - 1];
      //     return 'translate(' + (x(d.data.xAxis) + x.bandwidth()) + ',' + ((y(d[0]) + y(d[1])) / 2) + ')';
      //   });
      // legend.append('line')
      //   .attr('x1', legendLineX1)
      //   .attr('x2', legendLineX2)
      //   .attr('stroke', legendLineStroke);
      // legend.append('text')
      //   .attr('x', legendTextX)
      //   .attr('dy', legendTextDY)
      //   .attr('fill', legendTextColor)
      //   .text(function (d) {
      //     return stackLabelCustom[d.key] ? stackLabelCustom[d.key] : STACK_LABEL_ZH[d.key];
      //   });
      // 画坐标轴
      chart.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));
      chart.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(yTime).ticks(xAxisNum));
      // 画线
      drawLine(chart, y(elasticLatest / ALL_MINUTE), width);
      drawLine(chart, y(AFTERNOON_FIRST / ALL_MINUTE), width);

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
        // object
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

          var AMBefore = 0; // 休息时间
          var AMOver = 0; // 预备时间,(超过阈值当作加班时间)
          var AMRest = 0; // 上午休息时间
          var AMLate = 0; // 上午迟到时间
          var AMWork = 0; // 上午工作时间
          var AMEarly = 0; // 上午早退时间

          var PMRest = 0; // 午休时间
          var PMLate = 0; // 下午迟到时间
          var PMWork = 0; // 下午工作时间
          var PMEarly = 0; // 下午早退时间
          var PMOver = 0; // 加班时间，非正常情况下特殊加班用
          var PMAfter = 0; // 休息时间

          if (t2 <= elasticFirst) {
            AMBefore = t1;
            AMOver = t2 - t1;
            AMRest = HALF_MINUTE - t2;
            AMLate = 0;
            AMWork = 0;
            AMEarly = 0;

            PMRest = 0;
            PMLate = 0;
            PMWork = 0;
            PMEarly = 0;
            PMOver = 0;
            PMAfter = HALF_MINUTE;
          } else if (t2 <= HALF_MINUTE) {
            AMBefore = t1;
            if (t1 < elasticFirst) {
              AMOver = elasticFirst - t1;
            } else {
              AMOver = 0;
            }
            AMRest = 0;
            if (t1 > elasticLatest) {
              AMLate = t1 - elasticLatest;
            } else {
              AMLate = 0;
            }
            if (t1 <= elasticFirst) {
              AMWork = t2 - elasticFirst;
            } else if (t1 > elasticFirst) {
              AMWork = t2 - t1;
            } else {
              AMWork = 0;
            }
            AMEarly = HALF_MINUTE - t2;

            PMRest = 0;
            PMLate = 0;
            PMWork = 0
            PMEarly = 0;
            PMOver = 0;
            PMAfter = HALF_MINUTE;
          } else if (t2 <= AFTERNOON_START && t1 >= HALF_MINUTE) {
            AMBefore = HALF_MINUTE;
            AMOver = 0;
            AMRest = 0;
            AMLate = 0;
            AMWork = 0;
            AMEarly = 0;
            PMRest = restMinute;
            PMLate = 0;
            PMWork = 0;
            PMEarly = 0;
            PMOver = 0;
            PMAfter = HALF_MINUTE - restMinute;
          } else if (t1 >= HALF_MINUTE) {
            AMBefore = HALF_MINUTE;
            AMOver = 0;
            AMRest = 0;
            AMLate = 0;
            AMWork = 0;
            AMEarly = 0;
            PMRest = restMinute;
            PMLate = t1 > AFTERNOON_START ? (t1 - AFTERNOON_START) : 0;
            PMWork = (t2 - t1 >= workMinute) ? workMinute : (t2 - (t1 < AFTERNOON_START ? AFTERNOON_START : t1));
            PMEarly = (t2 < AFTERNOON_FIRST) ? (AFTERNOON_FIRST - t2) : 0;
            PMOver = (PMWork < workMinute) ? 0 : (AMWork - workMinute);
            PMAfter = ALL_MINUTE - (t2 < AFTERNOON_START ? AFTERNOON_START : t2) - PMEarly;
          } else if (t1 >= AFTERNOON_LATEST) {
            AMBefore = HALF_MINUTE;
            AMOver = 0;
            AMRest = 0;
            AMLate = 0;
            AMWork = 0;
            AMEarly = 0;
            PMRest = HALF_MINUTE - PMOver - PMAfter;
            PMLate = 0;
            PMWork = 0;
            PMEarly = 0;
            PMOver = t2 - t1;
            PMAfter = ALL_MINUTE - t2;
          } else {
            AMOver = t1 > elasticFirst ? 0 : (elasticFirst - t1);
            AMRest = 0;
            AMLate = t1 < elasticLatest ? 0 : t1 - elasticLatest;
            AMWork = HALF_MINUTE - (t1 >= elasticFirst ? t1 : elasticFirst);
            AMEarly = 0;
            AMBefore = t1 - AMLate;

            PMRest = restMinute;
            PMLate = 0;
            if (t2 < AFTERNOON_START) {
              PMWork = 0;
            } else {
              var temp = t2 - (t1 < elasticFirst ? elasticFirst : t1) - restMinute;
              PMWork = temp > workMinute ? (workMinute - AMWork) : (temp - AMWork);
            }
            if (t2 < AFTERNOON_LATEST) {
              PMEarly = workMinute - AMWork - PMWork;
            } else {
              PMEarly = 0;
            }
            PMOver = (t2 - (t1 < elasticFirst ? elasticFirst : t1) - restMinute - workMinute) > 0 ? (t2 - (t1 < elasticFirst ? elasticFirst : t1) - restMinute - workMinute) : 0;
            PMAfter = ALL_MINUTE - (t2 < AFTERNOON_START ? AFTERNOON_START : t2) - PMEarly;
          }

          o[STACK_LABEL[0]] = AMBefore;
          o[STACK_LABEL[1]] = AMOver;
          o[STACK_LABEL[2]] = AMRest;
          o[STACK_LABEL[3]] = AMLate;
          o[STACK_LABEL[4]] = AMWork;
          o[STACK_LABEL[5]] = AMEarly;
          o[STACK_LABEL[6]] = PMRest;
          o[STACK_LABEL[7]] = PMLate;
          o[STACK_LABEL[8]] = PMWork;
          o[STACK_LABEL[9]] = PMEarly;
          o[STACK_LABEL[10]] = PMOver;
          o[STACK_LABEL[11]] = PMAfter;
          console.log((AMBefore + AMOver + AMRest + AMLate + AMWork + AMEarly) == (PMAfter + PMOver + PMRest + PMLate + PMWork + PMEarly));
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
          o[STACK_LABEL[10]] = 0;
          o[STACK_LABEL[11]] = HALF_MINUTE;
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
  chart.titleText = function (_) {
    if (!arguments.length) {
      return titleText;
    }
    titleText = _;
    return chart;
  };
  chart.titleTextX = function (_) {
    if (!arguments.length) {
      return titleTextX;
    }
    titleTextX = _;
    return chart;
  };
  chart.titleTextDY = function (_) {
    if (!arguments.length) {
      return titleTextDY;
    }
    titleTextDY = _;
    return chart;
  };
  chart.titleTranslateX = function (_) {
    if (!arguments.length) {
      return titleTranslateX;
    }
    titleTranslateX = _;
    return chart;
  };
  chart.titleTranslateY = function (_) {
    if (!arguments.length) {
      return titleTranslateY;
    }
    titleTranslateY = _;
    return chart;
  };
  chart.titleColor = function (_) {
    if (!arguments.length) {
      return titleColor;
    }
    titleColor = _;
    return chart;
  };
  chart.titleFontSize = function (_) {
    if (!arguments.length) {
      return titleFontSize;
    }
    titleFontSize = _;
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
  chart.elasticFirst = function (_) {
    if (!arguments.length) {
      return elasticFirst;
    }
    elasticFirst = _;
    return chart;
  };
  chart.elasticLatest = function (_) {
    if (!arguments.length) {
      return elasticLatest;
    }
    elasticLatest = _;
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

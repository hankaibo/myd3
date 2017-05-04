/**
 * @author hankaibo
 */
var d3 = require('d3');
exports = module.exports = function () {
  'use strict';
  // Public variables with default settings
  var width = 400;
  var height = 250;
  var backgroundColor = '#fff';
  var transitonTime = 2000;

  var centerTextValue = 82;
  var centerTextValueFontSize = '28';
  var centerTextValueColor = 'green';
  var centerTextValueTextAnchor = 'middle';
  var centerTextValueX = 0;
  var centerTextValueY = -40;

  var centerArrowLineStrokeWidth = 3;
  var centerArrowLineStroke = 'red';
  var centerArrowLineX1 = 50;
  var centerArrowLineY1 = -40;
  var centerArrowLineX2 = 50;
  var centerArrowLineY2 = -55;

  var centerTextTitle = '良';
  var centerTextTitleFontSize = '28';
  var centerTextTitleColor = 'red';
  var centerTextTitleTextAnchor = 'middle';
  var centerTextTitleX = 0;
  var centerTextTitleY = 0;

  var outerRadiusIn = 120;
  var innerRadiusIn = 115;
  var startAngleIn = -Math.PI / 2;
  var endAngleIn = Math.PI / 2;
  var cornerRadiusIn = 10;
  var orbitColorIn = '#ddd';

  var outerRadiusOut = 150;
  var innerRadiusOut = 130;
  var startAngleOut = -Math.PI / 2;
  var endAngleOut = Math.PI / 2;
  var cornerRadiusOut = 50;
  var orbitBackgroundColorOut = '#ddd';
  var orbitColorOut = 'orange';

  var lightEffectImg = '';
  var lightEffectWidth = 0;
  var lightEffectHeight = 0;

  var scaleRadius = 150;
  var scaleColor = '#000';
  var scaleTextColor = '#eff0f1';


  // Private
  var tau = 2 * Math.PI;
  var pi = Math.PI;
  var n = 500;
  var p = d3.precisionFixed(0.05);
  var formatPost = d3.format('.' + p + 'f');

  function chart(selection) {
    selection.each(function () {
      var scaleOrbitIn = d3.scaleLinear()
        .domain([0, 100])
        .range([startAngleIn, endAngleIn]);
      // svg区域
      var svg = d3.select(this);
      var width = +svg.attr('width');
      var height = +svg.attr('height');
      // 操作区域
      var dom = svg.style('background-color', backgroundColor)
        // .attr('viewBox', '0 0 400 250')
        // .attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
      // 三角形
      createArrow(dom);
      // 中心区域
      createCenterArea(dom);
      // 创建内轨道
      ceateOrbitIn(dom);
      // 创建外轨道
      createOrbitOut(dom);
      // 创建刻度
      createScale(dom);

      // dom.selectAll('path.arc')
      //   .sort(function (a, b) {
      //     return 1;
      //   });

      /**
       * 创建刻度
       *
       * @param {any} dom 操作区域
       */
      function createScale(dom) {
        var arc = d3.arc()
          .outerRadius(scaleRadius)
          .innerRadius(scaleRadius)
          .startAngle(-pi / 2)
          .endAngle(pi / 2)
          .cornerRadius(10);

        var ga = dom.append('g')
          .attr('class', 'a axis')
          .selectAll('g')
          .data(d3.range(0, 181, 45))
          .enter()
          .append('g')
          .attr('transform', function (d) {
            return 'rotate(' + -(180 - d) + ')';
          });

        ga.append('text')
          .attr('x', scaleRadius + 25)
          .attr('dy', '.35em')
          .style('fill', scaleTextColor)
          .style('text-anchor', function (d) {
            return d > 0 && d < 90 ? 'end' : null;
          })
          .attr('transform', function (d) {
            return d > 0 && d < 90 ? 'rotate(180 ' + (scaleRadius + 25) + ',0)' : null;
          })
          .text(function (d, i) {
            return i * 25;
          });


        // -------------
        var gaga1 = dom.append('g')
          .attr('class', 'a axis')
          .selectAll('g')
          .data(d3.range(0, 181, 9))
          .enter()
          .append('g')
          .attr('transform', function (d) {
            return 'rotate(' + d + ') ';
          });

        gaga1.append('line')
          .attr('stroke-width', 1)
          .attr('stroke', scaleColor)
          .attr('x1', -10)
          .attr('y1', 0)
          .attr('x2', 0)
          .attr('y2', 0)
          .attr('transform', 'translate(-' + (scaleRadius + 10) + ',0)');
      }

      /**
       * 创建轨道,就是仪表盘主体
       *
       * @param {any} dom 操作区域
       */
      function createOrbitOut(dom) {
        var arc = d3.arc()
          .outerRadius(outerRadiusOut)
          .innerRadius(innerRadiusOut)
          .cornerRadius(cornerRadiusOut);

        dom.append('path')
          .datum({
            startAngle: startAngleOut,
            endAngle: endAngleOut
          })
          .style('fill', orbitBackgroundColorOut)
          .attr('d', arc);

        dom.selectAll('path.arc')
          .data(d3.range(startAngleOut, endAngleOut, (endAngleOut - startAngleOut) / n))
          .enter()
          .append('path')
          .attr('class', 'arc')
          .style('fill', function (d, i) {
            return d3.hsl(280 + d * 360 / tau, 1, .5);
          })
          .transition()
          .duration(transitonTime)
          .attrTween('d', function (d) {
            var start = {
              startAngle: startAngleOut,
              endAngle: startAngleOut
            };
            var end = {
              startAngle: d,
              endAngle: d + tau / n * 1.1
            };
            var interpolate = d3.interpolate(start, end);
            return function (t) {
              return arc(interpolate(t));
            };
          });

      }

      /**
       * 创建内轨
       *
       * @param {any} dom 操作区域
       */
      function ceateOrbitIn(dom) {
        var arc = d3.arc()
          .outerRadius(outerRadiusIn)
          .innerRadius(innerRadiusIn)
          .startAngle(startAngleIn)
          .cornerRadius(cornerRadiusIn);

        dom.append('path')
          .attr('class', 'in-arc')
          .datum({
            endAngle: startAngleIn
          })
          .style('fill', orbitColorIn)
          .attr('d', arc)
          .transition()
          .duration(transitonTime)
          .attrTween('d', arcTween(endAngleIn));

        var x2 = Math.sin(scaleOrbitIn(centerTextValue)) * outerRadiusIn;
        var y2 = Math.cos(scaleOrbitIn(centerTextValue)) * outerRadiusIn;

        // 原三角形太小
        var defs = dom.append('defs');
        var arrowMarker = defs.append('marker')
          .attr('id', 'marker-arrow-big')
          .attr('markerUnits', 'strokeWidth')
          .attr('markerWidth', '18')
          .attr('markerHeight', '18')
          .attr('refX', '0')
          .attr('refY', '7')
          .attr('orient', 'auto');
        var arrow_path = 'M0,0 L0,14 L16,7 z';
        arrowMarker.append('path')
          .attr('d', arrow_path)
          .style('fill', 'red');

        dom.append('line')
          .attr('stroke-with', 0)
          .attr('stroke', 'none')
          // .attr('x1', 0)
          // .attr('y1', 0)
          // .attr('x2', -innerRadiusIn)
          // .attr('y2', 0)
          // .attr('marker-end', 'url(#marker-arrow-big)')
          // .transition()
          // .duration(transitonTime)
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', x2)
          .attr('y2', -y2)
          .attr('marker-end', 'url(#marker-arrow-big)');

        function arcTween(newAngle) {
          return function (d) {
            var interpolate = d3.interpolate(d.endAngle, newAngle);
            return function (t) {
              d.endAngle = interpolate(t);
              return arc(d);
            }
          }
        }

      }

      /**
       * 创建中心区域图
       *
       * @param {any} dom 操作区域
       */
      function createCenterArea(dom) {
        var textArea = dom.append('g')
          .attr('class', 'center-text');

        var lineFirst = textArea.append('g');
        var lineSecond = textArea.append('g');

        lineFirst.append('text')
          .attr('class', 'center-text-value')
          .attr('x', centerTextValueX)
          .attr('y', centerTextValueY)
          .style('fill', centerTextValueColor)
          .style('font-size', centerTextValueFontSize)
          .style('text-anchor', centerTextValueTextAnchor)
          .text(formatPost(centerTextValue));
        lineFirst.append('g')
          .append('line')
          .attr('stroke-width', centerArrowLineStrokeWidth)
          .attr('stroke', centerArrowLineStroke)
          .attr('x1', centerArrowLineX1)
          .attr('y1', centerArrowLineY1)
          .attr('x2', centerArrowLineX2)
          .attr('y2', centerArrowLineY2)
          .attr('marker-end', 'url(#marker-arrow)');

        lineSecond.append('text')
          .attr('class', 'center-text-title')
          .attr('x', centerTextTitleX)
          .attr('y', centerTextTitleY)
          .style('fill', centerTextTitleColor)
          .style('font-size', centerTextTitleFontSize)
          .style('text-anchor', centerTextTitleTextAnchor)
          .text(centerTextTitle);
      }

      /**
       * 创建三角形(该三角形大小为4*4，如有特殊要求，请重绘制。)
       *
       * @param {any} dom 操作区域
       */
      function createArrow(dom, params) {
        var defs = dom.append('defs');
        var arrowMarker = defs.append('marker')
          .attr('id', 'marker-arrow')
          .attr('markerUnits', 'strokeWidth')
          .attr('markerWidth', '4')
          .attr('markerHeight', '4')
          .attr('refX', '0')
          .attr('refY', '1.5')
          .attr('orient', 'auto');
        var arrow_path = 'M0,0 L0,3 L4,1.5 z';
        arrowMarker.append('path')
          .attr('d', arrow_path)
          .style('fill', 'red');
      }

    });
  }

  // Getter/setter function
  chart.width = function (_) {
    if (!arguments.length) {
      return width;
    }
    width = _;
    return chart;
  };
  chart.height = function (_) {
    if (!arguments.length) {
      return height;
    }
    height = _;
    return chart;
  };
  chart.backgroundColor = function (_) {
    if (!arguments.length) {
      return backgroundColor;
    }
    backgroundColor = _;
    return chart;
  };
  chart.transitonTime = function (_) {
    if (!arguments.length) {
      return transitonTime;
    }
    transitonTime = _;
    return chart;
  };
  chart.centerTextValue = function (_) {
    if (!arguments.length) {
      return centerTextValue;
    }
    centerTextValue = _;
    return chart;
  };
  chart.centerTextValueFontSize = function (_) {
    if (!arguments.length) {
      return centerTextValueFontSize;
    }
    centerTextValueFontSize = _;
    return chart;
  };
  chart.centerTextValueColor = function (_) {
    if (!arguments.length) {
      return centerTextValueColor;
    }
    centerTextValueColor = _;
    return chart;
  };
  chart.centerTextValueTextAnchor = function (_) {
    if (!arguments.length) {
      return centerTextValueTextAnchor;
    }
    centerTextValueTextAnchor = _;
    return chart;
  };
  chart.centerTextValueX = function (_) {
    if (!arguments.length) {
      return centerTextValueX;
    }
    centerTextValueX = _;
    return chart;
  };
  chart.centerTextValueY = function (_) {
    if (!arguments.length) {
      return centerTextValueY;
    }
    centerTextValueY = _;
    return chart;
  };
  chart.centerArrowLineStrokeWidth = function (_) {
    if (!arguments.length) {
      return centerArrowLineStrokeWidth;
    }
    centerArrowLineStrokeWidth = _;
    return chart;
  };
  chart.centerArrowLineStroke = function (_) {
    if (!arguments.length) {
      return centerArrowLineStroke;
    }
    centerArrowLineStroke = _;
    return chart;
  };
  chart.centerArrowLineX1 = function (_) {
    if (!arguments.length) {
      return centerArrowLineX1;
    }
    centerArrowLineX1 = _;
    return chart;
  };
  chart.centerArrowLineY1 = function (_) {
    if (!arguments.length) {
      return widcenterArrowLineY1th;
    }
    centerArrowLineY1 = _;
    return chart;
  };
  chart.centerArrowLineX2 = function (_) {
    if (!arguments.length) {
      return centerArrowLineX2;
    }
    centerArrowLineX2 = _;
    return chart;
  };
  chart.centerArrowLineY2 = function (_) {
    if (!arguments.length) {
      return centerArrowLineY2;
    }
    centerArrowLineY2 = _;
    return chart;
  };
  chart.centerTextTitle = function (_) {
    if (!arguments.length) {
      return centerTextTitle;
    }
    centerTextTitle = _;
    return chart;
  };
  chart.centerTextTitleFontSize = function (_) {
    if (!arguments.length) {
      return centerTextTitleFontSize;
    }
    centerTextTitleFontSize = _;
    return chart;
  };
  chart.centerTextTitleColor = function (_) {
    if (!arguments.length) {
      return centerTextTitleColor;
    }
    centerTextTitleColor = _;
    return chart;
  };
  chart.centerTextTitleTextAnchor = function (_) {
    if (!arguments.length) {
      return centerTextTitleTextAnchor;
    }
    centerTextTitleTextAnchor = _;
    return chart;
  };
  chart.centerTextTitleX = function (_) {
    if (!arguments.length) {
      return centerTextTitleX;
    }
    centerTextTitleX = _;
    return chart;
  };
  chart.centerTextTitleY = function (_) {
    if (!arguments.length) {
      return centerTextTitleY;
    }
    centerTextTitleY = _;
    return chart;
  };
  chart.outerRadiusIn = function (_) {
    if (!arguments.length) {
      return outerRadiusIn;
    }
    outerRadiusIn = _;
    return chart;
  };
  chart.innerRadiusIn = function (_) {
    if (!arguments.length) {
      return innerRadiusIn;
    }
    innerRadiusIn = _;
    return chart;
  };
  chart.startAngleIn = function (_) {
    if (!arguments.length) {
      return startAngleIn;
    }
    startAngleIn = _;
    return chart;
  };
  chart.endAngleIn = function (_) {
    if (!arguments.length) {
      return endAngleIn;
    }
    endAngleIn = _;
    return chart;
  };
  chart.cornerRadiusIn = function (_) {
    if (!arguments.length) {
      return cornerRadiusIn;
    }
    cornerRadiusIn = _;
    return chart;
  };
  chart.orbitColorIn = function (_) {
    if (!arguments.length) {
      return orbitColorIn;
    }
    orbitColorIn = _;
    return chart;
  };
  chart.outerRadiusOut = function (_) {
    if (!arguments.length) {
      return outerRadiusOut;
    }
    outerRadiusOut = _;
    return chart;
  };
  chart.innerRadiusOut = function (_) {
    if (!arguments.length) {
      return innerRadiusOut;
    }
    innerRadiusOut = _;
    return chart;
  };
  chart.startAngleOut = function (_) {
    if (!arguments.length) {
      return startAngleOut;
    }
    startAngleOut = _;
    return chart;
  };
  chart.endAngleOut = function (_) {
    if (!arguments.length) {
      return endAngleOut;
    }
    endAngleOut = _;
    return chart;
  };
  chart.cornerRadiusOut = function (_) {
    if (!arguments.length) {
      return cornerRadiusOut;
    }
    cornerRadiusOut = _;
    return chart;
  };
  chart.orbitBackgroundColorOut = function (_) {
    if (!arguments.length) {
      return orbitBackgroundColorOut;
    }
    orbitBackgroundColorOut = _;
    return chart;
  };
  chart.orbitColorOut = function (_) {
    if (!arguments.length) {
      return orbitColorOut;
    }
    orbitColorOut = _;
    return chart;
  };
  chart.lightEffectImg = function (_) {
    if (!arguments.length) {
      return lightEffectImg;
    }
    lightEffectImg = _;
    return chart;
  };
  chart.lightEffectWidth = function (_) {
    if (!arguments.length) {
      return lightEffectWidth;
    }
    lightEffectWidth = _;
    return chart;
  };
  chart.lightEffectHeight = function (_) {
    if (!arguments.length) {
      return lightEffectHeight;
    }
    lightEffectHeight = _;
    return chart;
  };
  chart.scaleRadius = function (_) {
    if (!arguments.length) {
      return scaleRadius;
    }
    scaleRadius = _;
    return chart;
  };
  chart.scaleColor = function (_) {
    if (!arguments.length) {
      return scaleColor;
    }
    scaleColor = _;
    return chart;
  };
  chart.scaleTextColor = function (_) {
    if (!arguments.length) {
      return scaleTextColor;
    }
    scaleTextColor = _;
    return chart;
  };

  return chart;
};

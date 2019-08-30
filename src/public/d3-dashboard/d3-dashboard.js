// Uses Node, AMD or browser globals to create a module.

// If you want something that will work in other stricter CommonJS environments,
// or if you need to create a circular dependency, see commonJsStrict.js

// Defines a module 'returnExports' that depends another module called 'b'.
// Note that the name of the module is implied by the file name. It is best
// if the file name and the exported global have matching names.

// If the 'b' module also uses this type of boilerplate, then
// in the browser, it will create a global .b that is used below.

// If you do not want to support the browser global path, then you
// can remove the `root` use and the passing `this` as the first arg to
// the top function.

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['d3'], factory);
  } else if (typeof module === 'object' && module.chart) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.chart,
    // like Node.
    module.chart = factory(require('d3'));
  } else {
    // Browser globals (root is window)
    root.dashboard = factory(root.d3);
  }
}(typeof self !== 'undefined' ? self : this, function (d3) {
  // Use b in some fashion.
  console.log('d3 version:' + d3.version);

  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return function module() {
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
    var scaleOrbitIn;

    function chart(selection) {
      selection.each(function () {
        scaleOrbitIn = d3.scaleLinear()
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
      });
    }

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

    // setter getter
    chart.width = function (_) {
      return arguments.length ? (width = +_, chart) : width;
    };
    chart.height = function (_) {
      return arguments.length ? (height = +_, chart) : height;
    };
    chart.backgroundColor = function (_) {
      return arguments.length ? (backgroundColor = _, chart) : backgroundColor;
    };
    chart.transitonTime = function (_) {
      return arguments.length ? (transitonTime = _, chart) : transitonTime;
    };
    chart.centerTextValue = function (_) {
      return arguments.length ? (centerTextValue = _, chart) : centerTextValue;
    };
    chart.centerTextValueFontSize = function (_) {
      return arguments.length ? (centerTextValueFontSize = +_, chart) : centerTextValueFontSize;
    };
    chart.centerTextValueColor = function (_) {
      return arguments.length ? (centerTextValueColor = _, chart) : centerTextTitleColor;
    };
    chart.centerTextValueTextAnchor = function (_) {
      return arguments.length ? (centerTextValueTextAnchor = _, chart) : centerTextValueTextAnchor;
    };
    chart.centerTextValueX = function (_) {
      return arguments.length ? (centerTextValueX = +_, chart) : centerTextValueX;
    };
    chart.centerTextValueY = function (_) {
      return arguments.length ? (centerTextValueY = +_, chart) : centerTextValueY;
    };
    chart.centerArrowLineStrokeWidth = function (_) {
      return arguments.length ? (centerArrowLineStrokeWidth = +_, chart) : centerArrowLineStrokeWidth;
    };
    chart.centerArrowLineStroke = function (_) {
      return arguments.length ? (centerArrowLineStroke = _, chart) : centerArrowLineStroke;
    };
    chart.centerArrowLineX1 = function (_) {
      return arguments.length ? (centerArrowLineX1 = _, chart) : centerArrowLineX1;
    };
    chart.centerArrowLineY1 = function (_) {
      return arguments.length ? (centerArrowLineY1 = _, chart) : centerArrowLineY1;
    };
    chart.centerArrowLineX2 = function (_) {
      return arguments.length ? (centerArrowLineX2 = _, chart) : centerArrowLineX2;
    };
    chart.centerArrowLineY2 = function (_) {
      return arguments.length ? (centerArrowLineY2 = _, chart) : centerArrowLineY2;
    };
    chart.centerTextTitle = function (_) {
      return arguments.length ? (centerTextTitle = _, chart) : centerTextTitle;
    };
    chart.centerTextTitleFontSize = function (_) {
      return arguments.length ? (centerTextTitleFontSize = _, chart) : centerTextTitleFontSize;
    };
    chart.centerTextTitleColor = function (_) {
      return arguments.length ? (centerTextTitleColor = _, chart) : centerTextTitleColor;
    };
    chart.centerTextTitleTextAnchor = function (_) {
      return arguments.length ? (centerTextTitleTextAnchor = _, chart) : centerTextTitleTextAnchor;
    };
    chart.centerTextTitleX = function (_) {
      return arguments.length ? (centerTextTitleX = _, chart) : centerTextTitleX;
    };
    chart.centerTextTitleY = function (_) {
      return arguments.length ? (centerTextTitleY = _, chart) : centerTextTitleY;
    };
    chart.outerRadiusIn = function (_) {
      return arguments.length ? (outerRadiusIn = _, chart) : outerRadiusIn;
    };
    chart.innerRadiusIn = function (_) {
      return arguments.length ? (innerRadiusIn = _, chart) : innerRadiusIn;
    };
    chart.startAngleIn = function (_) {
      return arguments.length ? (startAngleIn = _, chart) : startAngleIn;
    };
    chart.endAngleIn = function (_) {
      return arguments.length ? (endAngleIn = _, chart) : endAngleIn;
    };
    chart.cornerRadiusIn = function (_) {
      return arguments.length ? (cornerRadiusIn = _, chart) : cornerRadiusIn;
    };
    chart.orbitColorIn = function (_) {
      return arguments.length ? (orbitColorIn = _, chart) : orbitColorIn;
    };
    chart.outerRadiusOut = function (_) {
      return arguments.length ? (outerRadiusOut = _, chart) : outerRadiusOut;
    };
    chart.innerRadiusOut = function (_) {
      return arguments.length ? (innerRadiusOut = _, chart) : innerRadiusOut;
    };
    chart.startAngleOut = function (_) {
      return arguments.length ? (startAngleOut = _, chart) : startAngleOut;
    };
    chart.endAngleOut = function (_) {
      return arguments.length ? (endAngleOut = _, chart) : endAngleOut;
    };
    chart.cornerRadiusOut = function (_) {
      return arguments.length ? (cornerRadiusOut = _, chart) : cornerRadiusOut;
    };
    chart.orbitBackgroundColorOut = function (_) {
      return arguments.length ? (orbitBackgroundColorOut = _, chart) : orbitBackgroundColorOut;
    };
    chart.orbitColorOut = function (_) {
      return arguments.length ? (orbitColorOut = _, chart) : orbitColorOut;
    };
    chart.lightEffectImg = function (_) {
      return arguments.length ? (lightEffectImg = _, chart) : lightEffectImg;
    };
    chart.lightEffectWidth = function (_) {
      return arguments.length ? (lightEffectWidth = _, chart) : lightEffectWidth;
    };
    chart.lightEffectHeight = function (_) {
      return arguments.length ? (lightEffectHeight = _, chart) : lightEffectHeight;
    };
    chart.scaleRadius = function (_) {
      return arguments.length ? (scaleRadius = _, chart) : scaleRadius;
    };
    chart.scaleColor = function (_) {
      return arguments.length ? (scaleColor = _, chart) : scaleColor;
    };
    chart.scaleTextColor = function (_) {
      return arguments.length ? (scaleTextColor = _, chart) : scaleTextColor;
    };

    return chart;
  }
}));

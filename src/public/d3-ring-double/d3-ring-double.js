/**
 * This is a pure D3.js ring-single inspired by the http://bl.ocks.org/clayzermk1/9142407, http://bl.ocks.org/mbostock/4063269 and http://bl.ocks.org/mbostock/45943c4af772e38b4f4e .
 */
// Uses Node, AMD or browser globals to create a module.

// If you want something that will work in other stricter CommonJS environments,
// or if you need to create a circular dependency, see commonJsStrict.js

// Defines a module "returnExports" that depends another module called "b".
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
    define(['d3', 'd3-tip'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('d3'), require('d3-tip'));
  } else {
    // Browser globals (root is window)
    root.ringDouble = factory(root.d3);
  }
}(typeof self !== 'undefined' ? self : this, function (d3) {
  // Use b in some fashion.
  console.log(d3.version);
  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return function module() {
    'use strict';
    // Public variables with default settings
    // 画布相关属性
    var backgroundColor = '#fff';
    // 数据
    var value;
    var link;

    var centerImgHeight = 60;
    var centerImgWidth = 60;
    var centerTxtOutSize = 12;
    var centerTextOutColor = '#fff';
    var centerTextDominantBaseline = 'text-before-edge';
    var centerTextAnchor = 'middle';

    var imgHeight = 30;
    var imgWidth = 30;
    var isClockwise = true;
    var orbitColor = ['#5185dd', '#4199ca'];
    var orbitWidth = 1;
    var trackBall = 12;
    var ballSize = [12, 24];
    var isEquant = true;
    var ballTextOutSize = 12;
    var ballTextOutColor = '#fff';
    var firstQuadrantDominantBaseline = 'text-before-edge';
    var firstQuadrantTextAnchor = 'end';
    var secondQuadrantDominantBaseline = 'text-after-edge';
    var secondQuadrantTextAnchor = 'end';
    var thirdQuadrantDominantBaseline = 'text-after-edge';
    var thirdQuadrantTextAnchor = 'start';
    var fourthQuadrantDominantBaseline = 'text-before-edge';
    var fourthQuadrantTextAnchor = 'start';
    var radiusIn = 150;
    var backgroundColorIn = '#132528';

    var isClockwiseOut = true;
    var orbitColorOut = ['#5185dd', '#4199ca'];
    var orbitWidthOut = 1;
    var trackBallOut = 12;
    var ballSizeOut = [12, 24];
    var isEquantOut = true;
    var ballTextOutSizeOut = 12;
    var ballTextOutColorOut = '#fff';
    var firstQuadrantDominantBaselineOut = 'text-before-edge';
    var firstQuadrantTextAnchorOut = 'end';
    var secondQuadrantDominantBaselineOut = 'text-after-edge';
    var secondQuadrantTextAnchorOut = 'end';
    var thirdQuadrantDominantBaselineOut = 'text-after-edge';
    var thirdQuadrantTextAnchorOut = 'start';
    var fourthQuadrantDominantBaselineOut = 'text-before-edge';
    var fourthQuadrantTextAnchorOut = 'start';
    var radiusOut = 300;
    var backgroundColorOut = '#141d1f';

    var lightEffectImg = '';
    var lightEffectWidth = 0;
    var lightEffectHeight = 0;

    var animateTime = 1000;

    // Private variables
    var centerValue = [];
    var valueOut = [];
    var valueIn = [];
    var linkOut = [];
    var linkIn = [];

    var a;
    var b;
    var c;
    var cosc;
    var hudu = 0;
    var X;
    var Y;
    var x;
    var y;
    var tip;

    function chart(selection) {
      selection.each(function () {
        // 计算页面的宽度和高度
        var scrollWidth = document.body.scrollWidth;
        var scrollHeight = document.body.scrollHeight;
        var maxRadius = d3.max([scrollHeight, scrollWidth]);
        // 内环和外环的颜色和其上小圆半径大小比例尺
        var orbitColorScaleIn = d3.scaleLinear()
          .domain([0, trackBall])
          .range([orbitColor[0], orbitColor[1]]);
        var ballSizeScaleIn = d3.scaleLinear()
          .domain([0, trackBall])
          .rangeRound([ballSize[1], ballSize[0]]);

        var orbitColorScaleOut = d3.scaleLinear()
          .domain([0, trackBallOut])
          .range([orbitColorOut[0], orbitColorOut[1]]);
        var ballSizeScaleOut = d3.scaleLinear()
          .domain([0, trackBallOut])
          .rangeRound([ballSizeOut[1], ballSizeOut[0]]);
        // 分离出合适的数据数组
        value.forEach(function (element, index) {
          if (element.mark == 0) {
            centerValue.push(element)
          } else if (element.mark == 1) {
            valueIn.push(element);
          } else if (element.mark == 2) {
            valueOut.push(element)
          }
        });

        // svg区域
        var svg = d3.select(this);
        var width = +svg.attr('width');
        var height = +svg.attr('height');
        // 操作区域
        var dom = svg.append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
        // 提示框
        tip = d3.tip()
          .attr('class', 'd3-tip')
          .html(function (d) {
            return '<p>' + d.name + '</p>';
          });
        dom.call(tip);
        // 箭头
        createArrow(dom);
        // 背景
        createBackground(dom, centerImgWidth / 2, radiusIn, backgroundColorIn, 1);
        d3.timeout(function () {
          createBackground(dom, radiusIn, radiusOut, backgroundColorOut, 2);
          dom.selectAll('.backgroundColorArc').sort(function (a, b) {
            return 1;
          });
        }, animateTime);
        d3.timeout(function () {
          createBackground(dom, radiusOut, maxRadius, backgroundColor, 3);
          dom.selectAll('.backgroundColorArc').sort(function (a, b) {
            return 1;
          });
        }, 2 * animateTime);
        // 中心区域图
        createRectArea(dom, 'sort-group', centerValue, centerTxtOutSize, centerTextOutColor);
        // 内外环轨道
        createOrbit(dom, radiusIn, orbitColorScaleIn, trackBall, orbitWidth, animateTime);
        createOrbit(dom, radiusOut, orbitColorScaleOut, trackBallOut, orbitWidthOut, 2 * animateTime);
        // 内外环轨道小圆
        if (value) {
          createCircle(dom, 'sort-group', valueIn, trackBall, radiusIn, 'node-in', 'nodeText-in', ballSizeScaleIn, ballTextOutSize, ballTextOutColor, animateTime);
          createCircle(dom, 'sort-group', valueOut, trackBallOut, radiusOut, 'node-out', 'nodeText-out', ballSizeScaleOut, ballTextOutSizeOut, ballTextOutColorOut, 2 * animateTime);
        }
        // 内外环轨道之间连接线
        createLine(dom, 'sort-group', 'sun', 'node-in', 'node-in-line', link, 30, 20);
        dom.selectAll('.sort-group').sort(function (a, b) {
          return 1;
        });
        d3.timeout(function () {
          createLine(dom, 'sort-group', 'node-in', 'node-out', 'node-out-line', link, 20, 20);
          dom.selectAll('.sort-group').sort(function (a, b) {
            return 1;
          });
        }, animateTime);

      });
    }

    /**
     * 创建连接线
     *
     * @param {any} dom 操作区域
     * @param {any} domcss 操作区域样式
     * @param {any} source 连接线起点
     * @param {any} target 连接线终点
     * @param {any} lineCss 连接线css
     * @param {any} value 可视化的数据
     * @param {any} sourceRadius 起点圆半径
     * @param {any} targetRadius 终点圆半径
     */
    function createLine(dom, domcss, source, target, lineCss, value, sourceRadius, targetRadius) {
      var domg = dom.append('g')
        .attr('class', domcss);
      domg.selectAll('g.' + lineCss)
        .data(value)
        .enter()
        .append('g')
        .attr('class', lineCss)
        .attr('id', function (d, i) {
          return lineCss + '_' + (i + 1);
        });
      domg.selectAll('g.' + lineCss)
        .data(value)
        .exit()
        .remove();
      var linkData = domg.selectAll('g.' + lineCss)
        .data(value);

      linkData.each(function (d, i) {
        var linkLine = d3.select(this).append('line')
          .attr('stroke-width', 1.5)
          .attr('stroke', d3.hsl(188, .85, .56, .3));
        var x1y1 = document.querySelector('#_' + d.source).getAttribute('transform').substr(10).replace(')', '').split(',');
        var x2y2 = document.querySelector('#_' + d.target).getAttribute('transform').substr(10).replace(')', '').split(',');
        var x1 = parseFloat(x1y1[0]);
        var y1 = parseFloat(x1y1[1]);
        var x2 = parseFloat(x2y2[0]);
        var y2 = parseFloat(x2y2[1]);
        var hypotenuse = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
        // 由于中心区域圆比较大，要调整半径。
        if (x2 == 0 && y2 == 0) { // 指向中心
          var offx1 = (x2 - x1) / hypotenuse * targetRadius;
          var offy1 = (y2 - y1) / hypotenuse * targetRadius;
          var offx2 = (x2 - x1) / hypotenuse * sourceRadius;
          var offy2 = (y2 - y1) / hypotenuse * sourceRadius;
        } else {
          var offx1 = (x2 - x1) / hypotenuse * sourceRadius;
          var offy1 = (y2 - y1) / hypotenuse * sourceRadius;
          var offx2 = (x2 - x1) / hypotenuse * targetRadius;
          var offy2 = (y2 - y1) / hypotenuse * targetRadius;
        }
        var x1out = parseFloat(x1) + offx1;
        var y1out = parseFloat(y1) + offy1;
        var x2out = parseFloat(x2) - offx2;
        var y2out = parseFloat(y2) - offy2;

        var hudu = Math.atan2((y2 - y1), (x2 - x1));
        var jiaodu = hudu * 180 / Math.PI;

        linkLine
          .attr('x1', x1out)
          .attr('y1', y1out)
          .attr('x2', x1out)
          .attr('y2', y1out)
          .attr('marker-end', 'url(#arrow)')
          .transition()
          .ease(d3.easePoly.exponent(2))
          .duration(animateTime)
          .attr('x1', x1out)
          .attr('y1', y1out)
          .attr('x2', x2out)
          .attr('y2', y2out);

        var svg_mark = domg
          .append('g')
          .attr('transform', 'rotate(' + (jiaodu + 180) + ')');
        svg_mark
          .append('image')
          .attr('xlink:href', lightEffectImg)
          .attr('transform', 'translate(' + (-lightEffectWidth / 2) + ',' + (-lightEffectHeight / 2) + ')');
        svg_mark.append('animateMotion')
          .attr('path', function (d) {
            return 'M' + x1out + ',' + y1out + 'L' + x2out + ',' + y2out;
          })
          .attr('dur', '2s')
          .attr('begin', '0s')
          .attr('repeatCount', 'indefinite');
        svg_mark.append('animate')
          .attr('attributeName', 'opacity')
          .attr('values', '0;1;0')
          .attr('dur', '2s')
          .attr('begin', '0s')
          .attr('repeatCount', 'indefinite');
      });

    }

    /**
     * 创建圆
     *
     * @param {any} dom 操作区域
     * @param {any} domcss 操作区域样式
     * @param {any} value 可视化的数据
     * @param {any} ballSum 小圆数
     * @param {any} radius 小圆半径
     * @param {any} nodeClass 小圆css类
     * @param {any} nodeTextClass 小圆文字css类
     * @param {any} ballSizeScale 小圆大小
     * @param {any} fontSize 文字大小
     * @param {any} fontColor 文字颜色
     */
    function createCircle(dom, domcss, value, ballSum, radius, nodeClass, nodeTextClass, ballSizeScale, fontSize, fontColor, delay) {
      var halfBallSum = (value.length) / 2;
      var domg = dom.append('g')
        .attr('class', domcss);
      domg.selectAll('g.' + nodeClass)
        .data(value)
        .enter()
        .append('g')
        .attr('class', nodeClass)
        .attr('opacity', '0')
        .attr('id', function (d, i) {
          return '_' + d.id;
        })
        .transition()
        .ease(d3.easePoly.exponent(2))
        .duration(animateTime)
        .delay(delay)
        .attr('opacity', '1');

      domg.selectAll('g.' + nodeClass)
        .data(value)
        .exit()
        .remove();

      var nodeData = domg.selectAll('g.' + nodeClass)
        .data(value);

      nodeData.append('image')
        .attr('transform', 'translate(' + -imgWidth / 2 + ',' + -imgHeight / 2 + ')')
        .attr('width', imgWidth)
        .attr('height', imgHeight)
        .attr('xlink:href', function (d) {
          return d.img;
        });
      nodeData.append('text')
        .attr('class', nodeTextClass)
        .attr('x', 0)
        .attr('y', 0)
        .style('fill', fontColor)
        .style('font-size', function (d, i) {
          return fontSize;
        })
        .text(function (d) {
          // return d.name;
        });
      // nodeData.data().forEach(function(element,index){
      // appendMultiText(nodeData, nodeTextClass, 'element.name1111111', 0, 0, radiusOut - radiusIn - 50, fontSize, fontColor, 'simsun');
      // });
      nodeData.each(function (d, i) {
        if (isEquant) {
          hudu = (i + 0) * (2 * Math.PI / ballSum);
        } else {
          if (i == 0) {
            d3.select(this).attr('transform', 'translate(' + 0 + ',' + -(radius + ballSizeScale(i)) + ')');
          } else {
            a = radius + ballSizeScale(i);
            b = radius + ballSizeScale(i + 1);
            c = ballSizeScale(i) + ballSizeScale(i + 1);
            cosc = (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b);
            hudu += Math.acos(cosc);
          }
        }

        X = Math.sin(isClockwise ? hudu : (2 * Math.PI - hudu)) * (radius);
        Y = Math.cos(isClockwise ? hudu : (2 * Math.PI - hudu)) * (radius);
        d3.select(this).attr('transform', 'translate(' + X + ',' + -Y + ')');

        x = Math.sin(isClockwise ? (2 * Math.PI - hudu) : hudu) * ballSizeScale(i) / 2;
        y = Math.cos(isClockwise ? (2 * Math.PI - hudu) : hudu) * ballSizeScale(i) / 2;
        var nodeTextOut = d3.select(this)
          .select('text.' + nodeTextClass);
        if (i <= 3) {
          nodeTextOut.attr('transform', 'translate(' + -x + ',' + -(y + (3 - i) * 10) + ')');
        } else if (i > (halfBallSum - 2) && i <= (halfBallSum + 2)) {
          nodeTextOut.attr('transform', 'translate(' + -x + ',' + -(y + (halfBallSum - i) * 10) + ')');
        } else {
          nodeTextOut.attr('transform', 'translate(' + -x + ',' + -y + ')');
        }
        setTextOfcircle(nodeTextOut, isClockwise ? hudu : (2 * Math.PI - hudu));

        var old = d3.select(this).attr('transform');
        d3.select(this).on('mouseover', function (d) {
          d3.select(this)
            .transition()
            .ease(d3.easePoly.exponent(2))
            // .duration(animateTime)
            .attr('transform', old + ' scale(1.5,1.5)');

          tip.html(d.name + '<br />')
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY + 20) + 'px')
            .style('opacity', 1.0);
        }).on('mousemove', function (d) {
          d3.select(this)
            .transition()
            .ease(d3.easePoly.exponent(2))
            // .duration(animateTime)
            .attr('transform', old + ' scale(1.5,1.5)');

          tip.style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY + 20) + 'px');
        }).on('mouseout', function (d) {
          d3.select(this)
            .transition()
            .ease(d3.easePoly.exponent(2))
            // .duration(animateTime)
            .attr('transform', old);

          tip.style('opacity', 0.0);
        })

      });

      /**
       * 小圆文字布局
       *
       * @param {any} dom 操作区域
       * @param {any} hudu 圆的弧度
       */
      function setTextOfcircle(dom, hudu) {
        // 四象限设置
        if (hudu > 0 && hudu < Math.PI * .5) {
          execTextOfcircleLayout(dom, firstQuadrantDominantBaseline, firstQuadrantTextAnchor);
        } else if (hudu < Math.PI * 1) {
          execTextOfcircleLayout(dom, secondQuadrantDominantBaseline, secondQuadrantTextAnchor);
        } else if (hudu < Math.PI * 1.5) {
          execTextOfcircleLayout(dom, thirdQuadrantDominantBaseline, thirdQuadrantTextAnchor);
        } else {
          execTextOfcircleLayout(dom, fourthQuadrantDominantBaseline, fourthQuadrantTextAnchor);
        }
        // 对特殊角度进行单独设置
        if (hudu == 0 || hudu == 2 * Math.PI) {
          execTextOfcircleLayout(dom, 'text-before-edge', 'start');
        } else if (hudu == Math.PI * .5) {
          execTextOfcircleLayout(dom, 'text-before-edge', 'start');
        } else if (hudu == Math.PI * 1) {
          execTextOfcircleLayout(dom, 'text-after-edge', 'middle');
        } else if (hudu == Math.PI * 1.5) {
          execTextOfcircleLayout(dom, 'text-after-edge', 'end');
        }
      }

      /**
       * 小圆文字布局
       *
       * @param {any} dom  操作区域
       * @param {any} baseline 文字基线设置
       * @param {any} textAnchor 文字起止点设置
       */
      function execTextOfcircleLayout(dom, baseline, textAnchor) {
        dom.attr('dominant-baseline', baseline)
          .attr('text-anchor', textAnchor);
      }
    }

    /**
     * 创建轨道
     *
     * @param {any} dom 操作区域
     * @param {any} radius 内半径
     * @param {any} orbitCS 轨道颜色
     * @param {any} orbitNum 轨道等分
     * @param {any} orbitWidth 轨道宽度
     */
    function createOrbit(dom, radius, orbitCS, orbitNum, orbitWidth, delay) {
      for (var i = 0; i < 1; i++) {
        // for (var i = 0; i < orbitNum; i++) {
        dom.append('path')
          .attr('class', 'earthOrbitPosition')
          .attr('d', d3.arc().outerRadius(radius + orbitWidth / 2).innerRadius(radius - orbitWidth / 2).startAngle(0).endAngle(2 * Math.PI))
          // .attr('d', d3.arc().outerRadius(radius + orbitWidth / 2).innerRadius(radius - orbitWidth / 2).startAngle(2 * Math.PI * i / orbitNum).endAngle(2 * Math.PI * (i + 1) / orbitNum))
          .style('fill', orbitCS(i))
          .attr('opacity', '0')
          .transition()
          .duration(animateTime)
          .delay(delay)
          .attr('opacity', '1');
      }
    }

    /**
     * 创建中心区域图
     *
     * @param {any} dom 操作区域
     * @param {any} domcss 操作区域样式
     * @param {any} value 可视化的数据
     * @param {any} fontSize 字体大小
     * @param {any} fontColor 字体颜色
     */
    function createRectArea(dom, domcss, value, fontSize, fontColor) {
      dom.selectAll('g.sun')
        .data(value)
        .enter()
        .append('g')
        .attr('class', 'sun ' + domcss)
        .attr('id', function (d, i) {
          return '_' + i;
        })
        .attr('transform', 'translate(0,0)');

      dom.select('g.sun')
        .data(value)
        .exit()
        .remove();

      var nodeData = dom.select('g.sun')
        .data(value);

      nodeData.append('image')
        .attr('transform', 'translate(' + -centerImgWidth / 2 + ',' + -centerImgHeight / 2 + ')')
        .attr('width', centerImgWidth)
        .attr('height', centerImgHeight)
        .attr('xlink:href', function (d) {
          return d.img;
        });
      nodeData.append('text')
        .attr('class', 'sun_text')
        .attr('x', 0)
        .attr('y', centerImgHeight / 2 + 10)
        .attr('text-anchor', centerTextAnchor)
        .style('fill', fontColor)
        .style('font-size', function (d, i) {
          return fontSize;
        })
        .text(function (d) {
          return d.name;
        });
    }

    /**
     * 创建背景色
     *
     * @param {any} dom 操作区域
     * @param {any} innerRadius 内半径
     * @param {any} outerRadius 外半径
     * @param {any} bgColor 背景颜色
     * @param {any} zindex 背景ID
     */
    function createBackground(dom, innerRadius, outerRadius, bgColor, zindex) {
      dom.append('path')
        .attr('id', zindex)
        .attr('class', 'backgroundColorArc')
        .attr('fill', bgColor)
        .attr('d', d3.arc()({
          innerRadius: innerRadius,
          outerRadius: innerRadius,
          startAngle: 0,
          endAngle: 2 * Math.PI
        }))
        .transition()
        .duration(animateTime)
        .attr('d', d3.arc()({
          innerRadius: innerRadius,
          outerRadius: outerRadius,
          startAngle: 0,
          endAngle: 2 * Math.PI
        }))
        .style('fill', bgColor);
    }

    /**
     * 创建箭头
     *
     * @param {any} dom 操作区域
     */
    function createArrow(dom) {
      var defs = dom.append('defs');
      var arrowMarker = defs.append('marker')
        .attr('id', 'arrow')
        .attr('markerUnits', 'strokeWidth')
        .attr('markerWidth', '142')
        .attr('markerHeight', '12')
        .attr('viewBox', '0 0 12 12')
        .attr('refX', '6')
        .attr('refY', '6')
        .attr('orient', 'auto');
      var arrow_path = 'M2,2 L10,6 L2,10 L6,6 L2,2';
      arrowMarker.append('path')
        .attr('d', arrow_path)
        .attr('fill', d3.hsl(188, .85, .56, .3));
    }

    /**
     * 文本自动换行
     *
     * @param {any} dom 文本的容器
     * @param {any} domcss 文本的容器的样式名称
     * @param {any} str 字符串
     * @param {any} posX 文本的x坐标
     * @param {any} posY 文本的y坐标
     * @param {any} width 每一行的宽度，单位为像素
     * @param {any} fontsize 文字的大小
     * @param {any} fontcolor 文字的颜色
     * @param {any} fontfamily 文字的字体
     * @returns
     */
    function appendMultiText(dom, domcss, str, posX, posY, width, fontsize, fontcolor, fontfamily) {
      var strs = splitByLine(str, width, fontsize);

      var mulText = dom.append('text')
        .attr('class', domcss)
        .attr('x', posX)
        .attr('y', posY)
        .style('fill', fontcolor)
        .style('font-size', fontsize)
        .style('font-family', fontfamily);

      mulText.selectAll('tspan')
        .data(strs)
        .enter()
        .append('tspan')
        .attr('x', mulText.attr('x'))
        .attr('dy', '1em')
        .text(function (d) {
          return d;
        });

      return mulText;

      function splitByLine(str, max, fontsize) {
        var curLen = 0;
        var result = [];
        var start = 0,
          end = 0;
        for (var i = 0; i < str.length; i++) {
          var code = str.charCodeAt(i);
          var pixelLen = code > 255 ? fontsize : fontsize / 2;
          curLen += pixelLen;
          if (curLen > max) {
            end = i;
            result.push(str.substring(start, end));
            start = i;
            curLen = pixelLen;
          }
          if (i === str.length - 1) {
            end = i;
            result.push(str.substring(start, end + 1));
          }
        }
        return result;
      }

    }

    // Getter/setter function
    chart.backgroundColor = function (_) {
      return arguments.length ? (backgroundColor = _, chart) : backgroundColor;
    };
    chart.value = function (_) {
      return arguments.length ? (value = _, chart) : value;
    };
    chart.link = function (_) {
      return arguments.length ? (link = _, chart) : link;
    };
    chart.centerImgWidth = function (_) {
      return arguments.length ? (centerImgWidth = _, chart) : centerImgWidth;
    };
    chart.centerImgHeight = function (_) {
      return arguments.length ? (centerImgHeight = _, chart) : centerImgHeight;
    };
    chart.centerTxtOutSize = function (_) {
      return arguments.length ? (centerTxtOutSize = _, chart) : centerTxtOutSize;
    };
    chart.centerTextOutColor = function (_) {
      return arguments.length ? (centerTextOutColor = _, chart) : centerTextOutColor;
    };
    chart.centerTextDominantBaseline = function (_) {
      return arguments.length ? (centerTextDominantBaseline = _, chart) : centerTextDominantBaseline;
    };
    chart.centerTextAnchor = function (_) {
      return arguments.length ? (centerTextAnchor = _, chart) : centerTextAnchor;
    };
    chart.imgWidth = function (_) {
      return arguments.length ? (imgWidth = _, chart) : imgWidth;
    };
    chart.imgHeight = function (_) {
      return arguments.length ? (imgHeight = _, chart) : imgHeight;
    };
    chart.isClockwise = function (_) {
      return arguments.length ? (isClockwise = _, chart) : isClockwise;
    };
    chart.orbitColor = function (_) {
      return arguments.length ? (orbitColor = _, chart) : orbitColor;
    };
    chart.orbitWidth = function (_) {
      return arguments.length ? (orbitWidth = _, chart) : orbitWidth;
    };
    chart.trackBall = function (_) {
      return arguments.length ? (trackBall = _, chart) : trackBall;
    };
    chart.ballSize = function (_) {
      return arguments.length ? (ballSize = _, chart) : ballSize;
    };
    chart.isEquant = function (_) {
      return arguments.length ? (isEquant = _, chart) : isEquant;
    };
    chart.ballTextOutSize = function (_) {
      return arguments.length ? (ballTextOutSize = _, chart) : ballTextOutSize;
    };
    chart.ballTextOutColor = function (_) {
      return arguments.length ? (ballTextOutColor = _, chart) : ballTextOutColor;
    };
    chart.firstQuadrantDominantBaseline = function (_) {
      return arguments.length ? (firstQuadrantDominantBaseline = _, chart) : firstQuadrantDominantBaseline;
    };
    chart.firstQuadrantTextAnchor = function (_) {
      return arguments.length ? (firstQuadrantTextAnchor = _, chart) : firstQuadrantTextAnchor;
    };
    chart.secondQuadrantDominantBaseline = function (_) {
      return arguments.length ? (secondQuadrantDominantBaseline = _, chart) : secondQuadrantDominantBaseline;
    };
    chart.secondQuadrantTextAnchor = function (_) {
      return arguments.length ? (secondQuadrantTextAnchor = _, chart) : secondQuadrantTextAnchor;
    };
    chart.thirdQuadrantDominantBaseline = function (_) {
      return arguments.length ? (thirdQuadrantDominantBaseline = _, chart) : thirdQuadrantDominantBaseline;
    };
    chart.thirdQuadrantTextAnchor = function (_) {
      return arguments.length ? (thirdQuadrantTextAnchor = _, chart) : thirdQuadrantTextAnchor;
    };
    chart.fourthQuadrantDominantBaseline = function (_) {
      return arguments.length ? (fourthQuadrantDominantBaseline = _, chart) : fourthQuadrantDominantBaseline;
    };
    chart.fourthQuadrantTextAnchor = function (_) {
      return arguments.length ? (fourthQuadrantTextAnchor = _, chart) : fourthQuadrantTextAnchor;
    };
    chart.radiusIn = function (_) {
      return arguments.length ? (radiusIn = _, chart) : radiusIn;
    };
    chart.backgroundColorIn = function (_) {
      return arguments.length ? (backgroundColorIn = _, chart) : backgroundColorIn;
    };
    chart.isClockwiseOut = function (_) {
      return arguments.length ? (isClockwiseOut = _, chart) : isClockwiseOut;
    };
    chart.orbitColorOut = function (_) {
      return arguments.length ? (orbitColorOut = _, chart) : orbitColorOut;
    };
    chart.orbitWidthOut = function (_) {
      return arguments.length ? (orbitWidthOut = _, chart) : orbitWidthOut;
    };
    chart.trackBallOut = function (_) {
      return arguments.length ? (trackBallOut = _, chart) : trackBallOut;
    };
    chart.ballSizeOut = function (_) {
      return arguments.length ? (ballSizeOut = _, chart) : ballSizeOut;
    };
    chart.isEquantOut = function (_) {
      return arguments.length ? (isEquantOut = _, chart) : isEquantOut;
    };
    chart.ballTextOutSizeOut = function (_) {
      return arguments.length ? (ballTextOutSizeOut = _, chart) : ballTextOutSizeOut;
    };
    chart.ballTextOutColorOut = function (_) {
      return arguments.length ? (ballTextOutColorOut = _, chart) : ballTextOutColorOut;
    };
    chart.firstQuadrantDominantBaselineOut = function (_) {
      return arguments.length ? (firstQuadrantDominantBaselineOut = _, chart) : firstQuadrantDominantBaselineOut;
    };
    chart.firstQuadrantTextAnchorOut = function (_) {
      return arguments.length ? (firstQuadrantTextAnchorOut = _, chart) : firstQuadrantTextAnchorOut;
    };
    chart.secondQuadrantDominantBaselineOut = function (_) {
      return arguments.length ? (secondQuadrantDominantBaselineOut = _, chart) : secondQuadrantDominantBaselineOut;
    };
    chart.secondQuadrantTextAnchorOut = function (_) {
      return arguments.length ? (secondQuadrantTextAnchorOut = _, chart) : secondQuadrantTextAnchorOut;
    };
    chart.thirdQuadrantDominantBaselineOut = function (_) {
      return arguments.length ? (thirdQuadrantDominantBaselineOut = _, chart) : thirdQuadrantDominantBaselineOut;
    };
    chart.thirdQuadrantTextAnchorOut = function (_) {
      return arguments.length ? (thirdQuadrantTextAnchorOut = _, chart) : thirdQuadrantTextAnchorOut;
    };
    chart.fourthQuadrantDominantBaselineOut = function (_) {
      return arguments.length ? (fourthQuadrantDominantBaselineOut = _, chart) : fourthQuadrantDominantBaselineOut;
    };
    chart.fourthQuadrantTextAnchorOut = function (_) {
      return arguments.length ? (fourthQuadrantTextAnchorOut = _, chart) : fourthQuadrantTextAnchorOut;
    };
    chart.radiusOut = function (_) {
      return arguments.length ? (radiusOut = _, chart) : radiusOut;
    };
    chart.backgroundColorOut = function (_) {
      return arguments.length ? (backgroundColorOut = _, chart) : backgroundColorOut;
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

    return chart;
  };
}));

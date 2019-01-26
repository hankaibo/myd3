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
    root.ringSingle = factory(root.d3);
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
    var data;
    // 轨道相关属性
    var isClockwise = true;
    var orbitColor = [];
    var orbitWidth = 1;
    var orbitStartAngle = 0;
    var orbitEndAngle = 2 * Math.PI;
    var transitionTime = 1000;
    // 小圆球相关属性
    var ballNum = 12;
    var ballSize = [12, 24];
    var isEquant = true;
    var ballTextOutSize = 12;
    var ballUseImg = false;
    var ballZoom = 2;
    // 小圆球文字相关属性
    var firstQuadrantDominantBaseline = 'text-before-edge';
    var firstQuadrantTextAnchor = 'end';
    var secondQuadrantDominantBaseline = 'text-after-edge';
    var secondQuadrantTextAnchor = 'end';
    var thirdQuadrantDominantBaseline = 'text-after-edge';
    var thirdQuadrantTextAnchor = 'start';
    var fourthQuadrantDominantBaseline = 'text-before-edge';
    var fourthQuadrantTextAnchor = 'start';
    // 轨道弧线文字相关属性
    var textPathArc = [2 * Math.PI * .75, 2 * Math.PI];
    var textAfterEdge = '';
    var textAfterEdgeColor = '#000';
    var textAfterEdgeSize = 24;
    var textAfterEdgeStartOffset = '0';
    var textAfterTextAnchor = 'start';
    var textAfterEdgeDominantBaseline = 'text-after-edge';
    var textBeforeEdge = '';
    var textBeforeEdgeColor = '#000';
    var textBeforeEdgeSize = 18;
    var textBeforeEdgeStartOffset = '0';
    var textBeforeTextAnchor = 'start';
    var textBeforeEdgeDominantBaseline = 'text-before-edge';

    // Private variables
    var radii;
    var orbitColorScale;
    var tip;
    // 弧度常量
    var PI = Math.PI;
    var tau = 2 * PI;
    var n = 500;
    // 轨道默认颜色是否使用彩虹色
    var orbitRainbow = true;
    //
    var a;
    var b;
    var c;
    var cosc;
    var hudu = 0;
    var X;
    var Y;
    var x;
    var y;

    function chart(selection) {
      selection.each(function () {
        var svg = d3.select(this);
        var width = +svg.attr('width');
        var height = +svg.attr('height');
        var radius = Math.min(width, height);
        radii = {
          'earthOrbit': radius / 3,
          'rectArea': Math.sqrt(Math.pow(radius * .8, 2) / 2)
        };
        // 提示框
        tip = d3.tip()
          .attr('class', 'd3-tip')
          .html(function (d) {
            return '<p>' + d.name + '</p>';
          });
        svg.call(tip);

        // 轨道颜色比例尺
        if (!orbitRainbow) {
          orbitColorScale = d3.scaleLinear()
            .domain([0, ballNum])
            .range([orbitColor[0], orbitColor[1]]);
        }
        // 操作区域
        var dom = svg.style('background-color', backgroundColor)
          .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
        // 中心区域
        createCenterArea(dom);
        // 轨道
        createOrbit(dom);
        // 创建圆
        createCircle(dom);
        // 创建文字
        createText(dom);
      });
    }

    /**
     * 创建文字
     *
     * @param {any} dom
     */
    function createText(dom) {
      // Current position of Text in its orbit
      var textOrbitPosition = d3.arc()
        .outerRadius(radii.earthOrbit + 1)
        .innerRadius(radii.earthOrbit - 1)
        .startAngle(textPathArc[0])
        .endAngle(textPathArc[1]);

      var circleText = dom.append('g')
        .attr('class', 'circleText');

      circleText.append('path')
        .attr('id', 'curve_' + Math.random())
        .attr('d', textOrbitPosition)
        .style('fill', 'none');
      circleText.append('text')
        .attr('id', 'curve-text-after')
        .style('font-size', textAfterEdgeSize)
        .attr('fill', textAfterEdgeColor)
        .append('textPath')
        .attr('xlink:href', '#' + circleText.select('path').attr('id'))
        .attr('text-anchor', textAfterTextAnchor)
        .attr('startOffset', textAfterEdgeStartOffset)
        .attr('dominant-baseline', textAfterEdgeDominantBaseline)
        .text(textAfterEdge);
      circleText.append('text')
        .attr('id', 'curve-text-before')
        .style('font-size', textBeforeEdgeSize)
        .style('fill', textBeforeEdgeColor)
        .append('textPath')
        .attr('xlink:href', '#' + circleText.select('path').attr('id'))
        .attr('text-anchor', textBeforeTextAnchor)
        .attr('startOffset', textBeforeEdgeStartOffset)
        .attr('dominant-baseline', textBeforeEdgeDominantBaseline)
        .text(textBeforeEdge);
    }

    /**
     * 创建圆
     *
     * @param {any} dom 操作区域
     */
    function createCircle(dom) {
      // 小圆球大小比例尺
      var ballSizeScale = d3.scaleLinear()
        .domain([0, ballNum])
        .rangeRound([ballSize[1], ballSize[0]]);
      dom.selectAll('g.node')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('id', function (d) {
          return 'g_circle_' + d.id
        });

      dom.selectAll('g.node')
        .data(data)
        .exit()
        .remove();

      var nodeData = dom.selectAll('g.node')
        .data(data)
        .attr('opacity', 0);

      if (ballUseImg) {
        nodeData.append('image')
          .attr('xlink:href', function (d) {
            return d.img;
          })
          .attr('x', function (d, i) {
            return -ballSizeScale(i);
          })
          .attr('y', function (d, i) {
            return -ballSizeScale(i);
          })
          .attr('height', function (d, i) {
            return ballSizeScale(i) * 2;
          })
          .attr('width', function (d, i) {
            return ballSizeScale(i) * 2;
          })
      } else {
        nodeData.append('circle')
          .attr('class', 'node-circle')
          .attr('id', function (d) {
            return d.id;
          })
          .attr('r', function (d, i) {
            return ballSizeScale(i);
          })
          .attr('fill', 'transparent');
        nodeData.append('clipPath')
          .attr('class', 'node-clipPath')
          .attr('id', function (d) {
            return 'clip-' + d.id;
          })
          .append('use')
          .attr('xlink:href', function (d) {
            return '#' + d.id;
          });
        nodeData.append('text')
          .attr('class', 'node-text-in')
          .attr('clip-path', function (d) {
            return 'url(#clip-' + d.id + ')';
          })
          .append('tspan')
          .attr('x', function (d, i) {
            return i < 9 ? (-ballSizeScale(i) * .25) : (-ballSizeScale(i) * .5)
          })
          .attr('y', function (d, i) {
            return ballSizeScale(i) * .25
          })
          .style('fill', 'white')
          .style('font-size', function (d, i) {
            return ballSizeScale(i) * .8;
          })
          .text(function (d, i) {
            return i + 1;
          });
      }
      nodeData.append('text')
        .attr('class', 'node-text-out')
        .attr('x', 0)
        .attr('y', 0)
        .style('fill', 'block')
        .style('font-size', function (d, i) {
          return ballTextOutSize;
        })
        .text(function (d) {
          return ballUseImg ? d.score : d.name;
        });

      let l = [];
      nodeData.each(function (d, i) {
        if (isEquant) {
          hudu = tau * (i / ballNum);
        } else {
          if (i === 0) {
            hudu = 0;
          } else {
            a = radii.earthOrbit + ballSizeScale(i);
            b = radii.earthOrbit + ballSizeScale(i + 1);
            c = ballSizeScale(i) + ballSizeScale(i + 1);
            cosc = (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b);
            hudu += Math.acos(cosc);
          }
        }

        if (!ballUseImg) {
          d3.select(this).select('.node-circle')
            .style('fill', function () {
              return orbitRainbow ? d3.hsl(hudu * 180 / PI, 1, .5) : orbitColorScale(i);
            });
        }

        // 移动圆（将圆移动到正确的位置）
        X = Math.sin(isClockwise ? hudu : (tau - hudu)) * (radii.earthOrbit + ballSizeScale(i));
        Y = Math.cos(isClockwise ? hudu : (tau - hudu)) * (radii.earthOrbit + ballSizeScale(i));
        l.push([X, Y]); // 保存大圆位置以便后面还原使用
        d3.select(this)
          .transition()
          .duration(transitionTime)
          .delay(i * 100)
          .attr('transform', 'translate(' + X + ',' + -Y + ')')
          .attr('opacity', 1);

        // 移动文字（调整圆外文字的位置）
        x = Math.sin(isClockwise ? (tau - hudu) : hudu) * ballSizeScale(i);
        y = Math.cos(isClockwise ? (tau - hudu) : hudu) * ballSizeScale(i);
        var nodeTextOut = d3.select(this)
          .select('text.node-text-out')
          .attr('transform', 'translate(' + x + ',' + y + ')');
        setTextOfcircle(nodeTextOut, isClockwise ? hudu : (tau - hudu));

        // 过渡效果
        d3.select(this)
          .on('mouseenter', function () {
            d3.select(this)
              .attr('class', 'node active')
              .transition()
              .duration(transitionTime)
              .attr('opacity', 1)
              .attr('transform', function () {
                return 'translate(' + l[i][0] + ',' + -l[i][1] + ') scale(' + ballZoom + ')'
              });

            d3.selectAll('g.node:not(.active)')
            // .attr('opacity', 1)
            // .transition()
            // .duration(transitionTime)
              .attr('opacity', 0.2);
          })
          .on('mouseleave', function () {
            d3.select(this)
              .attr('class', 'node')
              .transition()
              .duration(transitionTime)
              .attr('transform', function () {
                return 'translate(' + l[i][0] + ',' + -l[i][1] + ') scale(1)'
              });

            d3.selectAll('g.node:not(.active)')
            // .transition()
            // .duration(transitionTime)
              .attr('opacity', 1);
          });
        // 提示框效果
        d3.select(this)
          .on('mouseenter.tip', tip.show)
          .on('mouseleave.tip', tip.hide);
        // 事件
        d3.select(this).on('click', function (d) {
          dom.select('.sun')
            .attr('fill', function () {
              var defs = dom.append('defs')
                .attr('id', 'imgdefs');
              var catpattern = defs.append('pattern')
                .attr('id', 'catpattern' + d.id)
                .attr('height', 1)
                .attr('width', 1);
              catpattern.append('image')
                .attr('x', '0')
                .attr('y', '0')
                .attr('width', radii.rectArea)
                .attr('height', radii.rectArea)
                .attr('xlink:href', function () {
                  return d.img;
                });

              return 'url(#catpattern' + d.id + ')';
            });
        });
      });

      // 小圆文字布局
      function setTextOfcircle(dom, hudu) {
        // 四象限设置
        if (hudu > 0 && hudu < Math.PI * .5) {
          execTextOfcircleLayout(dom, firstQuadrantDominantBaseline, firstQuadrantTextAnchor);
        } else if (hudu < Math.PI) {
          execTextOfcircleLayout(dom, secondQuadrantDominantBaseline, secondQuadrantTextAnchor);
        } else if (hudu < Math.PI * 1.5) {
          execTextOfcircleLayout(dom, thirdQuadrantDominantBaseline, thirdQuadrantTextAnchor);
        } else {
          execTextOfcircleLayout(dom, fourthQuadrantDominantBaseline, fourthQuadrantTextAnchor);
        }
        // 对特殊角度进行单独设置
        if (hudu == 0 || hudu == tau) {
          execTextOfcircleLayout(dom, 'text-before-edge', 'middle');
        } else if (hudu == Math.PI * .5) {
          execTextOfcircleLayout(dom, 'central', 'end');
        } else if (hudu == Math.PI * 1) {
          execTextOfcircleLayout(dom, 'text-after-edge', 'middle');
        } else if (hudu == Math.PI * 1.5) {
          execTextOfcircleLayout(dom, 'central', 'start');
        }
      }

      // 小圆文字布局
      function execTextOfcircleLayout(dom, baseline, textAnchor) {
        dom.attr('dominant-baseline', baseline)
          .attr('text-anchor', textAnchor);
      }

    }

    /**
     * 创建轨道
     *
     * @param {any} dom 操作区域
     */
    function createOrbit(dom) {
      var arc = d3.arc()
        .outerRadius(radii.earthOrbit + orbitWidth / 2)
        .innerRadius(radii.earthOrbit - orbitWidth / 2);

      dom.selectAll('path')
        .data(d3.range(orbitStartAngle, orbitEndAngle, Math.abs(orbitEndAngle - orbitStartAngle) / n))
        .enter()
        .append('path')
        .attr('class', 'earthOrbitPosition')
        .style('fill', function (d, i) {
          return orbitRainbow ? d3.hsl(d * 360 / tau, 1, .5) : orbitColorScale ? orbitColorScale(i) : 'block';
        })
        .transition()
        .duration(transitionTime * data.length / 10)
        .attrTween('d', function (d) {
          var start = {
            startAngle: orbitStartAngle,
            endAngle: orbitStartAngle
          };
          var end = {
            startAngle: d,
            endAngle: d + Math.abs(orbitEndAngle - orbitStartAngle) / n * 1.1
          };
          var interpolate = d3.interpolate(start, end);
          return function (t) {
            return arc(interpolate(t))
          }
        });
    }

    /**
     * 创建中心区域图
     *
     * @param {any} dom 操作区域
     */
    function createCenterArea(dom) {
      dom.append('g')
        .append('circle')
        .attr('class', 'sun')
        .attr('r', radii.rectArea / 2)
        .attr('fill', 'transparent');
    }

    // Getter/setter function
    chart.backgroundColor = function (_) {
      return arguments.length ? (backgroundColor = _, chart) : backgroundColor;
    };
    chart.data = function (_) {
      return arguments.length ? (data = _, chart) : data;
    };
    chart.isClockwise = function (_) {
      return arguments.length ? (isClockwise = _, chart) : isClockwise;
    };
    chart.orbitColor = function (_) {
      if (!arguments.length) {
        return orbitColor;
      }
      if (Object.prototype.toString.call(_).slice(8, -1) === 'Array' && _.length > 1) {
        orbitColor = _;
        orbitRainbow = false;
      } else {
        orbitRainbow = true;
      }
      return chart;
    };
    chart.orbitWidth = function (_) {
      return arguments.length ? (orbitWidth = _, chart) : orbitWidth;
    };
    chart.orbitStartAngle = function (_) {
      return arguments.length ? (orbitStartAngle = _, chart) : orbitStartAngle;
    };
    chart.orbitEndAngle = function (_) {
      return arguments.length ? (orbitEndAngle = _, chart) : orbitEndAngle;
    };
    chart.transitionTime = function (_) {
      return arguments.length ? (transitionTime = _, chart) : transitionTime;
    };
    chart.ballNum = function (_) {
      return arguments.length ? (ballNum = _, chart) : ballNum;
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
    chart.ballUseImg = function (_) {
      return arguments.length ? (ballUseImg = _, chart) : ballUseImg;
    };
    chart.ballZoom = function (_) {
      return arguments.length ? (ballZoom = _, chart) : ballZoom;
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
    chart.textPathArc = function (_) {
      return arguments.length ? (textPathArc = _, chart) : textPathArc;
    };
    chart.textAfterEdge = function (_) {
      return arguments.length ? (textAfterEdge = _, chart) : textAfterEdge;
    };
    chart.textAfterEdgeColor = function (_) {
      return arguments.length ? (textAfterEdgeColor = _, chart) : textAfterEdgeColor;
    };
    chart.textAfterEdgeSize = function (_) {
      return arguments.length ? (textAfterEdgeSize = _, chart) : textAfterEdgeSize;
    };
    chart.textAfterEdgeStartOffset = function (_) {
      return arguments.length ? (textAfterEdgeStartOffset = _, chart) : textAfterEdgeStartOffset;
    };
    chart.textAfterTextAnchor = function (_) {
      return arguments.length ? (textAfterTextAnchor = _, chart) : textAfterTextAnchor;
    };
    chart.textAfterEdgeDominantBaseline = function (_) {
      return arguments.length ? (textAfterEdgeDominantBaseline = _, chart) : textAfterEdgeDominantBaseline;
    };
    chart.textBeforeEdge = function (_) {
      return arguments.length ? (textBeforeEdge = _, chart) : textBeforeEdge;
    };
    chart.textBeforeEdgeColor = function (_) {
      return arguments.length ? (textBeforeEdgeColor = _, chart) : textBeforeEdgeColor;
    };
    chart.textBeforeEdgeSize = function (_) {
      return arguments.length ? (textBeforeEdgeSize = _, chart) : textBeforeEdgeSize;
    };
    chart.textBeforeEdgeStartOffset = function (_) {
      return arguments.length ? (textBeforeEdgeStartOffset = _, chart) : textBeforeEdgeStartOffset;
    };
    chart.textBeforeTextAnchor = function (_) {
      return arguments.length ? (textBeforeTextAnchor = _, chart) : textBeforeTextAnchor;
    };
    chart.textBeforeEdgeDominantBaseline = function (_) {
      return arguments.length ? (textBeforeEdgeDominantBaseline = _, chart) : textBeforeEdgeDominantBaseline;
    };

    return chart;
  };
}));


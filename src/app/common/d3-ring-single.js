/**
 * This is a pure D3.js ring-single inspired by the http://bl.ocks.org/clayzermk1/9142407, http://bl.ocks.org/mbostock/4063269 and http://bl.ocks.org/mbostock/45943c4af772e38b4f4e .
 */
var d3 = require('d3');
var tip = require('d3-tip');
d3.tip = tip;
exports = module.exports = function () {
  'use strict';
  // Public variables with default settings
  // 画布相关属性
  var backgroundColor = '#fff';
  // 数据
  var value;
  // 轨道相关属性
  var isClockwise = true;
  var orbitColor = [];
  var orbitWidth = 1;
  var orbitStartAngle = 0;
  var orbitEndAngle = 2 * Math.PI;
  var transitonTime = 1000;
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
  var textBeforeEdgeStartOffset = '0'
  var textBeforeTextAnchor = 'start';
  var textBeforeEdgeDominantBaseline = 'text-before-edge';

  // Private variables
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
      var radii = {
        'earthOrbit': radius / 3,
        'rectArea': Math.sqrt(Math.pow(radius * .8, 2) / 2)
      };
      // 提示框
      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function (d) {
          return '<p>' + d.name + '</p>';
        });
      svg.call(tip);

      // 轨道颜色比例尺
      var orbitColorScale = d3.scaleLinear()
        .domain([0, ballNum])
        .range([orbitColor[0], orbitColor[1]]);
      // 小圆球大小比例尺
      var ballSizeScale = d3.scaleLinear()
        .domain([0, ballNum])
        .rangeRound([ballSize[1], ballSize[0]]);
      // Current position of Text in its orbit
      var textOrbitPosition = d3.arc()
        .outerRadius(radii.earthOrbit + 1)
        .innerRadius(radii.earthOrbit - 1)
        .startAngle(textPathArc[0])
        .endAngle(textPathArc[1]);

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

      /**
       * 创建文字
       *
       * @param {any} dom
       */
      function createText(dom) {
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
        dom.selectAll('g.node')
          .data(value)
          .enter()
          .append('g')
          .attr('class', 'node')
          .attr('id', function (d) {
            return 'g_circle_' + d.id
          });

        dom.selectAll('g.node')
          .data(value)
          .exit()
          .remove();

        var nodeData = dom.selectAll('g.node')
          .data(value);
        nodeData.append('circle')
          .attr('class', 'node-circle')
          .attr('id', function (d) {
            return d.id;
          })
          .attr('r', function (d, i) {
            return ballSizeScale(i);
          })
          .attr('fill', 'transparent');

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
            });
          nodeData.append('text')
            .attr('class', 'node-text-out')
            .attr('x', 0)
            .attr('y', 0)
            .style('fill', 'block')
            .style('font-size', function (d, i) {
              return ballTextOutSize;
            })
            .text(function (d) {
              return d.score;
            });
        } else {
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
          nodeData.append('text')
            .attr('class', 'node-text-out')
            .attr('x', 0)
            .attr('y', 0)
            .style('fill', 'block')
            .style('font-size', function (d, i) {
              return ballTextOutSize;
            })
            .text(function (d) {
              return d.name;
            });
        }

        nodeData.each(function (d, i) {
          // 过渡效果
          d3.select(this).on('mouseenter', function () {
              d3.select(this)
                .select('image')
                .transition()
                .attr('x', function (d) {
                  return -(d3.select(this).attr('width'));
                })
                .attr('y', function () {
                  return -(d3.select(this).attr('height'));
                })
                .attr('height', function () {
                  return d3.select(this).attr('height') * ballZoom;
                })
                .attr('width', function () {
                  return d3.select(this).attr('width') * ballZoom;
                });
              d3.select(this)
                .select('circle')
                .transition()
                .attr('r', function () {
                  return d3.select(this).attr('r') * ballZoom;
                });
            })
            .on('mouseleave', function () {
              d3.select(this)
                .select('image')
                .transition()
                .attr('x', function (d) {
                  return -ballSizeScale(i);
                })
                .attr('y', function (d) {
                  return -ballSizeScale(i);
                })
                .attr('height', function () {
                  return ballSizeScale(i) * 2;
                })
                .attr('width', function () {
                  return ballSizeScale(i) * 2;
                });
              d3.select(this)
                .select('circle')
                .transition()
                .attr('r', function () {
                  return ballSizeScale(i);
                });
            });
          // 提示框效果
          d3.select(this)
            .on('mouseenter.tip', tip.show)
            .on('mouseleave.tip', tip.hide);
          // 事件
          d3.select(this).on('click', function (d) {
            svg.select('.sun')
              .attr('fill', function () {
                var defs = svg.append('defs')
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
          })

          if (isEquant) {
            hudu = tau * (i / ballNum);
          } else {
            if (i == 0) {
              d3.select(this).attr('transform', 'translate(' + 0 + ',' + -(radii.earthOrbit + ballSizeScale(i)) + ')');
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

          X = Math.sin(isClockwise ? hudu : (tau - hudu)) * (radii.earthOrbit + ballSizeScale(i));
          Y = Math.cos(isClockwise ? hudu : (tau - hudu)) * (radii.earthOrbit + ballSizeScale(i));
          d3.select(this).attr('transform', 'translate(' + X + ',' + -Y + ')');
          x = Math.sin(isClockwise ? (tau - hudu) : hudu) * ballSizeScale(i);
          y = Math.cos(isClockwise ? (tau - hudu) : hudu) * ballSizeScale(i);
          var nodeTextOut = d3.select(this).select('text.node-text-out')
            .attr('transform', 'translate(' + x + ',' + y + ')');
          // setTextOfcircle(nodeTextOut, acos);
          setTextOfcircle(nodeTextOut, isClockwise ? hudu : (tau - hudu));
        });

        dom.selectAll('g.node').each(function (d, i) {
          d3.select(this).append('animate')
            .attr('attributeName', 'opacity')
            .attr('values', '1')
            // .attr('begin', 0)
            .attr('begin', function (d, i) {
              return i == 0 ? '0s' : d3.select(this).attr('id') + '.end'
            })
            .attr('dur', transitonTime / 1000)
            .attr('repeatCount', '1');
        });

        // 小圆文字布局
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

        var orbit = dom.selectAll('path')
          .data(d3.range(orbitStartAngle, orbitEndAngle, Math.abs(orbitEndAngle - orbitStartAngle) / n))
          .enter()
          .append('path')
          .attr('class', 'earthOrbitPosition')
          .style('fill', function (d, i) {
            return orbitRainbow ? d3.hsl(d * 360 / tau, 1, .5) : orbitColorScale(i);
          })
          .transition()
          .duration(transitonTime)
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

    });

  }

  // Getter/setter function
  chart.backgroundColor = function (_) {
    if (!arguments.length) {
      return backgroundColor;
    }
    backgroundColor = _;
    return chart;
  };
  chart.value = function (_) {
    if (!arguments.length) {
      return value;
    }
    value = _;
    return chart;
  };
  chart.isClockwise = function (_) {
    if (!arguments.length) {
      return isClockwise;
    }
    isClockwise = _;
    return chart;
  };
  chart.orbitColor = function (_) {
    if (!arguments.length) {
      return orbitColor;
    }
    orbitColor = _;
    orbitRainbow = false;
    return chart;
  };
  chart.orbitWidth = function (_) {
    if (!arguments.length) {
      return orbitWidth;
    }
    orbitWidth = _;
    return chart;
  };
  chart.orbitStartAngle = function (_) {
    if (!arguments.length) {
      return orbitStartAngle;
    }
    orbitStartAngle = _;
    return chart;
  };
  chart.orbitEndAngle = function (_) {
    if (!arguments.length) {
      return orbitEndAngle;
    }
    orbitEndAngle = _;
    return chart;
  };
  chart.transitonTime = function (_) {
    if (!arguments.length) {
      return transitonTime;
    }
    transitonTime = _;
    return chart;
  };
  chart.ballNum = function (_) {
    if (!arguments.length) {
      return ballNum;
    }
    ballNum = _;
    return chart;
  };
  chart.ballSize = function (_) {
    if (!arguments.length) {
      return ballSize;
    }
    ballSize = _;
    return chart;
  };
  chart.isEquant = function (_) {
    if (!arguments.length) {
      return isEquant;
    }
    isEquant = _;
    return chart;
  };
  chart.ballTextOutSize = function (_) {
    if (!arguments.length) {
      return ballTextOutSize;
    }
    ballTextOutSize = _;
    return chart;
  };
  chart.ballUseImg = function (_) {
    if (!arguments.length) {
      return ballUseImg;
    }
    ballUseImg = _;
    return chart;
  };
  chart.ballZoom = function (_) {
    if (!arguments.length) {
      return ballZoom;
    }
    ballZoom = _;
    return chart;
  };
  chart.firstQuadrantDominantBaseline = function (_) {
    if (!arguments.length) {
      return firstQuadrantDominantBaseline;
    }
    firstQuadrantDominantBaseline = _;
    return chart;
  }
  chart.firstQuadrantTextAnchor = function (_) {
    if (!arguments.length) {
      return firstQuadrantTextAnchor;
    }
    firstQuadrantTextAnchor = _;
    return chart;
  }
  chart.secondQuadrantDominantBaseline = function (_) {
    if (!arguments.length) {
      return secondQuadrantDominantBaseline;
    }
    secondQuadrantDominantBaseline = _;
    return chart;
  }
  chart.secondQuadrantTextAnchor = function (_) {
    if (!arguments.length) {
      return secondQuadrantTextAnchor;
    }
    secondQuadrantTextAnchor = _;
    return chart;
  }
  chart.thirdQuadrantDominantBaseline = function (_) {
    if (!arguments.length) {
      return thirdQuadrantDominantBaseline;
    }
    thirdQuadrantDominantBaseline = _;
    return chart;
  }
  chart.thirdQuadrantTextAnchor = function (_) {
    if (!arguments.length) {
      return thirdQuadrantTextAnchor;
    }
    thirdQuadrantTextAnchor = _;
    return chart;
  }
  chart.fourthQuadrantDominantBaseline = function (_) {
    if (!arguments.length) {
      return fourthQuadrantDominantBaseline;
    }
    fourthQuadrantDominantBaseline = _;
    return chart;
  }
  chart.fourthQuadrantTextAnchor = function (_) {
    if (!arguments.length) {
      return fourthQuadrantTextAnchor;
    }
    fourthQuadrantTextAnchor = _;
    return chart;
  }
  chart.textPathArc = function (_) {
    if (!arguments.length) {
      return textPathArc;
    }
    textPathArc = _;
    return chart;
  };
  chart.textAfterEdge = function (_) {
    if (!arguments.length) {
      return textAfterEdge;
    }
    textAfterEdge = _;
    return chart;
  };
  chart.textAfterEdgeColor = function (_) {
    if (!arguments.length) {
      return textAfterEdgeColor;
    }
    textAfterEdgeColor = _;
    return chart;
  };
  chart.textAfterEdgeSize = function (_) {
    if (!arguments.length) {
      return textAfterEdgeSize;
    }
    textAfterEdgeSize = _;
    return chart;
  };
  chart.textAfterEdgeStartOffset = function (_) {
    if (!arguments.length) {
      return textAfterEdgeStartOffset;
    }
    textAfterEdgeStartOffset = _;
    return chart;
  };
  chart.textAfterTextAnchor = function (_) {
    if (!arguments.length) {
      return textAfterTextAnchor;
    }
    textAfterTextAnchor = _;
    return chart;
  };
  chart.textAfterEdgeDominantBaseline = function (_) {
    if (!arguments.length) {
      return textAfterEdgeDominantBaseline;
    }
    textAfterEdgeDominantBaseline = _;
    return chart;
  };
  chart.textBeforeEdge = function (_) {
    if (!arguments.length) {
      return textBeforeEdge;
    }
    textBeforeEdge = _;
    return chart;
  };
  chart.textBeforeEdgeColor = function (_) {
    if (!arguments.length) {
      return textBeforeEdgeColor;
    }
    textBeforeEdgeColor = _;
    return chart;
  };
  chart.textBeforeEdgeSize = function (_) {
    if (!arguments.length) {
      return textBeforeEdgeSize;
    }
    textBeforeEdgeSize = _;
    return chart;
  };
  chart.textBeforeEdgeStartOffset = function (_) {
    if (!arguments.length) {
      return textBeforeEdgeStartOffset;
    }
    textBeforeEdgeStartOffset = _;
    return chart;
  };
  chart.textBeforeTextAnchor = function (_) {
    if (!arguments.length) {
      return textBeforeTextAnchor;
    }
    textBeforeTextAnchor = _;
    return chart;
  };
  chart.textBeforeEdgeDominantBaseline = function (_) {
    if (!arguments.length) {
      return textBeforeEdgeDominantBaseline;
    }
    textBeforeEdgeDominantBaseline = _;
    return chart;
  };

  return chart;
};

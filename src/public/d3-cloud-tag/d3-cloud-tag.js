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
    define(['d3'], factory);
  } else if (typeof module === 'object' && module.chart) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.chart,
    // like Node.
    module.chart = factory(require('d3'));
  } else {
    // Browser globals (root is window)
    root.cloudTag = factory(root.d3);
  }
}(typeof self !== 'undefined' ? self : this, function (d3) {
  // Use b in some fashion.
  console.log(d3.version);

  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return function module() {
    // 公有属性
    var entries = [];
    var width = 480;
    var height = 480;
    var radius = '65%';
    var radiusMin = 75;
    var bgDraw = true;
    var bgColor = '#000';
    var opacityOver = 1.00;
    var opacityOut = 0.05;
    var opacitySpeed = 6;
    var fov = 800;
    var speed = 2;
    var fontFamily = 'Arial; sans-serif';
    var fontSize = '15';
    var fontColor = '#fff';
    var fontWeight = 'normal';//bold
    var fontStyle = 'normal';//italic
    var fontStretch = 'normal';//wider; narrower; ultra-condensed; extra-condensed; condensed; semi-condensed; semi-expanded; expanded; extra-expanded; ultra-expanded
    var fontToUpperCase = false;
    var tooltipFontFamily = 'Arial; sans-serif';
    var tooltipFontSize = '15';
    var tooltipFontColor = '#fff';
    var tooltipFontWeight = 'normal';//bold
    var tooltipFontStyle = 'normal';//italic
    var tooltipFontStretch = 'normal';//wider; narrower; ultra-condensed; extra-condensed; condensed; semi-condensed; semi-expanded; expanded; extra-expanded; ultra-expanded
    var tooltipFontToUpperCase = false;
    var tooltipTextAnchor = 'left';
    var tooltipDiffX = 0;
    var tooltipDiffY = 20;
    // 私有属性
    var tooltip;
    var _radius;
    var diameter;
    var mouseReact = true;
    var mousePos = {x: 0, y: 0};
    var center2D;
    var center3D = {x: 0, y: 0, z: 0};
    var _speed = {x: 0, y: 0};
    var position = {sx: 0, cx: 0, sy: 0, cy: 0};
    var MATHPI180 = Math.PI / 180;
    var svg;

    function chart(selection) {
      selection.each(function () {
        var _this = this;

        function init() {
          svg = d3.select(_this)
            .on('mousemove', function () {
              console.log('mouseMoveHandler');
            });

          // rect
          svg.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height)
            .attr('fill', bgColor);
          // all a
          svg.selectAll('a')
            .data(coordsTransform(entries))
            .enter()
            .append('a')
            .attr('href', function (d, i) {
              return d.url;
            })
            .attr('target', function (d) {
              return d.target;
            })
            .on('mouseover', function () {
              console.log('高亮标签,mouseOverHandler')
            })
            .on('mouseout', function () {
              console.log('关闭高亮，mouseOutHandler');
            })
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('fill', fontColor)
            .attr('font-family', fontFamily)
            .attr('font-size', fontSize)
            .attr('font-weight', fontWeight)
            .attr('font-attr', fontStyle)
            .attr('font-stretch', fontStretch)
            .attr('text-anchor', 'middle')
            .text(function (d) {
              return fontToUpperCase ? d.label.toUpperCase() : d.label;
            });

          reInit();
          animloop();
        }

        function reInit() {
          var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
          var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

          var svgWidth = width;
          var svgHeight = height;

          if (windowWidth <= svgWidth) {
            svgWidth = windowWidth;
          }
          if (windowHeight <= svgHeight) {
            svgHeight = windowHeight;
          }

          center2D = {x: svgWidth / 2, y: svgHeight / 2};

          _speed.x = speed / center2D.x;
          _speed.y = speed / center2D.y;

          if (svgWidth >= svgHeight) {
            diameter = svgHeight / 100 * parseInt(radius);
          } else {
            diameter = svgWidth / 100 * parseInt(radius);
          }

          if (diameter < 1) {
            diameter = 1;
          }
          _radius = diameter / 2;

          if (_radius < radiusMin) {
            _radius = radiusMin;
            diameter = _radius * 2;
          }

          svg.attr('width', svgWidth)
            .attr('height', svgHeight);

          coordsUpdate(entries, _radius);
        }

        function render() {
          var fx = _speed.x * mousePos.x - speed;
          var fy = speed - _speed.y * mousePos.y;

          var angleX = fx * MATHPI180;
          var angleY = fy * MATHPI180;

          position.sx = Math.sin(angleX);
          position.cx = Math.cos(angleX);
          position.sy = Math.sin(angleY);
          position.cy = Math.cos(angleY);

          for (var i = 0, l = entries.length; i < l; i++) {
            var item = entries[i];

            if (mouseReact) {
              var rx = item.vectorPosition.x;
              var rz = item.vectorPosition.y * position.sy + item.vectorPosition.z * position.cy;

              item.vectorPosition.x = rx * position.cx + rz * position.sx;
              item.vectorPosition.y = item.vectorPosition.y * position.cy + item.vectorPosition.z * -position.sy;
              item.vectorPosition.z = rx * -position.sx + rz * position.cx;
            }

            var scale = fov / (fov + item.vectorPosition.z);

            item.vector2D.x = item.vectorPosition.x * scale + center2D.x;
            item.vector2D.y = item.vectorPosition.y * scale + center2D.y;

            svg.selectAll('text')
              .attr('x', function (d) {
                return d.vector2D.x;
              })
              .attr('y', function (d) {
                return d.vector2D.y;
              })
              .attr('opacity', function (d) {
                var opacity = d3.select(this);
                if (mouseReact) {
                  opacity = (_radius - d.vectorPosition.z) / diameter;
                  if (opacity < opacityOut) {
                    opacity = opacityOut;
                  }
                  return opacity;
                } else {
                  if (d.mouseOver) {
                    opacity += (opacityOver - opacity) / opacitySpeed;
                  } else {
                    opacity += (opacityOut - opacity) / opacitySpeed;
                  }
                  return opacity;
                }
              })
              .sort(function (a, b) {
                return (b.vectorPosition.z - a.vectorPosition.z);
              })
          }

        }

        window.requestAnimationFrame = (function () {
          return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
              window.setTimeout(callback, 1000 / 60);
            };
        })();

        function animloop() {
          requestAnimationFrame(animloop);
          render();
        }

        init();

        // private methods
        function coordsTransform(data) {
          for (var i = 1, l = data.length + 1; i < l; i++) {
            var phi = Math.acos(-1 + (2 * i) / l);
            var theta = Math.sqrt(l * Math.PI) * phi;
            var x = Math.cos(theta) * Math.sin(phi);
            var y = Math.sin(theta) * Math.sin(phi);
            var z = Math.cos(phi);
            data[i - 1]['index'] = -1;
            data[i - 1]['mouseOver'] = false;
            data[i - 1]['vectorPosition'] = {x: x, y: y, z: z};
            data[i - 1]['vector2D'] = {x: 0, y: 0};
          }
          return data;
        }

        function coordsUpdate(data, radius) {
          for (var i = 0, l = data.length; i < l; i++) {
            var item = data[i];
            var dx = item.vectorPosition.x - center3D.x;
            var dy = item.vectorPosition.y - center3D.y;
            var dz = item.vectorPosition.z - center3D.z;

            var length = Math.sqrt(dx * dx + dy * dy + dz * dz);

            item.vectorPosition.x /= length;
            item.vectorPosition.y /= length;
            item.vectorPosition.z /= length;

            item.vectorPosition.x *= radius;
            item.vectorPosition.y *= radius;
            item.vectorPosition.z *= radius;
          }
        }
      });

    }

    // setter getter
    chart.entries = function (_) {
      if (!arguments.length) {
        return entries;
      }
      entries = _;
      return chart;
    };
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
    chart.radius = function (_) {
      if (!arguments.length) {
        return radius;
      }
      radius = _;
      return chart;
    };
    chart.radiusMin = function (_) {
      if (!arguments.length) {
        return radiusMin;
      }
      radiusMin = _;
      return chart;
    };
    chart.bgDraw = function (_) {
      if (!arguments.length) {
        return bgDraw;
      }
      bgDraw = _;
      return chart;
    };
    chart.bgColor = function (_) {
      if (!arguments.length) {
        return bgColor;
      }
      bgColor = _;
      return chart;
    };
    chart.opacityOver = function (_) {
      if (!arguments.length) {
        return opacityOver;
      }
      opacityOver = _;
      return chart;
    };
    chart.opacityOut = function (_) {
      if (!arguments.length) {
        return opacityOut;
      }
      opacityOut = _;
      return chart;
    };
    chart.opacitySpeed = function (_) {
      if (!arguments.length) {
        return opacitySpeed;
      }
      opacitySpeed = _;
      return chart;
    };
    chart.fov = function (_) {
      if (!arguments.length) {
        return fov;
      }
      fov = _;
      return chart;
    };
    chart.speed = function (_) {
      if (!arguments.length) {
        return speed;
      }
      speed = _;
      return chart;
    };
    chart.fontFamily = function (_) {
      if (!arguments.length) {
        return fontFamily;
      }
      fontFamily = _;
      return chart;
    };
    chart.fontSize = function (_) {
      if (!arguments.length) {
        return fontSize;
      }
      fontSize = _;
      return chart;
    };
    chart.fontColor = function (_) {
      if (!arguments.length) {
        return fontColor;
      }
      fontColor = _;
      return chart;
    };
    chart.fontWeight = function (_) {
      if (!arguments.length) {
        return fontWeight;
      }
      fontWeight = _;
      return chart;
    };
    chart.fontStyle = function (_) {
      if (!arguments.length) {
        return fontStyle;
      }
      fontStyle = _;
      return chart;
    };
    chart.fontStretch = function (_) {
      if (!arguments.length) {
        return fontStretch;
      }
      fontStretch = _;
      return chart;
    };
    chart.fontToUpperCase = function (_) {
      if (!arguments.length) {
        return fontToUpperCase;
      }
      fontToUpperCase = _;
      return chart;
    };
    chart.tooltipFontFamily = function (_) {
      if (!arguments.length) {
        return tooltipFontFamily;
      }
      tooltipFontFamily = _;
      return chart;
    };
    chart.tooltipFontSize = function (_) {
      if (!arguments.length) {
        return tooltipFontSize;
      }
      tooltipFontSize = _;
      return chart;
    };
    chart.tooltipFontColor = function (_) {
      if (!arguments.length) {
        return tooltipFontColor;
      }
      tooltipFontColor = _;
      return chart;
    };
    chart.tooltipFontWeight = function (_) {
      if (!arguments.length) {
        return tooltipFontWeight;
      }
      tooltipFontWeight = _;
      return chart;
    };
    chart.tooltipFontStyle = function (_) {
      if (!arguments.length) {
        return tooltipFontStyle;
      }
      tooltipFontStyle = _;
      return chart;
    };
    chart.tooltipFontStretch = function (_) {
      if (!arguments.length) {
        return tooltipFontStretch;
      }
      tooltipFontStretch = _;
      return chart;
    };
    chart.tooltipFontToUpperCase = function (_) {
      if (!arguments.length) {
        return tooltipFontToUpperCase;
      }
      tooltipFontToUpperCase = _;
      return chart;
    };
    chart.tooltipTextAnchor = function (_) {
      if (!arguments.length) {
        return tooltipTextAnchor;
      }
      tooltipTextAnchor = _;
      return chart;
    };
    chart.tooltipDiffX = function (_) {
      if (!arguments.length) {
        return tooltipDiffX;
      }
      tooltipDiffX = _;
      return chart;
    };
    chart.tooltipDiffY = function (_) {
      if (!arguments.length) {
        return tooltipDiffY;
      }
      tooltipDiffY = _;
      return chart;
    };

    return chart;
  }
}));

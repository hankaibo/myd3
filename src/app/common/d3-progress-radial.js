/** d3进度条圆环版 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['d3'], factory);
  } else if (typeof exports === 'object' && module.exports) {
    module.exports = factory(require('d3'));
  } else {
    root.d3.progressRadial = factory(root.d3);
  }
}(this, function (d3) {
  // exposed methods
  return function module() {
    'use strict';

    // Public variables with default settings
    var width = 320;
    var height = 320;
    var backgroundColor = '#fff';
    var innerRadius = 100;
    var outerRadius = 105;
    var color = '#e1499a';
    var isFilter = false;
    var startPosition = 0;
    var arcBackFill = '#ccc';
    var arcBackFillOpacity = .5;
    var arcFrontFill = '#e1499a';
    var arcFrontFillOpacity = 1;
    var arcFilterOpacity = 1;
    var arcFilterStrokeWidth = 5;
    var numberTextColor = '#fff';
    var numberTextSize = '12';
    var numberPercent = .1;
    var textColor = '#fff';
    var textSize = '#12';
    var textValue = 'XXX';

    var startPercent = 0;

    // Private variables
    var twoPI = Math.PI * 2;
    var formatPercent = d3.format('.0%');
    var count = 0;
    var step = 0;

    function chart(selection) {
      selection.each(function () {
        d3.select(this).selectAll('*').remove();
        count = Math.abs((numberPercent - startPercent) / .01);
        step = numberPercent < startPercent ? -.01 : .01;
        var arcBack = d3.arc()
          .startAngle(0)
          .endAngle(twoPI)
          .innerRadius(innerRadius)
          .outerRadius(outerRadius);
        var arcFront = d3.arc()
          .startAngle((startPosition / 12) * twoPI)
          .innerRadius(innerRadius)
          .outerRadius(outerRadius);

        var svg = d3.select(this).append('svg')
          .attr('width', width)
          .attr('height', height)
          .style('background-color', backgroundColor)
          .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        var meter = svg.append('g')
          .attr('class', 'progress-meter');
        meter.append('path')
          .attr('class', 'background')
          .attr('fill', arcBackFill)
          .attr('fill-opacity', arcBackFillOpacity)
          .attr('d', arcBack);
        // 使用滤镜
        if (isFilter) {
          var defs = svg.append('defs');
          var filter = defs.append('filter')
            .attr('id', generateUUID);
          filter.append('feGaussianBlur')
            .attr('in', 'SourceGraphic')
            .attr('stdDeviation', '7');
          var arcFilter = meter.append('path')
            .attr('class', 'arcFilter')
            .attr('fill', arcFrontFill)
            .attr('fill-opacity', arcFilterOpacity)
            .attr('stroke', arcFrontFill)
            .attr('stroke-width', arcFilterStrokeWidth)
            .attr('stroke-opacity', arcFilterOpacity)
            .attr('filter', 'url(#' + filter.attr('id') + ')');
        }

        var foreground = meter.append('path')
          .attr('class', 'foreground')
          .attr('fill', arcFrontFill)
          .attr('fill-opacity', arcFrontFillOpacity);

        var text = meter.append('text')
          .attr('text-anchor', 'middel')
          .attr('transform', 'translate(' + -width / 6 + ',0)');

        text.append('tspan')
          .attr('class', 'tspan-text')
          .attr('fill', textColor)
          // .attr('dx','0')
          // .attr('dy', '1em')
          .style('font-size', textSize)
          .text(textValue);
        text.append('tspan')
          .attr('class', 'tspan-number')
          .attr('fill', numberTextColor)
          // .attr('dy','1em')
          .style('font-size', numberTextSize);

        function updateProgress(progress) {
          if (isFilter) {
            arcFilter.attr('d', arcFront.endAngle(twoPI * progress));
          }
          foreground.attr('d', arcFront.endAngle(twoPI * progress));
          text.select('.tspan-number').text(formatPercent(progress));
        }
        var progress = startPercent;
        (function loops() {
          updateProgress(progress);

          if (count > 0) {
            count--;
            progress += step;
            setTimeout(loops, 10);
          }
        })();

      });

    }

    function generateUUID() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
      });
      return uuid;
    }

    function appendMultiText(container, str, posX, posY, width, fontsize, fontfamily) {

      if (arguments.length < 6) {
        fontsize = 14;
      }

      if (arguments.length < 7) {
        fontfamily = 'simsun, arial';
      }

      var strs = splitByLine(str, width, fontsize);

      var mulText = container.append('text')
        .attr('x', posX)
        .attr('y', posY)
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
    chart.innerRadius = function (_) {
      if (!arguments.length) {
        return innerRadius;
      }
      innerRadius = _;
      return chart;
    };
    chart.outerRadius = function (_) {
      if (!arguments.length) {
        return outerRadius;
      }
      outerRadius = _;
      return chart;
    };
    chart.color = function (_) {
      if (!arguments.length) {
        return color;
      }
      color = _;
      return chart;
    };
    chart.isFilter = function (_) {
      if (!arguments.length) {
        return isFilter;
      }
      isFilter = _;
      return chart;
    };
    chart.startPosition = function (_) {
      if (!arguments.length) {
        return startPosition;
      }
      startPosition = _;
      return chart;
    };
    chart.arcBackFill = function (_) {
      if (!arguments.length) {
        return arcBackFill;
      }
      arcBackFill = _;
      return chart;
    };
    chart.arcBackFillOpacity = function (_) {
      if (!arguments.length) {
        return arcBackFillOpacity;
      }
      arcBackFillOpacity = _;
      return chart;
    };
    chart.arcFrontFill = function (_) {
      if (!arguments.length) {
        return arcFrontFill;
      }
      arcFrontFill = _;
      return chart;
    };
    chart.arcFrontFillOpacity = function (_) {
      if (!arguments.length) {
        return arcFrontFillOpacity;
      }
      arcFrontFillOpacity = _;
      return chart;
    };
    chart.arcFilterOpacity = function (_) {
      if (!arguments.length) {
        return arcFilterOpacity;
      }
      arcFilterOpacity = _;
      return chart;
    };
    chart.arcFilterStrokeWidth = function (_) {
      if (!arguments.length) {
        return arcFilterStrokeWidth;
      }
      arcFilterStrokeWidth = _;
      return chart;
    };
    chart.numberTextColor = function (_) {
      if (!arguments.length) {
        return numberTextColor;
      }
      numberTextColor = _;
      return chart;
    };
    chart.numberTextSize = function (_) {
      if (!arguments.length) {
        return numberTextSize;
      }
      numberTextSize = _;
      return chart;
    };
    chart.numberPercent = function (_) {
      if (!arguments.length) {
        return numberPercent;
      }
      numberPercent = _;
      return chart;
    };
    chart.textColor = function (_) {
      if (!arguments.length) {
        return textColor;
      }
      textColor = _;
      return chart;
    };
    chart.textSize = function (_) {
      if (!arguments.length) {
        return textSize;
      }
      textSize = _;
      return chart;
    };
    chart.textValue = function (_) {
      if (!arguments.length) {
        return textValue;
      }
      textValue = _;
      return chart;
    };
    return chart;
  }
}));

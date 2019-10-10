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
    root.Clock = factory(root.d3);
  }
}(typeof self !== 'undefined' ? self : this, function (d3) {
  // Use b in some fashion.
  // console.log('d3 version:' + d3.version);

  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return function module() {
    // 公有属性
    var data;
    var margins = {
      top: 20,
      left: 20,
      right: 30,
      bottom: 20
    };
    var colorScale = ["#785ea5", '#4b93cf', "#45babb", "#5ab76f", '#0da2b6', '#f3d13c', '#ed6d46'];
    var dialCenter = 3;
    // 私有属性
    var svg;
    var x = d3.scaleLinear();
    var y = d3.scaleBand();
    var width;
    var height;
    var plot;
    var dial;
    var field;

    function chart(selection) {
      selection.each(function () {
        // svg
        svg = d3.select(this);
        width = +svg.attr('width');
        height = +svg.attr('height');

        // bar
        x.domain([0, d3.max(data, d => d.value) * 1.2]).range([0, quadrantWidth()]);
        y.domain(data.map(d => d.name)).range([0, quadrantHeight()]).padding(0.55);
        drawAxes();
        drawBar();

        // dial
        drawDial();
        // drawArc();
        drawHand();
        hourAxis();
        minuteAxis();
      });
    }

    function drawAxes() {
      plot = svg.append('g')
        .attr('class', 'plot')
        .attr('transform', 'translate(' + (margins.left + 100) + ',' + margins.top + ')');

      var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(5);
      var yAxis = d3.axisRight()
        .scale(y)
        .tickSize(0)
        .tickPadding(8);

      plot.append('g')
        .attr('class', 'axis x')
        .attr('transform', function () {
          return 'translate(' + 0 + ',' + quadrantHeight() + ')';
        })
        .call(xAxis)
        .select('.domain').remove();

      plot.select('.axis.x')
        .selectAll('.tick').remove();

      plot.append('g')
        .attr('class', 'axis y')
        .attr('transform', function () {
          return 'translate(' + quadrantWidth() + ',' + 0 + ')';
        })
        .call(yAxis)
        .select('.domain').remove();
    }

    function drawBar() {
      var barSvg = plot.append('g')
        .attr('class', 'bars');

      barSvg.selectAll('rect.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('fill', '#dcdcdc')
        .attr('x', x(0))
        .attr('y', function (d) {
          return y(d.name);
        })
        .attr('width', quadrantWidth())
        .attr('height', y.bandwidth())
        .attr('rx', y.bandwidth());

      var bars = barSvg.selectAll('rect.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar');


      bars.on("mouseover", function (d) {
        d3.select(this)
          .style("fill", "#D3D3D3");
      })
        .on("mouseout", function (d, i) {
          d3.select(this)
            .transition().duration(600)
            .style("fill", colorScale[i]);
        });

      bars.transition()
        .duration(500)
        .delay(function (d, i) {
          return i * 200;
        })
        .attr('x', x(0))
        .attr('y', function (d) {
          return y(d.name);
        })
        .attr('width', function (d) {
          return x(d.value) - x(0);
        })
        .attr('height', y.bandwidth())
        .attr('rx', y.bandwidth())
        .attr('fill', function (d, i) {
          return colorScale[i];
        });
    }

    function drawDial() {
      dial = svg.append('g')
        .attr('class', 'dial')
        .attr('transform', 'translate(' + (margins.left + 100) + ',' + (quadrantHeight() / 2 + margins.top) + ')'
        );
      dial.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', quadrantHeight() / 2)
        .attr('class', 'dial-edge');

      dial.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', dialCenter)
        .attr('class', 'dial-center');
    }

    // function drawArc() {
    //   var arc = d3.arc()
    //     .outerRadius(arcOuterRadius)
    //     .innerRadius(arcInnerRadius)
    //     .startAngle(arcStartAngle)
    //     .endAngle(arcEndAngle);
    //
    //   dial.append('path')
    //     .attr('class', 'dial-arc')
    //     .attr('d', arc);
    // }

    function drawHand() {
      // TODO
      var time = 21 || 0;
      var hours = ((time + 24) % 12 || 0);

      field = dial.append('g')
        .attr('class', 'field');

      field.append('line')
        .attr('class', 'hour hand')
        .attr('stroke-width', 6)
        .attr('stroke-linecap', 'round')
        // 避开中心点
        .attr('x1', dialCenter)
        .attr('y1', 0)
        .attr('x2', quadrantHeight() / 2 * 0.6)
        .attr('y2', 0)
        .attr('transform', 'rotate(' + (360 * (hours / 12) - 90) + ')')
        .style('stroke', '#222');
    }

    // 时针刻度
    function hourAxis() {
      var hourDomain = d3.range(12);
      var hourAngle = d3.scaleLinear()
        .domain([0, 12])
        .range([180, -180]);

      var hourMarks = dial.append('g')
        .attr('class', 'axis hour')
        .selectAll('.tick')
        .data(hourDomain)
        .enter()
        .append('g')
        .attr('class', 'tick')
        .attr('transform', function (d) {
          return 'rotate(' + -hourAngle(d) + ')';
        });

      hourMarks.append('text')
        .attr('y', quadrantHeight() / 2 * 0.6)
        .attr('transform', function (d) {
          return 'rotate(' + hourAngle(d) + ',0,' + quadrantHeight() / 2 + ')';
        })
        .text(function (d, i) {
          if (i % 3 === 0) {
            if (i === 0) {
              return '12';
            } else {
              return i;
            }
          }
        });

      hourMarks
        .append('line')
        .attr('stroke-width', 3)
        .attr('x1', quadrantHeight() / 2)
        .attr('x2', quadrantHeight() / 2)
        .attr('y1', 0)
        .attr('y2', 0);
    }

    // 分针刻度
    function minuteAxis() {
      var minuteDomain = d3.range(60);
      var minuteAngle = d3.scaleLinear()
        .domain([0, 60])
        .range([180, -180]);

      var minuteMarks = dial.append('g')
        .attr('class', 'axis minute')
        .selectAll('.tick')
        .data(minuteDomain)
        .enter()
        .append('g')
        .attr('class', 'tick')
        .attr('transform', function (d) {
          return 'rotate(' + -minuteAngle(d) + ')';
        });

      minuteMarks.filter(function (d) {
        return d % 5 === 0;
      })
        .append('text')
        .attr('y', quadrantHeight() / 2)
        .attr('transform', function (d) {
          return 'rotate(' + minuteAngle(d) + ',0,' + quadrantHeight() / 2 + ')';
        })
        .text(String);

      minuteMarks.append('line')
        .attr('x1', quadrantHeight() / 2)
        .attr('x2', quadrantHeight() / 2)
        .attr('y1', 0)
        .attr('y2', 0);
    }

    function quadrantWidth() {
      return width - margins.left - margins.right - 100;
    }

    function quadrantHeight() {
      return height - margins.top - margins.bottom;
    }

    // setter getter
    chart.margins = function (_) {
      return arguments.length ? (margins = _, chart) : margins;
    };
    chart.data = function (_) {
      return arguments.length ? (data = _, chart) : data;
    };
    return chart;
  };
}));

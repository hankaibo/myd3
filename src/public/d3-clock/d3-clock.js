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
    root.clock = factory(root.d3);
  }
}(typeof self !== 'undefined' ? self : this, function (d3) {
  // Use b in some fashion.
  console.log('d3 version:' + d3.version);

  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return function module() {
    // 公有属性
    // 私有属性
    var svg;
    var width;
    var height;
    var g;
    var field;
    var counter = 0;
    var PI = Math.PI;
    var tau = 2 * PI;

    function chart(selection) {
      selection.each(function () {
        // svg
        svg = d3.select(this);
        width = +svg.attr('width');
        height = +svg.attr('height');

        g = svg.append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        field = g.selectAll('g')
          .data(fields)
          .enter()
          .append('g')
          .attr('class', 'field');

        field.append('line')
          .attr('class', function (d) {
            return d.field + ' hand';
          })
          .attr('stroke-width', function (d) {
            return d.strokeWidth;
          })
          .attr('stroke-linecap', 'round')
          .attr('x1', 0)
          .attr('x2', function (d) {
            return d.length;
          })
          .attr('y1', 0)
          .attr('y2', 0);


        faceHands();
        minuteHands();
        hourHands();
      });
    }

    // 画面板及中心
    function faceHands() {
      var arc = d3.arc()
        .outerRadius(188)
        .innerRadius(183)
        .startAngle(0)
        .endAngle(tau);

      g.append('path')
        .attr('class', 'orbit')
        .attr('d', arc);

      // 画中心
      g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 3)
        .attr('fill', '#c22');
    }

    // 分针
    function minuteHands() {
      var minuteDomain = d3.range(60);
      var minuteAngle = d3.scaleLinear()
        .domain([0, 60])
        .range([180, -180]);

      var minuteMarks = g.selectAll('.minute.axis')
        .data(minuteDomain)
        .enter()
        .append('g')
        .attr('class', 'minute')
        .attr('transform', function (d) {
          return 'rotate(' + -minuteAngle(d) + ')';
        });

      minuteMarks.filter(function (d) {
        return d % 5 === 0;
      })
        .append('text')
        .attr('y', 190)
        .attr('transform', function (d) {
          return 'rotate(' + minuteAngle(d) + ',0,190)';
        })
        .text(String);

      minuteMarks.append('line')
        .attr('x1', 168)
        .attr('x2', 180)
        .attr('y1', 0)
        .attr('y2', 0)
    }

    // 时针
    function hourHands() {
      var hourDomain = d3.range(12);
      var hourAngle = d3.scaleLinear()
        .domain([0, 12])
        .range([180, -180]);

      var hourMarks = g.selectAll('.hour.axis')
        .data(hourDomain)
        .enter()
        .append('g')
        .attr('class', 'hour')
        .attr('transform', function (d) {
          return 'rotate(' + -hourAngle(d) + ')';
        });

      hourMarks.append('text')
        .attr('y', 140)
        .attr('transform', function (d) {
          return 'rotate(' + hourAngle(d) + ',0,140)';
        })
        .text(function (d, i) {
          if (i === 0) {
            return '12';
          } else {
            return i;
          }
        });

      hourMarks
        .append('line')
        .attr('stroke-width', 2)
        .attr('x1', 156)
        .attr('x2', 180)
        .attr('y1', 0)
        .attr('y2', 0)
    }

    function tick() {
      if (counter++ % 3 !== 0) {
        return;
      }
      field.data(fields)
        .select('line')
        .attr('transform', function (d) {
          return 'rotate(' + (360 * d.value - 90) + ')'
        })
        .style('stroke', function (d) {
          return d.color;
        })
    }

    function fields() {
      var now = new Date;
      var milliseconds = now.getMilliseconds();
      var seconds = now.getSeconds() + milliseconds / 1000;
      var minutes = now.getMinutes() + seconds / 60;
      var hours = ((now.getHours() + 24) % 12 || 0) + minutes / 60;
      return [
        {field: 'hours', color: '#222', length: 102, strokeWidth: 6, index: .555, spacing: 0.1, value: hours / 12},
        {
          field: 'minutes',
          color: '#222',
          length: 154,
          strokeWidth: 3,
          index: .597,
          spacing: 0.115,
          value: minutes / 60
        },
        {
          field: 'seconds',
          color: '#222',
          length: 180,
          strokeWidth: 1.5,
          index: .6348,
          spacing: 0.015,
          value: seconds / 60
        }
      ]
    }

    d3.timer(tick);

    // setter getter
    return chart;
  }
}));

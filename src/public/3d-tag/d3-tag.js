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
    root.tag = factory(root.d3);
  }
}(typeof self !== 'undefined' ? self : this, function (d3) {
  // Use b in some fashion.
  console.log('d3 version:' + d3.version);

  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return function module() {
    // 公有属性
    var data = [];
    var radius = 150;
    var rotateAngleX = 500;
    var rotateAngleY = 500;
    var isrunning = true;
    var shape = '';
    // 私有属性
    var svg;
    var width;
    var height;
    var g;
    var angleX = Math.PI / rotateAngleX;
    var angleY = Math.PI / rotateAngleY;
    var focal = 500;

    function chart(selection) {
      selection.each(function () {
        data = dataTransform(data);
        // svg
        svg = d3.select(this);
        width = svg.attr('width');
        height = svg.attr('height');

        g = svg.append('g')
          .attr('class', 'd3-tag')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        g.on('mousemove', function () {
          var e = d3.mouse(this);
          angleX = -e[0] * 0.0001;
          angleY = -e[1] * 0.0001;
        });

        draw();
        animate();
      });
    }

    // 画点。
    function draw() {
      if (!g) return;
      var color = d3.scaleOrdinal(d3.schemeCategory10);
      var tags = g.selectAll('a.tag');

      tags
        .data(data)
        .exit()
        .remove();

      tags
        .data(data)
        .enter()
        .append('a')
        .attr('class', 'tag')
        .attr('href', function (d) {
          return d.ele.url;
        })
        .attr('target', function (d) {
          return d.ele.target;
        })
        .style('z-index', function (d) {
          return parseInt(focal / (focal - d.z) * 100);
        })
        .style('transform', function (d) {
          var rect = this.getBoundingClientRect();
          var left = d.x - rect.width / 2 + 'px';
          var top = d.y - rect.height / 2 + 'px';
          var transform = 'translate(' + left + ',' + top + ') scale(' + (focal / (focal - d.z)) + ')';
          return transform;
        })
        .append('text')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '20px')
        .attr('fill', function (d, i) {
          return color(i)
        })
        .text(function (d) {
          return d.ele.label;
        });

      tags
        .data(data)
        .style('opacity', function (d) {
          return (d.z + radius) / (2 * radius) + 0.5;
        })
        .style('z-index', function (d) {
          return parseInt(focal / (focal - d.z) * 100);
        })
        .style('transform', function (d) {
          var rect = this.getBoundingClientRect();
          var left = d.x - rect.width / 2 + 'px';
          var top = d.y - rect.height / 2 + 'px';
          var transform = 'translate(' + left + ',' + top + ') scale(' + focal / (focal - d.z) + ')';
          return transform;
        });
    }

    // 动画。
    function animate() {
      for (var i = 0; i < data.length; i++) {
        switch (shape) {
          case 'hring':
          case 'hcylinder':
            rotateX(data[i], angleX);
            break;
          case 'vring':
          case 'vcylinder':
            rotateY(data[i], angleY);
            break;
          default:
            rotateX(data[i], angleX);
            rotateY(data[i], angleY);
        }
      }
      draw();
      isrunning && requestAnimationFrame(animate);
    }

    // 绕x轴变化，得出新的y，z坐标
    function rotateX(coordinate) {
      var cosx = Math.cos(angleX);
      var sinx = Math.sin(angleX);
      var y1 = coordinate.y * cosx - coordinate.z * sinx;
      var z1 = coordinate.y * sinx + coordinate.z * cosx;

      coordinate.y = y1;
      coordinate.z = z1;
    }

    // 绕x轴变化，得出新的y，z坐标
    function rotateY(coordinate) {
      var cosy = Math.cos(angleY);
      var siny = Math.sin(angleY);
      var x1 = coordinate.z * siny + coordinate.x * cosy;
      var z1 = coordinate.z * cosy - coordinate.x * siny;

      coordinate.x = x1;
      coordinate.z = z1;
    }

    // 转换数据为均匀分布于球面上。
    function dataTransform(data) {
      var tags = [];
      var k;
      var phi;
      var theta;
      for (var i = 0; i < data.length; i++) {
        switch (shape) {
          case 'hring':
            phi = 2 * Math.PI * i / data.length;
            theta = Math.PI / 2;
            break;
          case 'vring':
            phi = 2 * Math.PI * i / data.length;
            theta = 0;
            break;
          default:
            k = -1 + (2 * (i + 1) - 1) / data.length;
            phi = Math.acos(k);
            theta = Math.sqrt(data.length * Math.PI) * phi;
            break;
        }
        var x = radius * Math.cos(theta) * Math.sin(phi);
        var y = radius * Math.sin(theta) * Math.sin(phi);
        var z = radius * Math.cos(phi);
        tags.push({x: x, y: y, z: z, ele: data[i]});
      }
      return tags;
    }

    // 腻子脚本。
    window.requestAnimationFrame = (function () {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
        };
    })();

    // setter getter
    chart.data = function (_) {
      return arguments.length ? (data = _, chart) : data;
    };
    chart.radius = function (_) {
      return arguments.length ? (radius = +_, chart) : radius;
    };
    chart.rotateAngleX = function (_) {
      return arguments.length ? (rotateAngleX = +_, chart) : rotateAngleX;
    };
    chart.rotateAngleY = function (_) {
      return arguments.length ? (rotateAngleY = +_, chart) : rotateAngleY;
    };
    chart.isrunning = function (_) {
      if (!arguments.length) {
        return isrunning;
      }
      isrunning = _;
      animate();
      return chart;
    };
    chart.shape = function (_) {
      if (!arguments.length) {
        return shape;
      }
      shape = _;
      data = dataTransform(data);
      return chart;
    };

    return chart;
  }
}));

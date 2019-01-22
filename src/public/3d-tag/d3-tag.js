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
    // 私有属性
    var svg;
    var width;
    var height;
    var vpx;
    var vpy;
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
        vpx = width / 2;
        vpy = height / 2;
        svg.on('mousemove', function () {
          var e = d3.mouse(this);
          var rect = this.getBoundingClientRect();
          var x = e[0] - rect.left - vpx - document.body.scrollLeft - document.documentElement.scrollLeft;
          var y = e[1] - rect.top - vpy - document.body.scrollTop - document.documentElement.scrollTop;

          angleX = -x * 0.0001;
          angleY = -y * 0.0001;
        });

        draw();
        animate();
      });
    }

    // 画点。
    function draw() {
      var color = d3.scaleOrdinal(d3.schemeCategory10);
      var tags = svg.selectAll('a.tag')
        .data(data);

      tags
        .exit()
        .remove();

      tags
        .enter()
        .append('a')
        .attr('class', 'tag')
        .attr('href', function (d) {
          return d.ele.url;
        })
        .attr('target', function (d) {
          return d.ele.target;
        })
        .style('opacity', function (d) {
          return (d.z + radius) / (2 * radius) + 0.5;
        })
        .style('z-index', function (d) {
          return parseInt(focal / (focal - d.z) * 100);
        })
        .style('transform', function (d) {
          var rect = this.getBoundingClientRect();
          console.log('width,height', rect.width, rect.height);
          var left = d.x + width / 2 - rect.width / 2 + 'px';
          var top = d.y + height / 2 - rect.height / 2 + 'px';
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
        })
        .on('mouseenter', function (d) {
          isrunning = false;
        })
        .on('mouseleave', function () {
          isrunning = true;
          animate();
        });

      tags
        .style('opacity', function (d) {
          return (d.z + radius) / (2 * radius) + 0.5;
        })
        .style('z-index', function (d) {
          return parseInt(focal / (focal - d.z) * 100);
        })
        .style('transform', function (d) {
          var rect = this.getBoundingClientRect();
          console.log('width,height', rect.width, rect.height);
          var left = d.x + width / 2 - rect.width / 2 + 'px';
          var top = d.y + height / 2 - rect.height / 2 + 'px';
          var transform = 'translate(' + left + ',' + top + ') scale(' + focal / (focal - d.z) + ')';
          return transform;
        });
    }

    // 动画。
    function animate() {
      for (var i = 0; i < data.length; i++) {
        rotateX(data[i], angleX);
        rotateY(data[i], angleY);
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
      for (var i = 0; i < data.length; i++) {
        var k = -1 + (2 * (i + 1) - 1) / data.length;
        var phi = Math.acos(k);
        var theta = Math.sqrt(data.length * Math.PI) * phi;
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
      if (!arguments.length) {
        return data;
      }
      data = _;
      return chart;
    };
    chart.radius = function (_) {
      if (!arguments.length) {
        return radius;
      }
      radius = _;
      return chart;
    };
    chart.rotateAngleX = function (_) {
      if (!arguments.length) {
        return rotateAngleX;
      }
      rotateAngleX = _;
      return chart;
    };
    chart.rotateAngleY = function (_) {
      if (!arguments.length) {
        return rotateAngleY;
      }
      rotateAngleY = _;
      return chart;
    };
    chart.isrunning = function (_) {
      if (!arguments.length) {
        return isrunning;
      }
      isrunning = _;
      isrunning && animate();
      return chart;
    };

    return chart;
  }
}));

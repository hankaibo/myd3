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
    root.force = factory(root.d3);
  }
}(typeof self !== 'undefined' ? self : this, function (d3) {
  // Use b in some fashion.
  console.log('d3 version:' + d3.version);

  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return function module() {
    // Public variables with default settings
    var backgroundColor = '#fff';
    var value;
    var maxNodeSize = 50;
    var tipHtml = '';
    var legendTitle = 'Legend Title';
    var legendDomain = ['信用A级', '信用B级', '信用C级', '信用D级'];
    var legendRange = ['#008ef2', '#25c12a', '#ffa026', '#ff6705'];
    var legendOffsetX = 20;
    var legendOffsetY = 20;
    var forceGravity = .05;
    var forceCharge = -1500;
    var forceLinkDistance = 10;
    var forceFriction = .5;
    var imgMinHeight = 50;
    var imgMinWidth = 50;
    var imgMaxHeight = 100;
    var imgMaxWidth = 100;
    var circleMinR = 1;
    var circleMaxR = 80;
    // Private variables
    var root;
    var force;

    function chart(selection) {
      selection.each(function () {
        // svg
        var svg = d3.select('svg');
        var width = +svg.attr('width');
        var height = +svg.attr('height');
        // tip
        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .html(function (d) {
            return '<p>' + d.title + '</p><span>' + d.name + '</span>';
          });
        // legend
        var ordinal = d3.scaleOrdinal()
          .domain(legendDomain)
          .range(legendRange);
        var legendOrdinal = d3.legendColor()
          .shapeWidth(30)
          .shapePadding(10)
          .scale(ordinal)
          .title(legendTitle)
          .on('cellclick', function (d) {
            // alert('clicked ' + d);
          });
        // radialGradient
        var radialGradient = svg.selectAll('defs.radialGradient')
          .data(legendRange)
          .enter()
          .append('defs')
          .append('radialGradient')
          .attr('id', function (d, i) {
            return 'radialGradient' + i;
          });
        radialGradient.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', function (d, i) {
            return d;
          });
        radialGradient.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', '#fff');

        force = d3.forceSimulation();

        svg.call(tip);
        svg.append('g')
          .attr('class', 'legendOrdinal')
          .attr('transform', 'translate(' + legendOffsetX + ',' + legendOffsetY + ')');
        svg.select('.legendOrdinal')
          .call(legendOrdinal);

        if (value) {
          root = value;
          root.fixed = true;
          root.x = width / 2;
          root.y = height / 2;

          // Build the path
          var defs = svg.insert('svg:defs')
            .data(['end']);

          defs.enter()
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5');

          update();
        }
      });
    }

    /**
     *
     */
    function update() {
      var nodes = flatten(root);
      var links = d3.tree(nodes).links();

      // Restart the force layout.
      force.nodes(nodes)
        .links(links)
        .gravity(forceGravity)
        .charge(forceCharge)
        .linkDistance(forceLinkDistance)
        .friction(forceFriction)
        .linkStrength(function (l, i) {
          return 1;
        })
        .size([width, height])
        .on('tick', tick)
        .start();

      var path = svg.selectAll('path.link')
        .data(links, function (d) {
          return d.target.id;
        });

      path.enter()
        .insert('svg:path')
        .attr('class', 'link')
        // .attr('marker-end', 'url(#end)')
        .style('stroke', '#eee');

      // Exit any old paths.
      path.exit().remove();

      // Update the nodes…
      var node = svg.selectAll('g.node')
        .data(nodes, function (d) {
          return d.id;
        });

      // Enter any new nodes.
      var nodeEnter = node.enter().append('svg:g')
        .attr('class', 'node')
        .attr('transform', function (d) {
          return 'translate(' + d.x + ',' + d.y + ')';
        })
        .on('click', click)
        .call(force.drag);

      // Append a circle
      nodeEnter.append('svg:circle')
        .attr('r', function (d) {
          return circleMinR;
        })
        .style('fill', function (d, i) {
          var radial = 'url(#radialGradient4)';
          switch (d.grade) {
            case 'A':
              radial = 'url(#radialGradient0)';
              break;
            case 'B':
              radial = 'url(#radialGradient1)';
              break;
            case 'C':
              radial = 'url(#radialGradient2)';
              break;
            default:
              radial = 'url(#radialGradient3)';
          }
          return radial;
        });
      // Append images
      var images = nodeEnter.append('svg:image')
        .attr('xlink:href', function (d) {
          return d.img;
        })
        .attr('x', function (d) {
          return -imgMinWidth / 2;
        })
        .attr('y', function (d) {
          return -imgMinHeight / 2;
        })
        .attr('height', imgMinHeight)
        .attr('width', imgMinWidth);

      // make the image grow a little on mouse over and add the text details on click
      nodeEnter
        .on('mouseover', function () {
          d3.select(this)
            .select('image')
            .transition()
            .attr('x', function (d) {
              return -imgMaxWidth / 2;
            })
            .attr('y', function (d) {
              return -imgMaxHeight / 2;
            })
            .attr('height', imgMaxHeight)
            .attr('width', imgMaxWidth);
          d3.select(this)
            .select('circle')
            .transition()
            .attr('r', function () {
              return circleMaxR;
            });
        })
        .on('mouseout', function () {
          d3.select(this)
            .select('image')
            .transition()
            .attr('x', function (d) {
              return -imgMinWidth / 2;
            })
            .attr('y', function (d) {
              return -imgMinHeight / 2;
            })
            .attr('height', imgMinHeight)
            .attr('width', imgMinWidth);
          d3.select(this)
            .select('circle')
            .transition()
            .attr('r', function () {
              return circleMinR;
            });
        });
      nodeEnter
        .on('mouseover.tip', tip.show)
        .on('mouseout.tip', tip.hide);

      // Exit any old nodes.
      node.exit().remove();


      // Re-select for update.
      path = svg.selectAll('path.link');
      node = svg.selectAll('g.node');

      function tick() {
        path.attr('d', function (d) {
          var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
          return 'M' + d.source.x + ',' +
            d.source.y
            // + 'A' + dr + ','
            // + dr + ' 0 0,1 '
            +
            'L' +
            d.target.x + ',' +
            d.target.y;
        });
        node.attr('transform', nodeTransform);
      }
    }

    /**
     * Gives the coordinates of the border for keeping the nodes inside a frame
     * http://bl.ocks.org/mbostock/1129492
     */
    function nodeTransform(d) {
      d.x = Math.max(maxNodeSize, Math.min(width - (d.imgwidth / 2 || 16), d.x));
      d.y = Math.max(maxNodeSize, Math.min(height - (d.imgheight / 2 || 16), d.y));
      return 'translate(' + d.x + ',' + d.y + ')';
    }

    /**
     * Toggle children on click.
     */
    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }

      update();
    }

    /**
     * Returns a list of all nodes under the root.
     */
    function flatten(root) {
      var nodes = [];
      var i = 0;

      function recurse(node) {
        if (node.children) {
          node.children.forEach(recurse);
        }
        if (!node.id) {
          node.id = ++i;
        }
        nodes.push(node);
      }

      recurse(root);
      return nodes;
    }

    // Getter/setter function
    chart.backgroundColor = function (_) {
      return arguments.length ? (backgroundColor = _, chart) : backgroundColor;
    };
    chart.value = function (_) {
      return arguments.length ? (value = _, chart) : value;
    };
    chart.maxNodeSize = function (_) {
      return arguments.length ? (maxNodeSize = _, chart) : maxNodeSize;
    };
    chart.tipHtml = function (_) {
      return arguments.length ? (tipHtml = _, chart) : tipHtml;
    };
    chart.legendTitle = function (_) {
      return arguments.length ? (legendTitle = _, chart) : legendTitle;
    };
    chart.legendDomain = function (_) {
      return arguments.length ? (legendDomain = _, chart) : legendDomain;
    };
    chart.legendRange = function (_) {
      return arguments.length ? (legendRange = _, chart) : legendRange;
    };
    chart.legendOffsetX = function (_) {
      return arguments.length ? (legendOffsetX = _, chart) : legendOffsetX;
    };
    chart.legendOffsetY = function (_) {
      return arguments.length ? (legendOffsetY = _, chart) : legendOffsetY;
    };
    chart.forceGravity = function (_) {
      return arguments.length ? (forceGravity = _, chart) : forceGravity;
    };
    chart.forceCharge = function (_) {
      return arguments.length ? (forceCharge = _, chart) : forceCharge;
    };
    chart.forceLinkDistance = function (_) {
      return arguments.length ? (forceLinkDistance = _, chart) : forceLinkDistance;
    };
    chart.forceFriction = function (_) {
      return arguments.length ? (forceFriction = _, chart) : forceFriction;
    };
    chart.imgMinHeight = function (_) {
      return arguments.length ? (imgMinHeight = _, chart) : imgMinHeight;
    };
    chart.imgMinWidth = function (_) {
      return arguments.length ? (imgMinWidth = _, chart) : imgMinWidth;
    };
    chart.imgMaxHeight = function (_) {
      return arguments.length ? (imgMaxHeight = _, chart) : imgMaxHeight;
    };
    chart.imgMaxWidth = function (_) {
      return arguments.length ? (imgMaxWidth = _, chart) : imgMaxWidth;
    };
    chart.circleMinR = function (_) {
      return arguments.length ? (circleMinR = _, chart) : circleMinR;
    };
    chart.circleMaxR = function (_) {
      return arguments.length ? (circleMaxR = _, chart) : circleMaxR;
    };

    return chart;
  };
}));

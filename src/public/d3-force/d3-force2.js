/**
 * d3.force
 * Copyright (c) 2013-2017 Justin Palmer
 *
 * Tooltips for d3.js SVG visualizations
 */
var d3 = require('d3');
var tip = require('d3-tip');
d3.tip = tip;
exports = module.exports = function () {
  'use strict';
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
      var ordinal = d3.scale.ordinal()
        .domain(legendDomain)
        .range(legendRange);
      var legendOrdinal = d3.legend.color()
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

      var force = d3.layout.force();

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

      /**
       *
       */
      function update() {
        var nodes = flatten(root);
        var links = d3.layout.tree().links(nodes);

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
  chart.maxNodeSize = function (_) {
    if (!arguments.length) {
      return maxNodeSize;
    }
    maxNodeSize = _;
    return chart;
  };
  chart.tipHtml = function (_) {
    if (!arguments.length) {
      return tipHtml;
    }
    tipHtml = _;
    return chart;
  };
  chart.legendTitle = function (_) {
    if (!arguments.length) {
      return legendTitle;
    }
    legendTitle = _;
    return chart;
  };
  chart.legendDomain = function (_) {
    if (!arguments.length) {
      return legendDomain;
    }
    legendDomain = _;
    return chart;
  };
  chart.legendRange = function (_) {
    if (!arguments.length) {
      return legendRange;
    }
    legendRange = _;
    return chart;
  };
  chart.legendOffsetX = function (_) {
    if (!arguments.length) {
      return legendOffsetX;
    }
    legendOffsetX = _;
    return chart;
  };
  chart.legendOffsetY = function (_) {
    if (!arguments.length) {
      return legendOffsetY;
    }
    legendOffsetY = _;
    return chart;
  };
  chart.forceGravity = function (_) {
    if (!arguments.length) {
      return forceGravity;
    }
    forceGravity = _;
    return chart;
  };
  chart.forceCharge = function (_) {
    if (!arguments.length) {
      return forceCharge;
    }
    forceCharge = _;
    return chart;
  };
  chart.forceLinkDistance = function (_) {
    if (!arguments.length) {
      return forceLinkDistance;
    }
    forceLinkDistance = _;
    return chart;
  };
  chart.forceFriction = function (_) {
    if (!arguments.length) {
      return forceFriction;
    }
    forceFriction = _;
    return chart;
  };
  chart.imgMinHeight = function (_) {
    if (!arguments.length) {
      return imgMinHeight;
    }
    imgMinHeight = _;
    return chart;
  };
  chart.imgMinWidth = function (_) {
    if (!arguments.length) {
      return imgMinWidth;
    }
    imgMinWidth = _;
    return chart;
  };
  chart.imgMaxHeight = function (_) {
    if (!arguments.length) {
      return imgMaxHeight;
    }
    imgMaxHeight = _;
    return chart;
  };
  chart.imgMaxWidth = function (_) {
    if (!arguments.length) {
      return imgMaxWidth;
    }
    imgMaxWidth = _;
    return chart;
  };
  chart.circleMinR = function (_) {
    if (!arguments.length) {
      return circleMinR;
    }
    circleMinR = _;
    return chart;
  };
  chart.circleMaxR = function (_) {
    if (!arguments.length) {
      return circleMaxR;
    }
    circleMaxR = _;
    return chart;
  };

  return chart;
};

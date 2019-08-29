/**
 * This is a pure D3.js alphabet inspired by the LED .
 */
var d3 = require('d3');
exports = module.exports = function () {
  'use strict';
  // Public variables with default settings

  // Private variables

  function chart(selection) {
    selection.each(function () {
      var svg = d3.select(this);
      var width = +svg.attr('width');
      var height = +svg.attr('height');

      var dom = svg.append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
      var g1 = dom.append('g')
        .attr('class', 'alphabet');
      g1.selectAll('rect.' + 'a')
        .data([35,35])
        .enter()
        .append('rect')
        .attr('class', 'a')
        .attr('id', function (d, i) {
          return i;
        });
      g1.append('rect');
    });

  }

  return chart;
};

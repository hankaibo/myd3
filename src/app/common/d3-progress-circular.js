/** */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['d3'], factory);
  } else if (typeof exports === 'object' && module.exports) {
    module.exports = factory(require('d3'));
  } else {
    root.d3.progressCircular = factory(root.d3);
  }
} (this, function (d3) {
  return function module(selection, k) {
    if (selection) {
      var r = 120;
      var h = 0;
      var zero = 0;
      var one = 0;
      var text = 'N/A';
      var width = 300;
      var height = 300;
      if (k >= 0) {
        var fixed = fix(k);
        h = r * 2 * (1 - fixed);
        zero = 1;
        one = k;
        text = parseInt(k * 100) + '%';
      }
      selection.selectAll('svg').remove();
      selection.append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', '0 0 ' + r * 2 + ' ' + r * 2)
        .call(function (e) {
          var defs = e.append('defs');
          var clip = defs.append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('x', '-' + r)
            .attr('y', '-' + r)
            .attr('width', r * 2)
            .attr('height', h)
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

          g = e.append('g').attr('transform', 'translate(' + r + ',' + r + ')');
          e.append('circle').attr('r', r).attr('class', 'na');
          e.append('circle').attr('r', r).style('fill-opacity', zero).attr('class', 'zero');
          e.append('circle').attr('r', r).style('fill-opacity', one).attr('class', 'one');
          e.append('circle').attr('r', r).style('fill', '#333').style('fill-opacity', .5).attr('clip-path', 'url(#clip)');
          e.append('text').attr('class', 'value').attr('text-anchor', 'middle').attr('font-size', '100').style('fill', 'white').style('fill-opacity', .7).text(text);
        });
    }

    function fix(k) {
      var t0, t1 = k * 2 * Math.PI;

      if (k > 0 && k < 1) {
        t1 = Math.pow(12 * k * Math.PI, 1 / 3);
        for (var i = 0; i < 10; ++i) {
          t0 = t1;
          t1 = (Math.sin(t0) - t0 * Math.cos(t0) + 2 * k * Math.PI) / (1 - Math.cos(t0));
        }
        k = (1 - Math.cos(t1 / 2)) / 2;
      }
      return k;
    }
  }
}));

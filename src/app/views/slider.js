var d3 = require('d3');
var slider = require('../common/d3-slider');
d3.select('#slider').call(slider().value([10, 25]));

var d3 = require('d3');
var dashboard = require('../common/d3-dashboard');
d3.select('.d3-dashboard').call(dashboard()
  // 背景设置
  .width(600)
  .height(450)
  .backgroundColor('#f99')
  // 中心数值文字设置
  .centerTextValue(62)
  .centerTextValueColor('green')
  // 中心箭头线设置
  // 中心文本文字设置
  .centerTextTitle('优')
  .centerTextTitleColor('red')
  // 内轨轨道设置
  .orbitColorIn('#ccc')
  .scaleColor('yellow')
  .scaleTextColor('red')
);

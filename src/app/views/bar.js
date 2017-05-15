var d3 = require('d3');
var bar = require('../common/d3-bar');

var data = {
  labels: ['市住房公积金管理中心', '市人力资源社会保障局', '市交通运输局', '市工商局', '市质局'],
  series: [{
      label: '红榜',
      values: [2242, 1842, 892, 342, 242, 42]
    },
    {
      label: '黑榜',
      values: [1680, 430, 202, 121, 73, 25]
    }
  ]
};
d3.select('.chart').call(bar()
  .data(data)
  .barColor(['#ff6868', '#002f3f']) // 柱子颜色
  .barBackgroundColor('#f5fbfd') // 柱子背景色
  .barHeight(30) // 柱子的高度
  .barTextColor('#000') // 柱子文字颜色
  .barTextOffset(30) // 柱子文字偏移量
  .chartWidth(400) // 图表宽度
  .gapBetweenGroups(30) // 每组柱形图的间距
  .spaceForLabels(200) // 图表左部分宽度
  .spaceForLegend(150) // 图表右部分宽度
);

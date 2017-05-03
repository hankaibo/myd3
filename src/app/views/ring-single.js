var d3 = require('d3');
var ringSingle = require('../common/d3-ring-single')
var value = [{
    id: 1,
    ranking: 1,
    name: '猛龙',
    img: '/src/assets/img/nba-1.png',
    score: 30.1
  },
  {
    id: 2,
    ranking: 2,
    name: '火箭',
    img: '/src/assets/img/nba-2.png',
    score: 29
  },
  {
    id: 3,
    ranking: 3,
    name: '凯尔特',
    img: '/src/assets/img/nba-3.png',
    score: 28.1
  },
  {
    id: 4,
    ranking: 4,
    name: '超音速',
    img: '/src/assets/img/nba-4.png',
    score: 26.9
  },
  {
    id: 5,
    ranking: 5,
    name: '马刺',
    img: '/src/assets/img/nba-5.png',
    score: 25.3
  },
  {
    id: 6,
    ranking: 6,
    name: '太阳',
    img: '/src/assets/img/nba-6.png',
    score: 25.1
  },
  {
    id: 7,
    ranking: 7,
    name: '森林',
    img: '/src/assets/img/nba-7.png',
    score: 24.3
  },
  {
    id: 8,
    ranking: 8,
    name: '开拓者',
    img: '/src/assets/img/nba-8.png',
    score: 23.5
  },
  {
    id: 9,
    ranking: 9,
    name: '勇士',
    img: '/src/assets/img/nba-9.png',
    score: 23.5
  },
  {
    id: 10,
    ranking: 10,
    name: '奇才',
    img: '/src/assets/img/nba-10.png',
    score: 23.1
  },
  {
    id: 11,
    ranking: 11,
    name: '山猫',
    img: '/src/assets/img/nba-11.png',
    score: 22.2
  },
  {
    id: 12,
    ranking: 12,
    name: '雄鹿',
    img: '/src/assets/img/nba-12.png',
    score: 22.1
  },
  {
    id: 13,
    ranking: 13,
    name: '公牛',
    img: '/src/assets/img/nba-13.png',
    score: 21.8
  },
  {
    id: 14,
    ranking: 14,
    name: '骑士',
    img: '/src/assets/img/nba-14.png',
    score: 21.4
  },
  {
    id: 15,
    ranking: 15,
    name: '灰熊',
    img: '/src/assets/img/nba-15.png',
    score: 21.2
  },
  {
    id: 16,
    ranking: 16,
    name: '快船',
    img: '/src/assets/img/nba-16.png',
    score: 21.2
  },
  {
    id: 17,
    ranking: 17,
    name: '鹰',
    img: '/src/assets/img/nba-17.png',
    score: 20.9
  },
  {
    id: 18,
    ranking: 18,
    name: '网',
    img: '/src/assets/img/nba-18.png',
    score: 20.9
  },
  {
    id: 19,
    ranking: 19,
    name: '热',
    img: '/src/assets/img/nba-19.png',
    score: 20.8
  },
  {
    id: 20,
    ranking: 20,
    name: '黄蜂',
    img: '/src/assets/img/nba-20.png',
    score: 20.7
  },
  {
    id: 21,
    ranking: 21,
    name: '爵士',
    img: '/src/assets/img/nba-21.png',
    score: 20.1
  },
  {
    id: 22,
    ranking: 22,
    name: '国王',
    img: '/src/assets/img/nba-22.png',
    score: 19.1
  },
  {
    id: 23,
    ranking: 23,
    name: '尼克斯',
    img: '/src/assets/img/nba-23.png',
    score: 18.1
  },
  {
    id: 24,
    ranking: 24,
    name: '湖人',
    img: '/src/assets/img/nba-24.png',
    score: 17.1
  },
  {
    id: 25,
    ranking: 25,
    name: '魔术',
    img: '/src/assets/img/nba-25.png',
    score: 16.1
  },
  {
    id: 26,
    ranking: 26,
    name: '小牛',
    img: '/src/assets/img/nba-26.png',
    score: 15.1
  },
  {
    id: 27,
    ranking: 27,
    name: '76人',
    img: '/src/assets/img/nba-27.png',
    score: 14.1
  },
  {
    id: 28,
    ranking: 28,
    name: '掘金',
    img: '/src/assets/img/nba-28.png',
    score: 13.1
  },
  {
    id: 29,
    ranking: 29,
    name: '步行者',
    img: '/src/assets/img/nba-29.png',
    score: 12.1
  },
  {
    id: 30,
    ranking: 30,
    name: '活塞',
    img: '/src/assets/img/nba-30.png',
    score: 11.1
  },
]

var circle1 = ringSingle()
  .value(value.slice(0, 30)) // 小球数据，默认无
  .isClockwise(true)
  .orbitWidth(0) // 小球外切轨道的宽度，默认1
  .orbitColor(['#5185dd', 'red']) // 小球外切轨道的颜色，默认[]，如果不设置则使用彩虹色
  .ballNum(36) // 小球外切轨道显示多少个小球，默认12
  .ballSize([12, 24]) // 小球的半径从小到大，默认[12,24]
  .ballUseImg(true)
  .isEquant(false) // 是否等分分布小圆，默认true
  .ballTextOutSize(14) // 小球外文字大小，默认12
  .textPathArc([2 * Math.PI * .85, 2 * Math.PI])
  .textAfterEdge('NBA各队') // 左上角外文字，默认空
  .textAfterEdgeStartOffset('15%') // 左上角外文字开始点，默认0
  .textBeforeEdge('国际球员数量')
  .textBeforeEdgeStartOffset('14%');

d3.select('.d3-ring-single-1').call(circle1);

var circle2 = ringSingle()
  .backgroundColor('#fff') // 画布的背景色，默认#fff
  .value(value.slice(0, 30)) // 小球数据，默认无
  .isClockwise(false) // 小球排列顺序，默认true，顺时针
  .orbitColor(['#5185dd', '#4199ca']) // 小球外切轨道的颜色，默认[]，如果不设置则使用彩虹色
  .orbitWidth(1) // 小球外切轨道的宽度，默认1
  .orbitStartAngle(0) // 小球外切轨道起始弧度，默认为0
  .orbitEndAngle(Math.PI) // 小球外切轨道结束弧度，默认为2*Math.PI
  .transitonTime(1000) // 小球外切轨道动画时间，单位毫秒，默认1s
  .ballNum(30) // 小球外切轨道显示多少个小球，默认12
  .ballSize([15, 25]) // 小球的半径从小到大，默认[12,24]
  .isEquant(false) // 是否等分分布小圆，默认true
  .ballTextOutSize(14) // 小球外文字大小，默认12
  .ballUseImg(false) // 是否使用图片，默认false
  .firstQuadrantDominantBaseline('text-before-edge') // 第一象限文字基线，默认值'text-before-edge'
  .firstQuadrantTextAnchor('end') // 第一象限文字起点，默认值'end'
  .secondQuadrantDominantBaseline('text-after-edge') // 第二象限文字基线，默认值'text-after-edge'
  .secondQuadrantTextAnchor('end') // 第二象限文字起点，默认值'end'
  .thirdQuadrantDominantBaseline('text-after-edge') // 第三象限文字基线，默认值'text-after-edge'
  .thirdQuadrantTextAnchor('start') // 第三象限文字起点，默认值'start'
  .fourthQuadrantDominantBaseline('text-before-edge') // 第四象限文字基线，默认值'text-before-edge'
  .fourthQuadrantTextAnchor('start') // 第四象限文字起点，默认值'start'
  .textPathArc([0, .25 * Math.PI]) // 文字路径起止，默认[2 * Math.PI * .75, 2 * Math.PI]
  .textAfterEdge('NBA各队') // 左上角外文字，默认空
  .textAfterEdgeColor('#1e518f') // 左上角外文字颜色，默认#000
  .textAfterEdgeSize(30) // 左上角外文字大小，默认24
  .textAfterEdgeStartOffset('14%') // 左上角外文字开始点，默认0
  .textAfterTextAnchor('start') // 左上角外文字对齐方式，默认开头对齐
  .textAfterEdgeDominantBaseline('text-after-edge') // 左上角外文字的基线？这个属性没清楚。默认'text-after-edge'
  .textBeforeEdge('国际球员数量') //
  .textBeforeEdgeColor('#1e518f') // 左上角内文字颜色，默认#000
  .textBeforeEdgeSize(18) // 左上角内文字大小，默认18
  .textBeforeEdgeStartOffset('15%') // 左上角内文字开始点，默认0
  .textBeforeTextAnchor('start') // 左上角内文字对齐方式，默认开头对齐
  .textBeforeEdgeDominantBaseline('text-before-edge'); // 左上角内文字的基线？这个属性没清楚。默认'text-before-edge'
d3.select('.d3-ring-single-2').call(circle2);

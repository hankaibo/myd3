//define module function
(function (win) {
  var module = function (data, dom) {
    this.data = data;
    this.dom = dom
  }
  module.prototype.init = function () {
    //var itemList = this.dom.querySelector('.item-section');
    this.dom.setData(this.data)
  }
  win.itemModule = module;
}(window));

//define data
var pageData = {
  sections: [{
    'brannerImag': 'http://gw.alicdn.com/mt/TB1PNLZKXXXXXaTXXXXXXXXXXXX-750-481.jpg',
    items: [{
      'itemLink': '##',
      'imgSrc': 'https://placeimg.com/350/350/people/grayscale',
      'poductName': 'Carter\'s1年式灰色长袖连体衣包脚爬服全棉鲸鱼男婴儿童装115G093',
      'price': '299.06',
      'preferential': '满400减100',
      'activityType': '1小时内热卖5885件',
      'shopLink': '##',
      'activeName': '马上抢！'
    }, {
      'itemLink': '##',
      'imgSrc': 'https://placeimg.com/350/350/people/grayscale',
      'poductName': 'Nike耐克官方ZOOM KOBE VENOMENON 5 EP 科比男子篮球鞋815757',
      'price': '699.50',
      'preferential': '满300减150',
      'activityType': '6744人正在疯抢',
      'shopLink': '##',
      'activeName': '马上抢！'
    }, {
      'itemLink': '##',
      'imgSrc': 'https://placeimg.com/350/350/people/grayscale',
      'poductName': '现货【送皮套+钢膜+耳机】Xiaomi/小米 红米Note2手机note2',
      'price': '799.00',
      'preferential': '满300减150',
      'activityType': '7833人正在疯抢',
      'shopLink': '##',
      'activeName': '马上抢！'
    }, {
      'itemLink': '##',
      'imgSrc': 'https://placeimg.com/350/350/people/grayscale',
      'poductName': 'ONLY2015秋装新品七分袖弹力修身针织衫女',
      'price': '299.00',
      'preferential': '满300减100',
      'activityType': '2379人想买',
      'shopLink': '##',
      'activeName': '马上抢！'
    }, {
      'itemLink': '##',
      'imgSrc': 'https://placeimg.com/350/350/people/grayscale',
      'poductName': 'Levi\'s李维斯513春季男士修身直筒牛仔裤长裤',
      'price': '399.00',
      'preferential': '满300减100',
      'activityType': '预热期加购TOP1',
      'shopLink': '##',
      'activeName': '马上抢！'
    }, {
      'itemLink': '##',
      'imgSrc': 'https://placeimg.com/350/350/people/grayscale',
      'poductName': 'Levi\'s李维斯513春季男士修身直筒牛仔裤长裤',
      'price': '399.00',
      'preferential': '满300减100',
      'activityType': '预热期加购TOP1',
      'shopLink': '##',
      'activeName': '马上抢！'
    }]
  }]
};

//render
var renderDom = document.querySelector('.html_content');
var module = new itemModule(pageData, renderDom);
module.init();

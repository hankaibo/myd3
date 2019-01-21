var d3 = require('d3');

/** chapter11 start */
// link-constraint.html
(function () {
  var w = 1280;
  var h = 800;
  var force = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(-30))
    .force('velocityDecay', function () {
      return 0.95;
    })

  var duration = 60000;
  var svg = d3.select('.link-constraint')
    .append('svg:svg')
    .attr('width', w)
    .attr('height', h);

  force.on('tick', function () {
    svg.selectAll('circle')
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      });

    svg.selectAll('line')
      .attr('x1', function (d) {
        return d.source.x;
      })
      .attr('y1', function (d) {
        return d.source.y;
      })
      .attr('x2', function (d) {
        return d.target.x;
      })
      .attr('y2', function (d) {
        return d.target.y;
      });

    function offset() {
      return Math.random() * 100;
    }

    function createNodes(point) {
      var numberOfNodes = Math.round(Math.random() * 10);
      var nodes = [];
      for (var i = 0; i < numberOfNodes; ++i) {
        nodes.push({
          x: point[0] + offset(),
          y: point[1] + offset()
        });
      }
      return nodes;
    }

  })
})();
// momentum-and-friction.html
(function () {
  var w = 1280;
  var h = 800;
  var force = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(0))
    .force('velocityDecay', function () {
      return 0.95;
    });

  var svg = d3.select('.momentum-and-friction')
    .append('svg:svg')
    .attr('width', w)
    .attr('height', h);
  force.on('tick', function () {
    svg.selectAll('circle')
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      });
  });
  var previousPoint;
  svg.on('mousemove', function () {
    var point = d3.mouse(this);
    var node = {
      x: point[0],
      y: point[1],
      px: previousPoint ? previousPoint[0] : point[0],
      py: previousPoint ? previousPoint[1] : point[1],
    };
    previousPoint = point;

    svg.append('svg:circle')
      .data([node])
      .attr('class', 'node')
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      })
      .attr('r', 1e-6)
      .transition()
      .attr('r', 4.5)
      .transition()
      .delay(5000)
      .attr('r', 1e-6)
      .on('end', function () {
        force.nodes().shift();
      })
      .remove();
  })
})();

// gravity-and-charge.html
(function () {
  var w = 1280;
  var h = 800;
  var forceX = d3.forceX(function (d) {
    return w
  }).strength(0);

  //strong y positioning based on row
  var forceY = d3.forceY(function (d) {
    return h
  }).strength(0);

  var force = d3.forceSimulation()
    .force('x', forceX)
    .force('y', forceY)
    .force('center', d3.forceCenter(w / 2, h / 2))
    .force('charge', d3.forceManyBody().strength(0))
    .force('velocityDecay', function () {
      return 0.7;
    });
  var svg = d3.select('.gravity-and-charge')
    .append('svg')
    .attr('width', w)
    .attr('height', h);
  force.on('tick', function () {
    console.log(svg.select('circle'));
    svg.selectAll('circle')
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      })
  });
  svg.on('mousemove', function () {
    var point = d3.mouse(this);
    var node = {
      x: point[0],
      y: point[1]
    };
    svg.append('circle')
      .data([node])
      .attr('class', 'node')
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      })
      .attr('r', 1e-6)
      .transition()
      // .on('start', function () {
      //   d3.active(this)
      .attr('r', 4.5)
      .transition()
      .delay(7000)
      .attr('r', 1e-6)
      .on('end', function () {
        force.nodes().shift();
      })
      // })
      .remove();
    force.nodes().push(node);
    force.restart();
  });

  function changeForce(charge, gravity) {
    force
      .force('charge', d3.forceManyBody().strength(charge))
      .force('x', d3.forceX().strength(gravity))
      .force('y', d3.forceY().strength(gravity));
  }
})();
/** chapter11 end */

// custom-interpolator.html
(function () {
  d3.interpolate(function (a, b) {
    var re = /^\$([0-9,.]+)$/,
      ma, mb, f = d3.format(',.02f');
    if ((ma = re.exec(a)) && (mb = re.exec(b))) {
      a = parseFloat(ma[1]);
      b = parseFloat(mb[1]) - a;
      return function (t) {
        return '$' + f(a + b * t);
      };
    }
  });
  d3.interpolate(function (a, b) {
    var re = /^([a-z])$/,
      ma, mb;
    if ((ma = re.exec(a)) && (mb = re.exec(b))) {
      a = a.charCodeAt(0);
      var delta = a - b.charCodeAt(0);
      return function (t) {
        return String.formCharCode(Math.ceil(a - delta * t));
      };
    }
  });

  var dollarScale = d3.scaleLinear()
    .domain([0, 11])
    .range(['$0', '$300']);
  var alphabetScale = d3.scaleLinear()
    .domain([0, 27])
    .range(['a', 'z']);

  function render(scale, selector) {
    var data = [];
    var max = scale.domain()[1];
    for (var i = 0; i < max; ++i) {
      data.push(i);
    }
    d3.select(selector).selectAll('div.cell')
      .data(data)
      .enter()
      .append('div')
      .classed('cell', true)
      .append('span');
    d3.select(selector).selectAll('div.cell')
      .data(data)
      .exit()
      .remove();
    d3.select(selector).selectAll('div.cell')
      .data(data)
      .style('display', 'inline-block')
      .select('span')
      .text(function (d, i) {
        return scale(d);
      });
  }
  render(dollarScale, '#dollar');
  render(alphabetScale, '#alphabet');

})();

// compou-nd-interpolation.html
(function () {
  var max = 21,
    data = [];
  var compoundScale = d3.scalePow()
    .exponent(2)
    .domain([0, max])
    .range([{
        color: '#add8e6',
        height: '15px'
      },
      {
        color: '#4169e1',
        height: '150px'
      }
    ]);
  for (var i = 0; i < max; i++) {
    data.push(i);
  }

  function render(data, scale, selector) {
    d3.select(selector).selectAll('div.v-bar')
      .data(data)
      .enter()
      .append('div')
      .classed('v-bar', true)
      .append('span');
    d3.select(selector).selectAll('div.v-bar')
      .data(data)
      .exit()
      .remove();
    d3.select(selector).selectAll('div.v-bar')
      .data(data)
      .classed('v-bar', true)
      .style('height', function (d, i) {
        return scale(d).height;
      })
      .style('background-color', function (d) {
        return scale(d).color;
      })
      .select('span')
      .text(function (d, i) {
        return i;
      });
  }
  render(data, compoundScale, '#compound');
})();

// color-interpolation.html
(function () {
  var max = 21,
    data = [];
  var colorScale = d3.scaleLinear()
    .domain([0, max])
    .range(['white', '#4169e1']);

  function divergingScale(pivot) {
    var divergingColorScale = d3.scaleLinear()
      .domain([0, pivot, max])
      .range(['white', '#4169e1', 'white']);
    return divergingColorScale;
  }
  for (var i = 0; i < max; i++) {
    data.push(i);
  }

  function render(data, scale, selector) {
    d3.select(selector).selectAll('div.cell')
      .data(data)
      .enter()
      .append('div')
      .classed('cell', true)
      .append('span');
    d3.select(selector).selectAll('div.cell')
      .data(data)
      .exit()
      .remove();
    d3.select(selector).selectAll('div.cell')
      .data(data)
      .style('display', 'inline-block')
      .style('background-color', function (d, i) {
        return scale(d);
      })
      .select('span')
      .text(function (d, i) {
        return i;
      });
  }
  render(data, colorScale, '#color');
  render(data, divergingScale(5), '#color-diverge');

  document.getElementById('color-interpolation').addEventListener('click', function (e) {
    render(data, divergingScale(e.target.value), '#color-diverge');
  });

})();

// string-interpolation.html
(function () {
  var max = 11,
    data = [];
  var sizeScale = d3.scaleLinear()
    .domain([0, max])
    .range([
      'italic bold 12px/30px Georgia,serif',
      'italic bold 120px/180px Georgia,serif'
    ]);
  for (var i = 0; i < max; i++) {
    data.push(i);
  }

  function render(data, scale, selector) {
    d3.select(selector).selectAll('div.cell')
      .data(data)
      .enter()
      .append('div')
      .classed('cell', true)
      .append('span');
    d3.select(selector).selectAll('div.cell')
      .data(data)
      .exit()
      .remove();
    d3.select(selector).selectAll('div.cell')
      .data(data)
      .style('display', 'inline-block')
      .select('span')
      .style('font', function (d, i) {
        return scale(d);
      })
      .text(function (d, i) {
        return i;
      });
  }
  render(data, sizeScale, '#font');
})();

// ordinal-scale.html
(function () {
  var max = 10,
    data = [];
  for (var i = 0; i < max; i++) {
    data.push(i);
  }
  var alphabet = d3.scaleOrdinal()
    .domain(data)
    .range(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']);

  function render(data, scale, selector) {
    d3.select(selector).selectAll('div.cell')
      .data(data)
      .enter()
      .append('div')
      .classed('cell', true);
    d3.select(selector).selectAll('div.cell')
      .data(data)
      .exit()
      .remove();
    d3.select(selector).selectAll('div.cell')
      .data(data)
      .style('display', 'inline-block')
      .style('background-color', function (d) {
        return scale(d).indexOf('#') >= 0 ? scale(d) : 'white';
      })
      .text(function (d) {
        return scale(d);
      });
  }
  render(data, alphabet, '#alphabetOrdinal');
  render(data, d3.scaleOrdinal(d3.schemeCategory10), '#category10');
  render(data, d3.scaleOrdinal(d3.schemeCategory20), '#category20');
  render(data, d3.scaleOrdinal(d3.schemeCategory20b), '#category20b');
  render(data, d3.scaleOrdinal(d3.schemeCategory20c), '#category20c');

})();

// time-scale.html
(function () {
  var start = new Date(2012, 0, 1),
    end = new Date(2012, 11, 31),
    range = [0, 1200],
    time = d3.scaleTime().domain([start, end])
    .rangeRound(range),
    max = 12,
    data = [];
  for (var i = 0; i < max; i++) {
    var date = new Date(start.getTime());
    date.setMonth(start.getMonth() + i);
    data.push(date);
  }

  function render(data, scale, selector) {
    d3.select(selector).selectAll('div.fixed-cell')
      .data(data)
      .enter()
      .append('div')
      .classed('fixed-cell', true);
    d3.select(selector).selectAll('div.fixed-cell')
      .data(data)
      .exit()
      .remove();
    d3.select(selector).selectAll('div.fixed-cell')
      .data(data)
      .style('margin-left', function (d) {
        return scale(d) + 'px';
      })
      .html(function (d) {
        var format = d3.timeFormat('%x');
        return format(d) + '<br>' + scale(d) + 'px';
      });
  }
  render(data, time, '#time');
}());

// quantitative-scales.html
(function () {
  var max = 11,
    data = [];
  for (var i = 1; i < max; i++) {
    data.push(i);
  }
  var linear = d3.scaleLinear()
    .domain([1, 10])
    .range([1, 10]);
  var linearCapped = d3.scaleLinear()
    .domain([1, 10])
    .range([1, 20]);
  var pow = d3.scalePow().exponent(2);
  var powCapped = d3.scalePow()
    .exponent(2)
    .domain([1, 10])
    .rangeRound([1, 10]);
  var log = d3.scaleLog();
  var logCapped = d3.scaleLog()
    .domain([1, 10])
    .rangeRound([1, 10]);
  var f = d3.format('.2f');

  function render(data, scale, selector) {
    d3.select(selector).selectAll('div.cell')
      .data(data)
      .enter()
      .append('div')
      .classed('cell', true);
    d3.select(selector).selectAll('div.cell')
      .data(data)
      .exit()
      .remove();
    d3.select(selector).selectAll('div.cell')
      .data(data)
      .style('display', 'inline-block')
      .text(function (d) {
        return f(scale(d));
      });
  }
  render(data, linear, '#linear');
  render(data, linearCapped, '#linear-capped');
  render(data, pow, '#pow');
  render(data, powCapped, '#pow-capped');
  render(data, log, '#log');
  render(data, logCapped, '#log-capped');
}());

// asyn-data-load.html
(function () {
  var data = [ // <-A
    {
      expense: 10,
      category: 'Retail'
    },
    {
      expense: 15,
      category: 'Gas'
    },
    {
      expense: 30,
      category: 'Retail'
    },
    {
      expense: 50,
      category: 'Dining'
    },
    {
      expense: 80,
      category: 'Gas'
    },
    {
      expense: 65,
      category: 'Retail'
    },
    {
      expense: 55,
      category: 'Gas'
    },
    {
      expense: 30,
      category: 'Dining'
    },
    {
      expense: 20,
      category: 'Retail'
    },
    {
      expense: 10,
      category: 'Dining'
    },
    {
      expense: 8,
      category: 'Gas'
    }
  ];

  function render(data) {
    d3.select('.asyn-data-load').select('#chart').selectAll('div.h-bar')
      .data(data)
      .enter()
      .append('div')
      .attr('class', 'h-bar')
      .append('span');
    d3.select('.asyn-data-load').select('#chart').selectAll('div.h-bar')
      .data(data)
      .exit()
      .remove();
    d3.select('.asyn-data-load').select('#chart').selectAll('div.h-bar')
      .data(data)
      .attr('class', 'h-bar')
      .style('width', function (d) {
        return (d.expense * 5) + 'px';
      })
      .select('span')
      .text(function (d) {
        return d.category;
      });
  }
  render(data);
  document.getElementById('asyn-data-load').addEventListener('click', function (e) {
    d3.json('/scripts/data/asyn-data-load.json', function (error, json) {
      data = data.concat(json);
      render(data)
    })
  });

}());

// data-sort.html
(function () {
  var data = [ // <-A
    {
      expense: 10,
      category: 'Retail'
    },
    {
      expense: 15,
      category: 'Gas'
    },
    {
      expense: 30,
      category: 'Retail'
    },
    {
      expense: 50,
      category: 'Dining'
    },
    {
      expense: 80,
      category: 'Gas'
    },
    {
      expense: 65,
      category: 'Retail'
    },
    {
      expense: 55,
      category: 'Gas'
    },
    {
      expense: 30,
      category: 'Dining'
    },
    {
      expense: 20,
      category: 'Retail'
    },
    {
      expense: 10,
      category: 'Dining'
    },
    {
      expense: 8,
      category: 'Gas'
    }
  ];

  function render(data, comparator) {
    d3.select('body').select('.data-sort').selectAll('div.h-bar')
      .data(data)
      .enter()
      .append('div')
      .attr('class', 'h-bar')
      .append('span');
    d3.select('body').select('.data-sort').selectAll('div.h-bar')
      .data(data)
      .exit()
      .remove();
    d3.select('body').select('.data-sort').selectAll('div.h-bar')
      .data(data)
      .attr('class', 'h-bar')
      .style('width', function (d) {
        return (d.expense * 5) + 'px';
      })
      .select('span')
      .text(function (d) {
        return d.category;
      })
    if (comparator) {
      d3.select('body').select('.data-sort').selectAll('div.h-bar')
        .sort(comparator);
    }
  }
  var compareByExpense = function (a, b) {
    return a.expense < b.expense ? -1 : 1;
  }
  var compareByCategory = function (a, b) {
    return a.category < b.category ? -1 : 1;
  }
  render(data);

  document.getElementById('data-sort').addEventListener('click', function (e) {
    if (e.target) {
      render(data, e.target.value.trim());
    }
  });
})();

// data-filter.html
(function () {
  var data = [ // <-A
    {
      expense: 10,
      category: 'Retail'
    },
    {
      expense: 15,
      category: 'Gas'
    },
    {
      expense: 30,
      category: 'Retail'
    },
    {
      expense: 50,
      category: 'Dining'
    },
    {
      expense: 80,
      category: 'Gas'
    },
    {
      expense: 65,
      category: 'Retail'
    },
    {
      expense: 55,
      category: 'Gas'
    },
    {
      expense: 30,
      category: 'Dining'
    },
    {
      expense: 20,
      category: 'Retail'
    },
    {
      expense: 10,
      category: 'Dining'
    },
    {
      expense: 8,
      category: 'Gas'
    }
  ];

  function render(data, category) {
    d3.select('body').select('.data-filter').selectAll('div.h-bar')
      .data(data)
      .enter()
      .append('div')
      .attr('class', 'h-bar')
      .append('span');
    d3.select('body').select('.data-filter').selectAll('div.h-bar')
      .data(data)
      .exit()
      .remove();
    d3.select('body').select('.data-filter').selectAll('div.h-bar')
      .data(data)
      .attr('class', 'h-bar')
      .style('width', function (d) {
        return (d.expense * 5) + 'px';
      })
      .select('span')
      .text(function (d) {
        return d.category;
      })
    d3.select('body').select('.data-filter').selectAll('div.h-bar')
      .filter(function (d, i) {
        return d.category == category;
      })
      .classed('selected', true);
  }
  render(data);

  document.getElementById('data-filter').addEventListener('click', function (e) {
    if (e.target && e.target.nodeName.toUpperCase() == 'BUTTON') {
      render(data, e.target.textContent.trim());
    }
  });
})();

// working-with-array.html
(function () {
  var array = [3, 2, 11, 7, 6, 4, 10, 8, 15];
  d3.select('.working-with-array').select('#min').text(d3.min(array));
  d3.select('.working-with-array').select('#max').text(d3.max(array));
  d3.select('.working-with-array').select('#extent').text(d3.extent(array));
  d3.select('.working-with-array').select('#sum').text(d3.sum(array));
  d3.select('.working-with-array').select('#median').text(d3.median(array));
  d3.select('.working-with-array').select('#mean').text(d3.mean(array));
  d3.select('.working-with-array').select('#asc').text(array.sort(d3.ascending));
  d3.select('.working-with-array').select('#desc').text(array.sort(d3.descending));
  d3.select('.working-with-array').select('#quantile').text(d3.quantile(array.sort(d3.ascending), .25));
  d3.select('.working-with-array').select('#bisect').text(d3.bisect(array.sort(d3.ascending), 6));

  var records = [{
      quantity: 2,
      total: 190,
      tip: 100,
      type: 'tab'
    },
    {
      quantity: 2,
      total: 190,
      tip: 100,
      type: 'tab'
    },
    {
      quantity: 1,
      total: 300,
      tip: 200,
      type: 'visa'
    },
    {
      quantity: 2,
      total: 90,
      tip: 0,
      type: 'tab'
    },
    {
      quantity: 2,
      total: 90,
      tip: 0,
      type: 'tab'
    },
    {
      quantity: 2,
      total: 90,
      tip: 0,
      type: 'tab'
    },
    {
      quantity: 1,
      total: 100,
      tip: 0,
      type: 'cash'
    },
    {
      quantity: 2,
      total: 90,
      tip: 0,
      type: 'tab'
    },
    {
      quantity: 2,
      total: 90,
      tip: 0,
      type: 'tab'
    },
    {
      quantity: 2,
      total: 90,
      tip: 0,
      type: 'tab'
    },
    {
      quantity: 2,
      total: 200,
      tip: 0,
      type: 'cash'
    },
    {
      quantity: 1,
      total: 200,
      tip: 100,
      type: 'visa'
    }
  ];

  var nest = d3.nest()
    .key(function (d) {
      return d.type;
    })
    .key(function (d) {
      return d.tip;
    })
    .entries(records);
  d3.select('#nest').html(printNest(nest, ''));

  function printNest(nest, out, i) {
    if (i === undefined) {
      i = 0;
    }
    var tab = '';
    for (var j = 0; j < i; j++) {
      tab += ' ';
    }
    nest.forEach(function (e) {
      if (e.key) {
        out += tab + e.key + '<br>';
      } else {
        out += tab + printObject(e) + '<br>';
      }
      if (e.values) {
        out = printNest(e.values, out, ++i);
      } else {
        return out;
      }
    });
    return out;
  }

  function printObject(obj) {
    var s = '{';
    for (var f in obj) {
      s += f + ': ' + obj[f] + ', ';
    }
    s += '}';
    return s;
  }
})();

// function-as-data.html
(function () {
  var data = []; // A
  var next = function (x) { // B
    return 15 + x * x;
  }
  var newData = function () { // C
    data.push(next);
    return data;
  }

  function render() {
    var selection = d3.select('.function-as-data')
      .selectAll('div')
      .data(newData); // D
    selection.enter().append('div').append('span');
    selection.exit().remove();
    selection.attr('class', 'v-bar')
      .style('height', function (d, i) {
        return d(i) + 'px'; // E
      })
      .select('span').text(function (d, i) {
        return d(i); // F
      });
  }
  setInterval(function () {
    render();
  }, 1500000);
  render();
}());

// object-as-data.html
(function () {
  var data = [{
      width: 10,
      color: 23
    },
    {
      width: 15,
      color: 33
    },
    {
      width: 30,
      color: 40
    },
    {
      width: 50,
      color: 60
    },
    {
      width: 80,
      color: 22
    },
    {
      width: 65,
      color: 10
    },
    {
      width: 55,
      color: 5
    },
    {
      width: 30,
      color: 30
    },
    {
      width: 20,
      color: 60
    },
    {
      width: 10,
      color: 90
    },
    {
      width: 8,
      color: 10
    }
  ];
  var colorScale = d3.scaleLinear()
    .domain([0, 100]).range(['#add8e6', 'blue']);

  function render(data) {
    d3.select('.object-as-data').selectAll('div.h-bar')
      .data(data)
      .enter()
      .append('div')
      .attr('class', 'h-bar')
      .append('span');
    // console.log(d3.select('.object-as-data').selectAll('div.h-bar').data(data).exit());
    d3.select('.object-as-data').selectAll('div.h-bar')
      .data(data)
      .exit()
      .remove();
    d3.select('.object-as-data').selectAll('div.h-bar')
      .data(data)
      .attr('class', 'h-bar')
      .style('width', function (d) {
        return (d.width * 5) + 'px';
      })
      .style('background-color', function (d) {
        return colorScale(d.color);
      })
      .select('span')
      .text(function (d) {
        return d.width;
      });
  }

  function randomValue() {
    return Math.round(Math.random() * 100);
  }
  setInterval(function () {
    data.shift();
    data.push({
      width: randomValue(),
      color: randomValue()
    });
    render(data);
  }, 1500);
  render(data);
}());

// array-as-data.html
(function () {
  var data = [10, 15, 30, 50, 80, 65, 55, 30, 20, 10, 8];

  function render(data) {
    d3.select('.array-as-data').selectAll('div.h-bar')
      .data(data)
      .enter()
      .append('div')
      .attr('class', 'h-bar')
      .append('span');

    d3.select('.array-as-data').selectAll('div.h-bar')
      .data(data)
      .style('width', function (d) {
        return (d * 3) + 'px';
      })
      .select('span')
      .text(function (d) {
        return d;
      });

    // console.log(d3.select('.array-as-data').selectAll('div.h-bar').data(data).exit());
    d3.select('array-as-data').selectAll('div.h-bar')
      .data(data)
      .exit()
      .remove();
  }
  setInterval(function () {
    data.shift();
    data.push(Math.round(Math.random() * 100));
    render(data);
  }, 1500);
  render(data);
}());

// raw-function.html
-
function () {
  var rows = d3.select('.raw-selection').selectAll('tr');
  var headerElement = rows._groups[0][0];
  d3.select(headerElement).attr('class', 'table-header');
  d3.select(rows._groups[0][1]).attr('class', 'table-row-odd');
  d3.select(rows._groups[0][2]).attr('class', 'table-row-even');
  d3.select(rows._groups[0][3]).attr('class', 'table-row-odd');
}();

// function-chain.html
+
function () {
  var body = d3.select('body');
  body.select('.function-chain').append('section')
    .attr('id', 'section1')
    .append('div')
    .attr('class', 'blue box')
    .append('p')
    .text('dynamic blue box');
  body.select('.function-chain').append('section')
    .attr('id', 'section2')
    .append('div')
    .attr('class', 'red box')
    .append('p')
    .text('dynamic red box');
}();

// sub-selection.html
void function () {
  d3.select('.sub-selection').select('#section1  div')
    .attr('class', 'blue box');
  d3.select('.sub-selection').select('#section2').select('div')
    .attr('class', 'red box');
}();

// selection-iteration.httml
(function () {
  d3.select('.selection-iteration').selectAll('div')
    .attr('class', 'red box')
    .each(function (d, i) {
      d3.select(this).append('h1').text(i);
    });
}());

// multiple-selection.html
(function () {
  d3.select('.multiple-selection').selectAll('div')
    .attr('class', 'red box');
}());

// single-selection.html
(function () {
  d3.select('.single-selection').select('p#target').text('hello world');
  // attr
  d3.select('.single-selection').select('p#target').attr('foo', 'goo');
  console.log('attr foo:' + d3.select('.single-selection').select('p#target').attr('foo'));
  // classed
  console.log('classed goo:' + d3.select('.single-selection').select('p#target').classed('goo'));
  d3.select('.single-selection').select('p#target').classed('goo', 'true');
  console.log('classed goo:' + d3.select('.single-selection').select('p#target').classed('goo'));
  d3.select('.single-selection').select('p#target').classed('goo', function () {
    return false;
  });
  console.log('classed goo:' + d3.select('.single-selection').select('p#target').classed('goo'));
  // style
  console.log('style font-size:' + d3.select('.single-selection').select('p#target').style('font-size'));
  d3.select('.single-selection').select('p#target').style('font-size', '9px');
  console.log('style font-size:' + d3.select('.single-selection').select('p#target').style('font-size'));
  // text
  console.log('text text:' + d3.select('.single-selection').select('p#target').text());
  d3.select('.single-selection').select('p#target').text('hello');
  console.log('text text:' + d3.select('.single-selection').select('p#target').text());
  // html
  console.log('httml html:' + d3.select('.single-selection').select('p#target').html());
  d3.select('.single-selection').select('p#target').html('<b>Hello</b>');
  console.log('httml html:' + d3.select('.single-selection').select('p#target').text());
})();

// functional-js.html
(function () {
  function SimpleWidget(spec) {
    var instance = {};
    var headline;
    var description;
    instance.render = function () {
      var div = d3.select('body').select('.functional-js').append('div');
      div.append('h3').text(headline);
      div.attr('class', 'box')
        .attr('style', 'color:' + spec.color)
        .append('p')
        .text(description);
      return instance;
    };
    instance.headline = function (h) {
      if (!arguments.length) {
        h
      };
      headline = h;
      return instance;
    };
    instance.description = function (d) {
      if (!arguments.length) {
        d
      };
      description = d;
      return instance;
    };
    return instance;
  }

  var widget = SimpleWidget({
      color: '#6495ed'
    })
    .headline('Simple widget')
    .description('This is a simple widget demonstrating functional javascript.');

  widget.render();
})();

// ===================other====================
/** d3-foo */
(function () {
  // some colour variables
  var tcBlack = '#130C0E';

  // rest of vars
  var w = 960,
    h = 800,
    maxNodeSize = 50,
    x_browser = 20,
    y_browser = 25,
    root;

  var vis;
  var force = d3.forceSimulation();

  vis = d3.select('.d3-foo')
    .attr("width", w)
    .attr("height", h);

  d3.json("/scripts/data/marvel.json", function (json) {

    root = json;
    root.fixed = true;
    root.x = w / 2;
    root.y = h / 4;


    // Build the path
    var defs = vis.insert("svg:defs")
      .data(["end"]);


    defs.enter().append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

    update();
  });


  /**
   *
   */
  function update() {
    var nodes = flatten(root),
      links = d3.hierarchy(root).links(nodes);

    // Restart the force layout.
    force.nodes(nodes)
      // .force(links)
      .force("charge", d3.forceManyBody().strength(-1500))
      // .linkDistance(100)
      .force('velocityDecay', function () {
        return 0.5;
      })
      // .linkStrength(function (l, i) { return 1; })
      .force("link", d3.forceLink().id(function (d) {
        return d.id;
      }))
      .force('x', d3.forceX(function (d) {
        return h
      }).strength(0.05))
      .force('y', d3.forceY(function (d) {
        return h
      }).strength(0.05))
      .on("tick", tick)
      .restart();

    var path = vis.selectAll("path.link")
      .data(links, function (d) {
        return d.target.id;
      });

    path.enter()
      .insert("svg:path")
      .attr("class", "link")
      // .attr("marker-end", "url(#end)")
      .style("stroke", "#eee");


    // Exit any old paths.
    path.exit().remove();



    // Update the nodes…
    var node = vis.selectAll("g.node")
      .data(nodes, function (d) {
        return d.id;
      });


    // Enter any new nodes.
    var nodeEnter = node.enter()
      .append("svg:g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .on("click", click)
      .call(d3.drag()
        // .on("start", dragstarted)
        .on("drag", dragged)
        // .on("end", dragended)
      );

    // Append a circle
    nodeEnter.append("svg:circle")
      .attr("r", function (d) {
        return Math.sqrt(d.size) / 10 || 4.5;
      })
      .style("fill", "#eee");


    // Append images
    var images = nodeEnter.append("svg:image")
      .attr("xlink:href", function (d) {
        return d.img;
      })
      .attr("x", function (d) {
        return -25;
      })
      .attr("y", function (d) {
        return -25;
      })
      .attr("height", 50)
      .attr("width", 50);

    // make the image grow a little on mouse over and add the text details on click
    var setEvents = images
      // Append hero text
      .on('click', function (d) {
        d3.select("h1").html(d.hero);
        d3.select("h2").html(d.name);
        d3.select("h3").html("Take me to " + "<a href='" + d.link + "' >" + d.hero + " web public ⇢" + "</a>");
      })

      .on('mouseenter', function () {
        // select element in current context
        d3.select(this)
          .transition()
          .attr("x", function (d) {
            return -60;
          })
          .attr("y", function (d) {
            return -60;
          })
          .attr("height", 100)
          .attr("width", 100);
      })
      // set back
      .on('mouseleave', function () {
        d3.select(this)
          .transition()
          .attr("x", function (d) {
            return -25;
          })
          .attr("y", function (d) {
            return -25;
          })
          .attr("height", 50)
          .attr("width", 50);
      });

    // Append hero name on roll over next to the node as well
    nodeEnter.append("text")
      .attr("class", "nodetext")
      .attr("x", x_browser)
      .attr("y", y_browser + 15)
      .attr("fill", tcBlack)
      .text(function (d) {
        return d.hero;
      });


    // Exit any old nodes.
    node.exit().remove();


    // Re-select for update.
    path = vis.selectAll("path.link");
    node = vis.selectAll("g.node");

    function tick() {


      path.attr("d", function (d) {

        var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," +
          d.source.y +
          "A" + dr + "," +
          dr + " 0 0,1 " +
          d.target.x + "," +
          d.target.y;
      });
      node.attr("transform", nodeTransform);
    }
  }


  /**
   * Gives the coordinates of the border for keeping the nodes inside a frame
   * http://bl.ocks.org/mbostock/1129492
   */
  function nodeTransform(d) {
    d.x = Math.max(maxNodeSize, Math.min(w - (d.imgwidth / 2 || 16), d.x));
    d.y = Math.max(maxNodeSize, Math.min(h - (d.imgheight / 2 || 16), d.y));
    return "translate(" + d.x + "," + d.y + ")";
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
      if (node.children)
        node.children.forEach(recurse);
      if (!node.id)
        node.id = ++i;
      nodes.push(node);
    }

    recurse(root);
    return nodes;
  }

  function dragstarted(d) {
    if (!d3.event.active) force.alphaTarget(0.3).restart()
    force.fix(d);
  }

  function dragged(d) {
    force.fix(d, d3.event.x, d3.event.y);
  }

  function dragended(d) {
    if (!d3.event.active) force.alphaTarget(0);
    force.unfix(d);
  }

})();


/** Solar Path */
(function () {
  require('./d3-utils-solar-calculator');
  //
  var svg = d3.select('svg.solar'),
    width = +svg.attr('width'),
    height = +svg.attr('height'),
    scale = width * .45;

  var formatTime = d3.timeFormat('%-I %p'),
    formatNumber = d3.format('.1f'),
    formatAngle = function (d) {
      return formatNumber(d) + '°';
    };

  var projection = d3.geoProjection(flippedStereographic)
    .scale(scale)
    .clipAngle(130)
    .rotate([0, -90])
    .translate([width / 2 + .5, height / 2 + .5])
    .precision(.1);

  var path = d3.geoPath()
    .projection(projection);

  svg.append('path')
    .datum(d3.geoCircle().center([0, 90]).radius(90))
    .attr('class', 'horizon')
    .attr('d', path);

  svg.append('path')
    .datum(d3.geoGraticule())
    .attr('class', 'graticule')
    .attr('d', path);

  var ticksAzimuth = svg.append('g')
    .attr('class', 'ticks ticks--azimuth');

  ticksAzimuth.selectAll('line')
    .data(d3.range(360))
    .enter().append('line')
    .each(function (d) {
      var p0 = projection([d, 0]),
        p1 = projection([d, d % 10 ? -1 : -2]);

      d3.select(this)
        .attr('x1', p0[0])
        .attr('y1', p0[1])
        .attr('x2', p1[0])
        .attr('y2', p1[1]);
    });

  ticksAzimuth.selectAll('text')
    .data(d3.range(0, 360, 10))
    .enter().append('text')
    .each(function (d) {
      var p = projection([d, -4]);

      d3.select(this)
        .attr('x', p[0])
        .attr('y', p[1]);
    })
    .attr('dy', '.35em')
    .text(function (d) {
      return d === 0 ? 'N' : d === 90 ? 'E' : d === 180 ? 'S' : d === 270 ? 'W' : d + '°';
    });

  svg.append('g')
    .attr('class', 'ticks ticks--elevation')
    .selectAll('text')
    .data(d3.range(10, 91, 10))
    .enter().append('text')
    .each(function (d) {
      var p = projection([0, d]);

      d3.select(this)
        .attr('x', p[0])
        .attr('y', p[1]);
    })
    .attr('dy', '.35em')
    .text(function (d) {
      return d + '°';
    });

  navigator.geolocation.getCurrentPosition(located);

  function located(geolocation) {
    var solar = solarCalculator([geolocation.coords.longitude, geolocation.coords.latitude]);

    d3.select('#waiting').transition()
      .style('opacity', 0)
      .remove();

    svg.insert('path', '.sphere')
      .attr('class', 'solar-path');

    var sun = svg.insert('g', '.sphere')
      .attr('class', 'sun');

    sun.append('circle')
      .attr('r', 5);

    sun.append('text')
      .attr('class', 'sun-label sun-label--azimuth')
      .attr('dy', '.71em')
      .attr('y', 10);

    sun.append('text')
      .attr('class', 'sun-label sun-label--elevation')
      .attr('dy', '1.81em')
      .attr('y', 10);

    var tickSun = svg.insert('g', '.sphere')
      .attr('class', 'ticks ticks--sun')
      .selectAll('g');

    refresh();

    setInterval(refresh, 1000);

    function refresh() {
      var now = new Date,
        start = d3.timeDay.floor(now),
        end = d3.timeDay.offset(start, 1);

      svg.select('.solar-path')
        .datum({
          type: 'LineString',
          coordinates: d3.timeMinutes(start, end).map(solar.position)
        })
        .attr('d', path);

      sun
        .datum(solar.position(now))
        .attr('transform', function (d) {
          return 'translate(' + projection(d) + ')';
        });

      sun.select('.sun-label--azimuth')
        .text(function (d) {
          return formatAngle(d[0]) + ' φ';
        });

      sun.select('.sun-label--elevation')
        .text(function (d) {
          return formatAngle(d[1]) + ' θ';
        });

      tickSun = tickSun
        .data(d3.timeHours(start, end), function (d) {
          return +d;
        });

      tickSun.exit().remove();

      var tickSunEnter = tickSun.enter().append('g')
        .attr('transform', function (d) {
          return 'translate(' + projection(solar.position(d)) + ')';
        });

      tickSunEnter.append('circle')
        .attr('r', 2.5);

      tickSunEnter.append('text')
        .attr('dy', '-.31em')
        .attr('y', -6)
        .text(formatTime);
    }
  }

  d3.select(self.frameElement).style('height', height + 'px');

  function flippedStereographic(λ, φ) {
    var cosλ = Math.cos(λ),
      cosφ = Math.cos(φ),
      k = 1 / (1 + cosλ * cosφ);
    return [
      k * cosφ * Math.sin(λ), -k * Math.sin(φ)
    ];
  }
}) //();

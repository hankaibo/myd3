(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['d3'], factory);
  } else if (typeof exports === 'object' && module.exports) {
    module.exports = factory(require('d3'));
  } else {
    root.returnExports = factory(root.d3);
  }
} (this, function (d3) {
  var w = 0,
    h = 0,
    ratio = 0,
    maxAge = 120,
    ABS_MAX = 200,
    force, force2, nodes, links;
  function initLifespanFlower() {
    $("#about").dialog({
      autoOpen: !1,
      show: "blind",
      hide: "explode",
      width: 800,
      height: 600
    });
    var a = {};
    unfiltered_data.nodes.forEach(function (c, b) {
      0 != b && (a[c["class"]] = !0)
    });
    var b = "";
    d3.map(a).keys().forEach(function (a) {
      b += "<input type='checkbox' value='" + a + "' id='" + a + "' name='chartOption'";
      "mammalia" == a && (b += " checked='checked'");
      b += "/><label for='" + a + "'>" + a + "</label>"
    });
    $("#chartSelector").html(b);
    $("#chartSelector").buttonset();
    $("#chartSelector").change(function (a) {
      drawChart()
    });
    drawChart();
    $("#slider").slider({
      change: maxAgeChange,
      min: 10,
      max: ABS_MAX,
      value: maxAge
    })
  }
  function drawChart() {
    null != d3.select("#graph") && d3.select("#graph").remove();
    null != force && force.stop();
    null != force2 && force2.stop();
    nodes = [];
    links = [];
    w = $("#graphHolder").width();
    h = $("#graphHolder").height();
    ratio = w > h ? h / (2 * maxAge) : w / (2 * maxAge);
    var a = w / 2 + 150,
      b = h / 2,
      c = Math.round($("#species_information").position().top - $("#toolbox").position().top),
      c = $("#toolbox").height() - c - 10;
    $("#species_information").css("height", c + "px");
    c = d3.select("#graphHolder").append("svg:svg").attr("id", "graph").attr("width", w).attr("height", h);
    drawReference(c, a, b);
    var e = [],
      g = [],
      k = {},
      d = 0;
    unfiltered_data.nodes.forEach(function (l, a) {
      if (0 == a || null != $("#" + l["class"]).attr("checked")) e.push(l),
        k[a] = d,
        d++
    });
    unfiltered_data.links.forEach(function (a, b) {
      null != k[a.source] && g.push({
        source: k[a.source],
        target: a.target,
        age: a.age
      })
    });
    var f = e[0];
    f.fixed = !0;
    f.x = a;
    f.y = b;
    force = d3.layout.force().charge(- 30).linkDistance(function (a) {
      return ratio * a.age
    }).size([w, h]).gravity(0).nodes(e).links(g).start();
    links = c.append("g").attr("class", "linkContainer").selectAll(".link").data(g).enter().append("line").attr("class", "link");
    nodes = c.append("g").attr("class", "nodeContainer").selectAll(".node").data(e).enter().append("image").call(force.drag).attr("xlink:href",
      function (a) {
        return getImageName(a.name)
      }).attr("id",
      function (a) {
        return a.name
      }).attr("class", "image").attr("x", -25).attr("y", -25).attr("width", 50).attr("height", 50).attr("cursor", "pointer").on("click",
      function (a) {
        showInformation(a.name, a.species, a.age)
      });
    $("svg image").tipsy({
      gravity: "w",
      html: !0,
      title: function () {
        var a = this.__data__;
        return "<span class='floatingp'>" + a.name + "</span><br/>Max. recorded age: <b>" + a.age + " years</b><br/>(click for more info)"
      }
    });
    c.select("#root").style("cx", a).style("cy", b).style("fill", "black").attr("r", 1).on("mousedown.drag", null).on("mouseover", null);
    force.on("tick",
      function () {
        links.attr("x1",
          function (a) {
            return a.source.x
          }).attr("y1",
          function (a) {
            return a.source.y
          }).attr("x2",
          function (a) {
            return a.target.x
          }).attr("y2",
          function (a) {
            return a.target.y
          });
        nodes.attr("transform",
          function (a) {
            return "translate(" + a.x + "," + a.y + ")"
          })
      })
  }
  function maxAgeChange(a, b) {
    maxAge = b.value;
    drawChart()
  }
  function about() {
    $("#about").dialog("open");
    return !1
  }
  function showInformation(a, b, c) {
    var e = "http://en.m.wikipedia.org/wiki/" + a.replace(/\./g, "").replace(" ", "_").replace("-", "_");
    $("#species_information").html("<p><b>" + a + "</b> (<i><a href='" + e + "'>" + b + "</a></i>)<br/>Max recorded age: <b>" + c + " years</b></p><iframe id='wikiframe' src='" + e + "' width='100%' frameborder='0'></iframe>");
    a = Math.round($("#wikiframe").position().top - $("#species_information").position().top);
    a = $("#species_information").height() - a - 10;
    $("#wikiframe").css("height", a + "px")
  }
  function getImageName(a) {
    a = a.toLowerCase().replace(/[ -]/g, "_");
    return "./image/" + a + ".png"
  }
  function drawReference(a, b, c) {
    a = a.append("g").attr("id", "referenceGroup").attr("class", "referenceGroup");
    for (var e = d3.scale.linear().domain([0, ABS_MAX]).range([d3.rgb(100, 80, 30), "lightyellow"]), g = d3.scale.linear().domain([0, ABS_MAX]).range([d3.rgb(200, 150, 150), "darkred"]), k = Math.round(0.1 * maxAge), d = ABS_MAX; 0 < d; d -= k) {
      var f = ratio * d,
        l = g(d),
        m = e(d);
      a.append("circle").attr("class", "reference").attr("cx", b).attr("cy", c).attr("r", f).style("fill", m).style("stroke", "gray").style("stroke-width", "1px");
      a.append("svg:text").text(d).attr("x", b + f - 5 + 1).attr("y", c + 1).style("fill", "black");
      a.append("svg:text").text(d).attr("x", b + f - 5).attr("y", c).style("fill", l);
      a.append("svg:text").text(d).attr("x", b - f - 5 + 1).attr("y", c + 1).style("fill", "black");
      a.append("svg:text").text(d).attr("x", b - f - 5).attr("y", c).style("fill", l)
    }
  };
}));

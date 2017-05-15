var d3 = require('d3');
var force = require('../common/d3-force2');

var mockData = {
  "name": "marvel",
  "title": "主体企业",
  "img": "./img/home.png",
  "grade": "A",
  "size": 90000,
  "children": [{
      "name": "Heroes",
      "title": "关联企业",
      "img": "./img/1.png",
      "grade": "A",
      "children": [{
          "hero": "Spider-Man",
          "name": "Peter Benjamin Parker",
          "title": "企业法人",
          "link": "http://marvel.com/characters/54/spider-man",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 160000
        },
        {
          "hero": "CAPTAIN MARVEL",
          "name": "Carol Danvers",
          "title": "企业法人",
          "link": "http://marvel.com/characters/9/captain_marvel",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "HULK",
          "name": "Robert Bruce Banner",
          "title": "企业法人",
          "link": "http://marvel.com/characters/25/hulk",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Black Widow",
          "name": "Natalia 'Natasha' Alianovna Romanova",
          "title": "企业法人",
          "link": "http://marvel.com/characters/6/black_widow",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Daredevil",
          "name": "Matthew Michael Murdock",
          "title": "企业法人",
          "link": "http://marvel.com/characters/11/daredevil",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Wolverine",
          "name": "James Howlett",
          "title": "企业法人",
          "link": "http://marvel.com/characters/66/wolverine",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Captain America",
          "name": "Steven Rogers",
          "title": "企业法人",
          "link": "http://marvel.com/characters/8/captain_america",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Iron Man",
          "name": "Anthony Edward 'Tony' Stark",
          "title": "企业法人",
          "link": "http://marvel.com/characters/29/iron_man",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "THOR",
          "name": "Thor Odinson",
          "title": "企业法人",
          "link": "http://marvel.com/characters/60/thor",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        }
      ]
    },
    {
      "name": "Villains",
      "title": "关联企业",
      "img": "./img/1.png",
      "grade": "A",
      "children": [{
          "hero": "Dr. Doom",
          "name": "Victor von Doom",
          "title": "企业法人",
          "link": "http://marvel.com/characters/13/dr_doom",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Mystique",
          "name": "Unrevealed",
          "title": "企业法人",
          "link": "http://marvel.com/characters/1552/mystique",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Red Skull",
          "name": "Johann Shmidt",
          "title": "企业法人",
          "link": "http://marvel.com/characters/1901/red_skull",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Ronan",
          "name": "Ronan",
          "title": "企业法人",
          "link": "http://marvel.com/characters/49/ronan",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Magneto",
          "name": "Max Eisenhardt",
          "title": "企业法人",
          "link": "http://marvel.com/characters/35/magneto",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Thanos",
          "name": "Thanos",
          "title": "企业法人",
          "link": "http://marvel.com/characters/58/thanos",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Black Cat",
          "name": "Felicia Hardy",
          "title": "企业法人",
          "link": "http://marvel.com/characters/271/black_cat",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        }
      ]
    },
    {
      "name": "Teams",
      "title": "关联企业",
      "img": "./img/1.png",
      "grade": "B",
      "children": [{
          "hero": "Avengers",
          "name": "",
          "title": "企业法人",
          "link": "http://marvel.com/characters/68/avengers",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Guardians of the Galaxy",
          "name": "",
          "title": "企业法人",
          "link": "http://marvel.com/characters/70/guardians_of_the_galaxy",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Defenders",
          "name": "",
          "title": "企业法人",
          "link": "http://marvel.com/characters/534/defenders",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "X-Men",
          "name": "",
          "title": "企业法人",
          "link": "http://marvel.com/characters/71/x-men",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Fantastic Four",
          "name": "",
          "title": "企业法人",
          "link": "http://marvel.com/characters/69/fantastic_four",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Inhumans",
          "name": "",
          "title": "企业法人",
          "link": "http://marvel.com/characters/1040/inhumans",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        }
      ]
    },
    {
      "name": "Villains2",
      "title": "关联企业",
      "img": "./img/1.png",
      "grade": "A",
      "children": [{
          "hero": "Dr. Doom",
          "name": "Victor von Doom",
          "title": "企业法人",
          "link": "http://marvel.com/characters/13/dr_doom",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Mystique",
          "name": "Unrevealed",
          "title": "企业法人",
          "link": "http://marvel.com/characters/1552/mystique",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Red Skull",
          "name": "Johann Shmidt",
          "title": "企业法人",
          "link": "http://marvel.com/characters/1901/red_skull",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Ronan",
          "name": "Ronan",
          "title": "企业法人",
          "link": "http://marvel.com/characters/49/ronan",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Magneto",
          "name": "Max Eisenhardt",
          "title": "企业法人",
          "link": "http://marvel.com/characters/35/magneto",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Thanos",
          "name": "Thanos",
          "title": "企业法人",
          "link": "http://marvel.com/characters/58/thanos",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Black Cat",
          "name": "Felicia Hardy",
          "title": "企业法人",
          "link": "http://marvel.com/characters/271/black_cat",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        }
      ]
    },
    {
      "name": "Teams2",
      "title": "关联企业",
      "img": "./img/1.png",
      "grade": "C",
      "children": [{
          "hero": "Avengers",
          "name": "",
          "title": "企业法人",
          "link": "http://marvel.com/characters/68/avengers",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Guardians of the Galaxy",
          "name": "",
          "title": "企业法人",
          "link": "http://marvel.com/characters/70/guardians_of_the_galaxy",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Defenders",
          "name": "",
          "title": "企业法人",
          "link": "http://marvel.com/characters/534/defenders",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "X-Men",
          "name": "",
          "title": "企业法人",
          "link": "http://marvel.com/characters/71/x-men",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Fantastic Four",
          "name": "",
          "title": "企业法人",
          "link": "http://marvel.com/characters/69/fantastic_four",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        },
        {
          "hero": "Inhumans",
          "name": "",
          "title": "企业法人",
          "link": "http://marvel.com/characters/1040/inhumans",
          "img": "./img/avator.png",
          "grade": "C",
          "size": 40000
        }
      ]
    }
  ]
};
d3.select('#demo').call(force()
  .value(mockData) // 需要的数据
  .legendTitle('我是图例title')
  .legendDomain(['A', 'B', 'C', 'D']) // 图例文本说明
  .legendRange(['#008ef2', '#25c12a', '#ffa026', '#ff6705']) // 图例文本对应的颜色
);

// command to run: node index.js
// command to run: node getLowestPrice.js
var request = require("request");
var cheerio = require("cheerio");
var fs = require('fs')

var url = "https://www.foodpanda.com.tw/restaurant/z5oy/pizza-hut--184";

var headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'
}

var login_options = {
  url,
  headers
}

var r = request(login_options, (error, response, body) =>  {
  if (error) throw error;

  var $ = cheerio.load(body);

  // 取得 dish category title
  // var dct = $('.dish-category-title');
  // for(var i = 0; i < dct.length; i++) {
  //   console.log(dct.eq(i).text());
  // }

  var dishName = $('[data-menu-category-id=\'656027\']');
  for(var i = 0; i < dishName.length; i++){
    console.log(dishName.eq(i).find('.dish-name span').text());
  }  
  

  // var whereWrapper = $(".where-wrapper");
  // var dataVendor = JSON.parse($(whereWrapper[0]).attr('data-vendor'));
  // console.log(dataVendor.toppings);
  // writeIntoJSON('toppings.json', dataVendor.toppings)
  // writeIntoJSON('menu.json', dataVendor.menus)
  
})

function writeIntoJSON(fileName, content) {
  fs.writeFile(fileName, JSON.stringify(content), (err) => {
    if(err) throw err
    return
  })
  
}
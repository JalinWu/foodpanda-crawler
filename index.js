// command to run: node index.js
// command to run: node getLowestPrice.js
var request = require("request");
var cheerio = require("cheerio");
var fs = require('fs')

var url = "https://www.foodpanda.com.tw/restaurant/f6jb/chao-wei-jue-tang-lu-he-zuo-she-tai-bei-dong-hu-fen-she";

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

  var menu = new Array();
  var menuData = new Object();

  var dishControlHolder = $('.dish-control-holder li');
  var menu_categories = new Array();
  for(var i = 0;i < dishControlHolder.length; i ++) {
    // console.log(dishControlHolder.eq(i).find('a').attr('data-id'));
    var menu_category = new Object();
    menu_category.id = dishControlHolder.eq(i).find('a').attr('data-id');
    menu_category.name = dishControlHolder.eq(i).find('a').attr('title');

    var dataMenuCategoryId= $(`[data-menu-category-id=${menu_category.id}]`);
    var products = new Array();
    for(var j = 0; j < dataMenuCategoryId.length; j++) {
      var product = new Object();
      product = JSON.parse(dataMenuCategoryId.eq(j).attr('data-object'));
      products.push(product);
    }
    menu_category.products = products;

    menu_categories.push(menu_category);

  }  
  // console.log(menu_categories);
  menuData.menu_categories = menu_categories;
  menu.push(menuData);
  writeIntoJSON('menu.json', menu);
   
  

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
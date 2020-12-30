// command to run: node index.js
// command to run: node getLowestPrice.js
const request = require("request");
const cheerio = require("cheerio");
const fs = require('fs')

const url = "https://www.foodpanda.com.tw/restaurant/d6ek/da-hu-guo-yin-tai-bei-nan-gang-dian";

// 模擬用瀏覽器，避免爬蟲被擋
const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'
}

// request 套件所需參數
const login_options = {
  url,
  headers
}

var r = request(login_options, (error, response, body) =>  {
  if (error) throw error;

  var $ = cheerio.load(body);
  
  var menu = new Array();
  var menuData = new Object();

  // 店家名稱
  var vendorName = $('.vendor-info-main-headline').text().trim();
  menuData.vendor_name = vendorName; 

  // 大圖
  var bgImg = $('.vendor-header').find('.hero-banner').attr('data-src').split('|')[0];
  menuData.bgImg = bgImg; 

  // 菜單
  var dishControlHolder = $('.dish-control-holder li');
  var menu_categories = new Array();

  for(var i = 0;i < dishControlHolder.length; i++) {
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

  // toppings
  var dataVendor = $('.vendor-section').attr('data-vendor');
  writeIntoJSON('toppings.json', JSON.parse(dataVendor).toppings);
  
})

function writeIntoJSON(fileName, content) {
  fs.writeFile(fileName, JSON.stringify(content), (err) => {
    if(err) throw err
    return
  })
  
}
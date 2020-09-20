// command to run: node index.js
var request = require("request");
var cheerio = require("cheerio");
var fs = require('fs')

var url = "https://www.foodpanda.com.tw/restaurant/y9ap/sukijia-sukiya-hu-zhou-dian";

var r = request(url, (error, response, body) =>  {
  if (error) throw error;

  var $ = cheerio.load(body);
  var items = new Array();
  

  var dishes = $(".dish-card");

  for(var i = 0; i < $(dishes).length; i++){
    var item = new Object(); 
    
    item.name = $(dishes[i]).find('.dish-name').text().trim();
    item.desc = $(dishes[i]).find('.dish-description').text().trim();
    item.price = $(dishes[i]).find('.price').text().trim().split(' ').slice(-1)[0];
    
    // modal selection
    var dataObject = JSON.parse($(dishes[i]).attr('data-object'));
    item.addition = new Array();
    dataObject.product_variations.forEach(e => {
      var DataObject = new Object();
      DataObject.name = e.name;
      DataObject.price = e.price;
      // DataObject.choices = e.choices;
      // DataObject.toppings = e.toppings;
      DataObject.topping_ids = e.topping_ids;
      item.addition.push(DataObject)
    });


    items.push(item);
    // console.log(item.addition);
    
  }
  // console.log(items)
  // writeIntoJSON('menu.json', items)

  var whereWrapper = $(".where-wrapper");
  var dataVendor = JSON.parse($(whereWrapper[0]).attr('data-vendor'));
  console.log(dataVendor.toppings);
  writeIntoJSON('toppings.json', dataVendor.toppings)
  writeIntoJSON('menu.json', dataVendor.menus)
  
})

function writeIntoJSON(fileName, content) {
  fs.writeFile(fileName, JSON.stringify(content), (err) => {
    if(err) throw err
    return
  })
  
}
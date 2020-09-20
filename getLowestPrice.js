const fs = require('fs');

fs.readFile('menu.json', (err, data) => {
    // console.log(data.toString());
    const JSONdata = JSON.parse(data.toString())

    console.log(JSONdata[0].menu_categories[0].products[0].product_variations[0].price)
    var menu_categories = JSONdata[0].menu_categories;

    for (var i = 0; i < menu_categories.length; i++) {
        for (var j = 0; j < menu_categories[i].products.length; j++) {
            var lowestPrice = 100000;
            for (var k = 0; k < menu_categories[i].products[j].product_variations.length; k++) {
                var currentPrice = menu_categories[i].products[j].product_variations[k].price
                if (currentPrice < lowestPrice)
                    lowestPrice = currentPrice;
            }
            menu_categories[i].products[j].lowestPrice = lowestPrice;
        }
    }

    JSONdata[0].menu_categories = menu_categories;
    fs.writeFile('menu.json', JSON.stringify(JSONdata), (err) => {
        if (err) throw err
        return
    })
})
var mysql = require ('mysql');
var inquirer = require ('inquirer');
var selectionArry = [];

    function ChosenItem (id, name, qtyAvailable, price) {
        this.id = id,
        this.name = name,
        this.qtyAvailable = qtyAvailable,
        this.price = price
        // this.qtySelected = qtySelected,
        // this.cost =  this.qtySelected * this.price
        };
var newChosenItem = new ChosenItem(0, "test", 0, 0);

var connection = mysql.createConnection ({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazonDB"
});

connection.connect (function (err){
   if (err) throw err;
   console.log("Connected at ", connection.threadId);

});

var displayInventory = function(){
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res){
        if (err) throw err;
        console.log("Inventory available for purchase\n");
    //    res.forEach(e => console.log("Item ID:", e.item_id,"| Product Name: ", e.product_name, "| Department: ", e.department_name, "| Price: ", e.price, "| Stock Quantity: ", e.stock_quantity, "\n"));
       for (i = 0; i < res.length; i++) {
        console.log("Item ID:", res[i].item_id,"| Product Name: ", res[i].product_name, "| Department: ", res[i].department_name, "| Price: ", res[i].price, "| Stock Quantity: ", res[i].stock_quantity, "\n");
        
           
                selectionArry.push(res[i].product_name);
 
    
        }; 
        inventoryBrowse();
    })
  
};

displayInventory();



function inventoryBrowse(){
   
    inquirer.prompt ([
        {
         name: "selection",   
         type: "list",
         message: "Please select the product that you will purchase.",
         choices: selectionArry
        }
        // {
        //     name: "quantityRequest",   
        //     type: "intput",
        //     message: "How many do you want to order?",
        //    }
    ]).then(answer => 
            {var query = "SELECT product_name, stock_quantity, price FROM products WHERE ?";
            connection.query(query, {product_name: answer.selection}, function(err, res) {
                if (err) throw err;
                for (i = 0; i < res.length; i++) {
                    console.log("Product: " + res[i].product_name + " || Quantity in Stock: " + res[i].stock_quantity + " || Price: " + res[i].price);
                    if(res[i].stock_quantity === 0){
                        console.log("sorry, that product is sold out.");
                        inventoryBrowse();
                    }
                    else {
                       var newChosenItem2 = new ChosenItem(res[i].item_id, res[i].product_name, res[i].stock_quantity, res[i].price);
                       newChosenItem = newChosenItem2
                       console.log("new Item: ", newChosenItem);
                        selectQuantity();
                    };
                };
                
            });
        }

    );
            
    };
 


    function selectQuantity(){
   
        inquirer.prompt ([
            {
             name: "quantityRequest",   
             type: "number",
             message: "How many do you want to order?",
            }
            ]).then(answer => {
                if(answer.quantityRequest > newChosenItem.qtyAvailable){
                    console.log("Sorry, there are only", newChosenItem.qtyAvailable, "in stock.\n Please order again.");
                    selectQuantity();
                }

                if (answer.quantityRequest <= newChosenItem.qtyAvailable){
                    this.qtySelected;
                    this.cost;
                    this.qtySelected = parseInt(answer.quantityRequest);
                    this.cost = this.qtySelected * newChosenItem.price;
                    console.log("Your price will be", this.cost);
                    var newQuantity = newChosenItem.qtyAvailable - this.qtySelected;
                    var query = "UPDATE products SET stock_quantity =" + newQuantity + " WHERE product_name ="+ "'" + newChosenItem.name + "'";
                    connection.query(query, function(err, res)
                        {
                    if (err) throw err;
                    
                    });

                var query2 = "Select stock_quantity FROM products Where product_name =" + "'" + newChosenItem.name + "'";
                connection.query(query2, function(err, res){
                    for (i = 0; i < res.length; i++){
                        if (res[i].product_name = newChosenItem.name){
                            console.log("Amt. left in stock:", res[i].stock_quantity );
                            connection.end();
                        }
                    }

                })
                
                
            }

       
        
            })}

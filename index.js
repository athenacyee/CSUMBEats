const express = require("express");
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');


const app = express();
const pool = dbConnection();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))

function isAuthenticated(req, res, next){
  if (!req.session.authenticated) {
    res.redirect("login");
  } else {
    next();
  }
}

//home
app.get('/',  (req, res) => {
  res.render('home')
});

//log in 
app.get('/login',  (req, res) => {
  res.render('login')
});

app.post('/login', async (req, res) => {
  let username = req.body.username;
  let userPassword = req.body.password;
  let hashedpassword = "";
  let sql = `SELECT * FROM users WHERE username = ?`;
  let rows = await executeSQL(sql, [username]);
  
  if (rows.length > 0) {
    hashedpassword = rows[0].password;
  }

  let passwordMatch = await bcrypt.compare(userPassword, hashedpassword);

  if (passwordMatch) {
    req.session.authenticated = true;
    res.redirect('updateProduct');
  } else {
    res.render('home');
  }
  //res.send(`${username} / ${userPassword}`);
});


app.get('/logout', (req, res) => {
  req.session.authenticated = false;
  req.session.destroy();
  res.redirect('login');
});

// admin update product
app.get('/updateProduct',isAuthenticated,async (req,res) => {
  let product_id = req.query.product_id;
  let name = req.query.name;
  let price = req.query.price;
  let description = req.query.description;
  let stock = req.query.stock;
  let image = req.query.image;

  let sql = `SELECT * from p_food`;
  let rows = await executeSQL(sql);
  res.render("updateProduct", {"product":rows});
});

app.put('/api/productInfo', async(req, res) => {
   let product_id = req.query.product_id;
   let name = req.body.name;
   let price = req.body.price;
   let description = req.body.description;
  let stock = req.body.stock;
  let image = req.body.image;
   
  let sql = `update p_food set 
    name = ?,
    price = ?,
    description = ?,
    stock = ?,
    image =? 
    WHERE product_id = ?`;
  let params = [name, price, description, stock,image,  product_id];
  let rows = await executeSQL(sql,params);
  res.sendStatus(200);
});


//admin add product
app.get('/addProduct',  isAuthenticated, (req, res) => {
  res.render('addProduct')
});
app.post('/product/new', async(req, res) => {
  let name = req.body.name;
  let price = req.body.price;
  let description = req.body.description;
  let stock = req.body.stock;
  let image = req.body.image;

  let sql = `INSERT INTO p_food (name, price, description, stock, image) VALUES (?,?,?,?,? )`;
  let params = [name, price, description, stock, image];
  let rows = await executeSQL(sql, params);
  //console.log(params); 
  res.render('addProduct');
}); 

//productList
app.get('/productList',  async (req, res) => {
  let product_id = req.query.product_id;
  let name = req.query.name;
  let price = req.query.price;
  let description = req.query.description;
  let stock = req.query.stock;
  let image = req.query.image;

  let sql = `SELECT * from p_food`;
  let rows = await executeSQL(sql);
  
  res.render('productList',{"product":rows});
});

//shopping cart
app.get('/shoppingCart',  async (req, res) => {
  let product_id = req.query.product_id;
  let name = req.query.name;
  let price = req.query.price;
  let quantity = req.query.quantity;
  let image = req.query.image;

  let sql = `SELECT * from p_order natural join p_food`;
  let rows = await executeSQL(sql);

  res.render('shoppingCart',{"product":rows});
});

// update stock
app.put('/shoppingCart', async (req, res) => {
  let product_id = req.body.product_id;
  let quantity = req.body.quantity;
  //let stock = req.query.stock;
  let sql = `UPDATE p_food 
             set stock = stock - ?
             WHERE product_id = ?`;
  let params = [quantity, product_id];
  let rows = await executeSQL(sql,params);
  res.sendStatus(200);
});

//delete order data
app.delete('/shoppingCart', async(req, res) => {
  let sql = `DELETE from p_order`;
  let rows = await executeSQL(sql);
  res.send(rows);
})

//productDetails
app.get('/api/productInfo', async (req, res) => {
   //searching quotes by authorId
   let product_id = req.query.product_id;
   let sql = `SELECT *
              FROM p_food
              WHERE product_id = ${product_id}`;
   let rows = await executeSQL(sql);
   //console.log(author_id);
   res.send(rows);
});


app.post('/api/productInfo', async (req, res) => {
  let data = req.body;
  let sql = `INSERT INTO p_order 
                values(?, ?)
              ON DUPLICATE KEY UPDATE
              quantity = ?
            `;
  let rows = [data.product_id, data.quantity, data.quantity];
  let result = await executeSQL(sql, rows);

  res.send(result);
});


app.get("/dbTest", async function(req, res){
let sql = "SELECT CURDATE()";
let rows = await executeSQL(sql);
res.send(rows);
});//dbTest

//functions
async function executeSQL(sql, params){
  return await new Promise (function (resolve, reject) {
    pool.query(sql, params, function (err, rows, fields) {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}//executeSQL
//values in red must be updated
function dbConnection(){

   const pool  = mysql.createPool({

      connectionLimit: 10,
      host: "x8autxobia7sgh74.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "ran97hupkcdzknyj",
      password: "gx5i94vnznn94e65",
      database: "kqakin83hpdewgwh"


   }); 

   return pool;

} //dbConnection

//start server
app.listen(3000, () => {
console.log("Expresss server running...")
} )
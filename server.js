const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require('knex');
var moment = require('moment'); 
moment().format(); 


const signUp = require('./controllers/signUp');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const textContent = require('./controllers/textContent');
const showText = require('./controllers/showText');
const fav = require('./controllers/fav');


// const db = knex({
//   client: 'pg',
//    connection: {
//     connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
//   }
// });

const db = knex({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    port : 3306,
    user : 'root',
    password : '',
    database : 'diary_data'
  }
});


const app = express();

app.use(express.json());
app.use(cors())


app.get('/',(req, res)=> { res.send("it is working") })
app.post("/signIn", (req, res) => { signIn.handleSignIn(req, res, db, bcrypt) })
app.post("/signUp",(req, res) => { signUp.handleSignUp(req, res, db, bcrypt) })
app.put("/profile/:id",(req, res) => { profile.handleProfile(req, res, db) })
app.post("/textContent",(req, res) => { textContent.handleTextContent(req, res, db) })
app.post("/showText",(req, res) => { showText.handleShowText(req, res, db) })
app.post("/fav",(req, res) => { fav.handleFav(req, res, db, moment) })

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`App is running on port ${PORT}`);
})



/*

/ --> res = this is working
/signin --> POST = success/fail
/signup --> POST = user
/profile/:userID --> GET = user
/textcontent --> POST --> user
/profile --> PUT 

*/
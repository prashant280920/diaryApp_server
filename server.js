const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require('knex');
//const moment = require('moment');
var moment = require('moment'); // require
moment().format(); 


const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'prashant282000',
    database : 'diary_data'
  }
});
//


const app = express();

app.use(express.json());
app.use(cors())

const eb = {
	users:[
		{
			id:'123',
			name:"john",
			email:"john@gmail.com",
			diaryName:"My diary",
			password:"john",
			joined:new Date(),
			Avatar:"Women",
			textColor:"#000000"

		},
		{
			id:'124',
			name:"pk",
			email:"pk@gmail.com",
			diaryName:"My diary",
			password:"pk",
			joined:new Date(),
			Avatar:"Women",
			textColor:"#000000"
		}
	],
	usersContent:[
		{
			id:"1",
			email:"pk@gmail.com",
			date:"2020-06-18",
			textContent:"Dear Diary\n How are u",
			fav:"false"
		}

	]
}

app.get('/',(req, res)=> {
	res.send(eb)
})

app.post("/signIn", (req, res) => {
	db.select('email','hash').from('login')
	.where('email','=',req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash); 
		if(isValid){
			return db.select('*').from('profile')
			.where('email','=',req.body.email)
			.then(user => {
				res.json(user[0])	
			})
			.catch(err => res.status(400).json('unsable to get user'))	
		}else{
			res.status(400).json('wrong credentials')
		}
	})
	.catch(err => res.status(400).json("wrong credentials"))
})

app.post("/signUp",(req, res) => {
	const { email, name, diaryName, password } = req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash:hash,
			email:email
		})
		.into('login')
		.returning('email')
		.then(loginemail => {
			return trx("profile")
				.returning('*')
				.insert({
					email:loginemail[0],
					name:name,
					diaryname:diaryName,
					joined:new Date()
				}).then(user => {
					res.json(user[0]);	
				})

		}).then(trx.commit)
		.catch(trx.rollback)
	}).catch(err => res.status(400).json(err.detail))
	
})

app.put("/profile/:id", (req, res) => {
	const { diaryName, Avatar, textColor } = req.body;
	const { id } = req.params;
	db('profile').where('id','=',id).update({
		diaryname:diaryName,
		avatar:Avatar,
		textcolor:textColor
	})
	.returning('*')
	.then(user =>{
		if(user.length){
			res.json(user[0])	
		}else{
			res.status(400).json("user not found")
		}
		
		
	})
	.catch(err => res.status(400).json("error getting user"))

})

app.post("/textContent", (req, res) => {
	const { email, textContent, date, fav } = req.body;
	db.select('*').from('userscontent')
	.where({
		email : email,
		dates : date
	}).then(user => {
		if(user.length){
			db.select('*').from('userscontent')
			.where({
				email : email,
				dates : date
			}).update({
				textcontent : textContent,
				fav : fav
			}).returning('*')
			.then(content => {res.json(content[0])})
			.catch(err => res.status(400).json('error getting userContent'))
		}else{
			db('userscontent').insert({
				email : email,
				textcontent : textContent,
				dates : date,
				fav : fav
			}).returning('*')
			.then(content => {res.json(content[0])})
			.catch(err => res.status(400).json('error getting userContent'))
		}
	})
	.catch(err => res.status(400).json('error getting userContent'))
	
})

app.post("/showText", (req, res) => {
	const { email, date } = req.body;
	db.select('*').from('userscontent')
	.where({
		email:email,
		dates:date
	}).then(content => {
		if(content.length){
			res.json(content[0])	
		}else{
			res.status(400).json("content not found")
		}
		
	}).catch(err => {
		res.status(400).json("unable to get textContent")
	})
})


app.post("/fav", (req, res) => {
	const { email, month, year } = req.body;
	console.log(email,month,year)
	 db.select('*').from('userscontent')
	.where({email:email}).andWhereRaw(`EXTRACT(MONTH FROM dates) = ?`, [month]).andWhereRaw(`EXTRACT(YEAR FROM dates) = ?`, [year])
	 .then(data => {
	 	console.log(data)
	 	res.json(data)
	 })

})

app.listen(5000, () => {
	console.log("App is running on port 5000");
})



/*

/ --> res = this is working
/signin --> POST = success/fail
/signup --> POST = user
/profile/:userID --> GET = user
/textcontent --> POST --> user
/profile --> PUT 

*/
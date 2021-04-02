const express = require("express")
const jwt = require("jsonwebtoken")
const app = express()
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
const port = 3000
const mysql = require("mysql")
dotenv.config()

const DATABASE = process.env.DATABASE
const PASSWORD = process.env.PASSWORD
const SECRETKEY = process.env.SECRETKEY

app.use(express.json())
app.use(express.static("webfiles"))

let con = mysql.createConnection({
	host: "localhost",
	user: "omar",
	password: PASSWORD,
	database: DATABASE
})

app.get("/", async (req, res) => {
	console.log("Connected!")
	con.query("select * from users;", (e, users) => {
		if (e) throw e
		if (users.length > 0) {
			res.status(200)
			res.send(users)
		}
	})
})

app.post("/api/login", async (req, res) => {
	console.log(req.body)
	let u = req.body.username
	let p = req.body.password
	if (!u || !p) {
		res.status(400)
		res.send("Bad Request")
		return
	}

	con.query("select * from users;", (e, users) => {
		if (e) throw e
		if (users.length > 0) {

			let user = users.find(user => user.username === u && bcrypt.compareSync(p, user.password))

			if (user) {
				let userInfo = {
					id: user.id,
					role: user.role
				}
				let token = jwt.sign(userInfo, SECRETKEY)
				res.send(token)
				res.redirect("/user.html")
				res.status(200)
				return
			} else {
				res.status(401)
				res.send("not authorized")
				return
			}
		}
	})
})

app.get("/api/messages", async (req, res) => {
	try {
		let token = req.headers["authorization"].split(" ")[1]
		token = jwt.verify(token, SECRETKEY)

		let sql = `select * from messages where messages.userid = ${token.id}`
		con.query(sql, (err, messages) => {
			if (err) throw err
			res.status(200)
			res.send(messages)
		})
	}
	catch (e) {
		res.status(401)
		res.send("not authorized")
	}
})

app.post("/api/logout", (req, res) => {
	res.send("ok")
})

app.listen(port, () => {
	console.log("The application has started")
})
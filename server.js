const express = require("express")
const jwt = require("jsonwebtoken")
const app = express()
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
const mysql = require("mysql")
dotenv.config()

const DATABASE = process.env.DATABASE
const PASSWORD = process.env.PASSWORD
const SECRETKEY = process.env.SECRETKEY
const PORT = process.env.PORT
const API = process.env.API
const USER = process.env.USER

app.use(express.json())
app.use(express.static("webfiles"))

let con = mysql.createConnection({
	host: "localhost",
	user: USER,
	password: PASSWORD,
	database: DATABASE
})

app.post(`/${API}/login`, (req, res) => {
	console.log(req.body)
	let u = req.body.username
	let p = req.body.password
	if (!u || !p) {
		res.status(400)
		res.set("access-control-allow-headers","*")
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
					name: user.username,
					role: user.role
				}
				let token = jwt.sign(userInfo, SECRETKEY)
				res.set("access-control-allow-headers","*")
				res.status(200)
				res.send(token)
				return
			} else {
				res.status(401)
				res.set("access-control-allow-headers","*")
				res.send("not authorized")
				return
			}
		}
	})
})

app.get(`/${API}/messages`, async (req, res) => {
	try {
		console.log("headers", req.headers)
		let token = req.headers["authorization"].split(" ")[1]
		console.log("token recieved", token)
		token = jwt.verify(token, SECRETKEY)
		let sql
		if (token.role === "admin") {
			sql = "select * from messages"
		} else {
			sql = `select * from messages where messages.to_id = ${token.id} or messages.from_id = ${token.id}`
		}

		let messagesArr
		con.query(sql, (err, messages) => {
			if (err) throw err
			messagesArr = [...messages]
		})

		sql = "select * from users;"
		con.query(sql, (err, users) => {
			if (err) throw err
			let newMessages = messagesArr.map(message => {
				let sender = users.find(user => user.id === message.from_id)
				let to = users.find(user => user.id === message.to_id)

				return { ...message, sender: sender.username, to: to.username }
			})

			res.status(200)
			res.set("access-control-allow-headers","*")
			console.log("MESSAGES REQUESTED", newMessages)
			res.send(newMessages)
		})
	}
	catch (e) {
		res.status(401)
		res.set("access-control-allow-headers","*")
		res.send("not authorized")
	}
})

app.get(`/${API}/users`, async (req, res) => {
	try {
		console.log("headers", req.headers)
		let token = req.headers["authorization"].split(" ")[1]
		console.log("token recieved", token)
		token = jwt.verify(token, SECRETKEY)

		let sql = `select * from users where id != ${token.id};`

		con.query(sql, (err, users) => {
			if (err) throw err
			console.log("USERS REQUESTED", users)
			//Sanitize
			let newUsers = users.map(user => {delete user.password; return user} )
			console.log("USERS SANITIZED", newUsers)
			res.status(200)
			res.set("access-control-allow-headers","*")
			res.send(newUsers)
		})
	}
	catch (e) {
		res.status(401)
		res.set("access-control-allow-headers","*")
		res.send("not authorized")
	}
})

app.post(`/${API}/messages`, (req, res) => {
	let t = req.body.to
	let m = req.body.message
	if (!t || !m) {
		res.status(400)
		res.set("access-control-allow-headers","*")
		res.send("Bad Request")
		return
	}
	try {
		let token = req.headers["authorization"].split(" ")[1]
		console.log("headers", req.headers)
		console.log("token recieved", token)
		token = jwt.verify(token, SECRETKEY)
		// Yes I know taking a value directly from the user and using it to
		// insert an SQL command is horrible security.
		let sql = `insert into messages(from_id, to_id, message) values(${token.id}, ${t}, '${m}');`
		con.query(sql, (err) => {
			if (err) throw err
			res.status(200)
			res.set("access-control-allow-headers","*")
			res.send("Message sent")
		})
	}
	catch (e) {
		console.log(e)
		res.status(401)
		res.set("access-control-allow-headers","*")
		res.send("Not authorized")
	}
})

app.post(`/${API}/me`, (req, res) => {
	try {
		let token = req.headers["authorization"].split(" ")[1]
		console.log("headers", req.headers)
		console.log("token recieved", token)
		token = jwt.verify(token, SECRETKEY)
		res.status(200)
		console.log("NAME REQUESTED", token.name)
		res.send(token.name)
	} catch (e) {
		console.log(e)
		res.status(401)
		res.set("access-control-allow-headers","*")
		res.send("Not authorized")
	}
})

app.post(`/${API}/role`, (req, res) => {
	try {
		let token = req.headers["authorization"].split(" ")[1]
		console.log("headers", req.headers)
		console.log("token recieved", token)
		token = jwt.verify(token, SECRETKEY)
		res.status(200)
		console.log("ROLE REQUESTED", token.role)
		res.send(token.role)
	} catch (e) {
		console.log(e)
		res.status(401)
		res.set("access-control-allow-headers","*")
		res.send("Not authorized")
	}
})

app.listen(PORT, () => {
	console.log(`The application has started on ${PORT}`)
})
const axios = require("axios")
const dotenv = require("dotenv")
// const mysql = require("mysql")
dotenv.config()


// const DATABASE = process.env.DATABASE
// const PASSWORD = process.env.PASSWORD
// const SECRETKEY = process.env.SECRETKEY
// const PORT = process.env.PORT
const API = process.env.API
// const USER = process.env.USER

let token = null

let params = { Authorization: `Bearer ${token}` }

test("Logging in", () => {
	let login = async () => {
		let login = await axios.post(`/${API}/login`, { username: "omar", password: "omartest" })
		token = login.data
	}
	await login().then(() => {
		let isNull = true
		if (token) isNull = false
		console.log("token", token)
		expect(isNull).toBe(false)
	})
})

test("Send message as a user", () => {
	let response = null
	let sendMessageAsUser = async () => {
		response = await axios.post("/api/messages", {
			to: "1",
			message: "Hello there"
		}, { params })
	}
	await sendMessageAsUser().then(() => {
		expect(response).toBe("Message sent")
	})
})


// let postagain = async() => {
//     await axios.post('http://localhost:3001/api/animals',params,dog)
// }

// let read = async() => {
//     let res = await axios.get('http://localhost:3001/api/animals',params)
//     console.log(res.data)
// }


// postagain()
// read()

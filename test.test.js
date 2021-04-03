const axios = require("axios")
const dotenv = require("dotenv")
// const mysql = require("mysql")
dotenv.config()

let expect, test

// const DATABASE = process.env.DATABASE
// const PASSWORD = process.env.PASSWORD
// const SECRETKEY = process.env.SECRETKEY
// const PORT = process.env.PORT
const API = process.env.API
// const USER = process.env.USER

let token = null

let params = { Authorization: `Bearer ${token}` }

let login = async () => {
	let login = await axios.post(`/${API}/login`, { username: "omar", password: "omartest" })
	token = login.data

	test("Logging in", () => {
		let isNull = true
		if (token) isNull = false
		console.log("token", token)
		expect(isNull).toBe(false)
	})
}


let sendMessageAsUser = async () => {
	let response = await axios.post("/api/messages", {
		to: "1",
		message: "Hello there"
	}, { params })
	test("Send message as a user", () => {
		expect(response).toBe("Message sent")
	})
}



// let postagain = async() => {
//     await axios.post('http://localhost:3001/api/animals',params,dog)
// }

// let read = async() => {
//     let res = await axios.get('http://localhost:3001/api/animals',params)
//     console.log(res.data)
// }


login()
sendMessageAsUser()
// postagain()
// read()

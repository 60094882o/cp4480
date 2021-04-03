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

test("Logging in as user", () => {
	async function login() {
		let login = await axios.post(`/${API}/login`, { username: "omar", password: "omartest" })
		token = login.data
	}
	login().then(() => {
		let isNull = true
		if (token) isNull = false
		console.log("token", token)
		expect(isNull).toBe(false)
	})
})

test("Send message as a user", () => {
	let response = null
	async function sendMessageAsUser() {
		response = await axios.post("/api/messages", {
			to: "1",
			message: "Hello there"
		}, { params })
	}
	sendMessageAsUser().then(() => {
		expect(response).toBe("Message sent")
	})
})

test("Logging in as an admin", () => {
	async function login() {
		let login = await axios.post(`/${API}/login`, { username: "kareem", password: "kareemtest" })
		token = login.data
	}
	login().then(() => {
		let isNull = true
		if (token) isNull = false
		console.log("token", token)
		expect(isNull).toBe(false)
	})
})

test("Send message as an admin", () => {
	let response = null
	async function sendMessageAsUser() {
		response = await axios.post("/api/messages", {
			to: "2",
			message: "How are you doing?"
		}, { params })
	}
	sendMessageAsUser().then(() => {
		expect(response).toBe("Message sent")
	})
})


test("Read your messages as a user", () => {
	let response = null
	async function sendMessagesAsUser() {
		await axios.post("/api/messages", {
			to: "1",
			message: "This is the second message"
		}, { params })

		await axios.post("/api/messages", {
			to: "2",
			message: "This is another message for another user"
		}, { params })

		response = await axios.get("/api/messages", "", { params })
	}
	sendMessagesAsUser().then(() => {
		console.log("response", response)
		expect(response.length).toBe(2)
	})
})

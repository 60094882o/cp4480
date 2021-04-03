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

let params = () => { return { "Authorization": `Bearer ${token}` } }

test("Logging in as user", async () => {
	async function login() {
		let response = await axios.post(`http://localhost/${API}/login`, { username: "Omar", password: "omartest" })
		token = response.data
	}
	await login()
	let isNull = true
	if (token) isNull = false
	expect(isNull).toBe(false)
})

test("Send message as a user", async () => {
	let response = null
	async function sendMessageAsUser() {
		response = await axios.post(
			`http://localhost/${API}/messages`,
			{ to: "2", message: "How you doing?" },
			{ headers: params() }
		)
	}
	await sendMessageAsUser()
	expect(response.data).toBe("Message sent")
})

test("Logging in as an admin", async () => {
	async function login() {
		let login = await axios.post(`http://localhost/${API}/login`, { username: "Kareem", password: "kareemtest" })
		token = login.data
	}
	await login()
	let isNull = true
	if (token) isNull = false
	expect(isNull).toBe(false)
})

test("Send message as an admin", async () => {
	let response = null
	async function sendMessageAsAdmin() {
		response = await axios.post(
			`http://localhost/${API}/messages`,
			{ to: "2", message: "How you doing?" },
			{ headers: params() }
		)
	}
	await sendMessageAsAdmin()
	expect(response.data).toBe("Message sent")
})

test("Read your messages as a user", async () => {
	let response = null
	async function sendMessagesAsUser() {
		await axios.post(`http://localhost/${API}/messages`, {
			to: "1",
			message: "This is the second message"
		}, { headers: params() })

		await axios.post(`http://localhost/${API}/messages`, {
			to: "2",
			message: "This is another message for another user"
		}, { headers: params() })


		let login = await axios.post(`http://localhost/${API}/login`, { username: "Ahmed", password: "ahmedtest" })
		token = login.data

		response = await axios({
			method: "get",
			url: `http://localhost/${API}/messages`,
			headers: params()
		})
	}

	await sendMessagesAsUser()
	expect(response.data.length).toBe(3)
})

const axios = require("axios")
const dotenv = require("dotenv")
const puppeteer = require("puppeteer")
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
	async function readMessagesAsUser() {
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

	await readMessagesAsUser()
	expect(response.data.length).toBe(3)
})

test("Read your messages as an admin", async () => {
	let response = null
	async function readMessagesAsAdmin() {
		await axios.post(`http://localhost/${API}/messages`, {
			to: "1",
			message: "This is the second message"
		}, { headers: params() })

		await axios.post(`http://localhost/${API}/messages`, {
			to: "2",
			message: "This is another message for another user"
		}, { headers: params() })


		let login = await axios.post(`http://localhost/${API}/login`, { username: "Kareem", password: "kareemtest" })
		token = login.data

		response = await axios({
			method: "get",
			url: `http://localhost/${API}/messages`,
			headers: params()
		})
	}

	await readMessagesAsAdmin()
	expect(response.data.length).toBe(6)
})

test("Check your own name", async () => {
	let response = null
	async function checkName() {
		response = await axios.post(
			`http://localhost/${API}/me`,
			{ username: "Kareem", password: "kareemtest" },
			{ headers: params() }
		)
	}

	await checkName()
	expect(response.data).toBe("Kareem")
})

test("Check your own role", async () => {
	let response = null
	async function checkRole() {
		response = await axios.post(
			`http://localhost/${API}/role`,
			{ username: "Kareem", password: "kareemtest" },
			{ headers: params() }
		)
	}

	await checkRole()
	expect(response.data).toBe("admin")
})

test("Get all users except yourself", async () => {
	let response = null
	async function getUsers() {
		response = await axios({
			method: "get",
			url: `http://localhost/${API}/users`,
			headers: params()
		})
	}

	await getUsers()
	expect(response.data.length).toBe(2)
})

let started = false
let browser, page
async function start() {
	browser = await puppeteer.launch()
	page = await browser.newPage()
	started = true
}

async function closeBrowser() {
	if (started) 
		browser.close()
}

test("Visit page", async () => {
	if (!started)
		await start()
	let url = null
	await page.goto("http://localhost")
	url = await page.url()
	console.log("URL", url)
	expect(url !== null && url !== undefined).toBe(true)
})

afterEach(() => {
	closeBrowser()
})
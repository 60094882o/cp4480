const axios = require("axios")
const dotenv = require("dotenv")
// const puppeteer = require("puppeteer")
// const mysql = require("mysql")
dotenv.config()


// const DATABASE = process.env.DATABASE
// const PASSWORD = process.env.PASSWORD
// const SECRETKEY = process.env.SECRETKEY
// const PORT = process.env.PORT
const API = process.env.API
// const USER = process.env.USER

let token = null

let params = () => { return { 
	"Authorization": `Bearer ${token}`,
	"Access-Control-Request-Headers":"Authorization" 
} 
}

test("Logging in as user", async () => {
	async function login() {
		let response = await axios.post(`http://localhost:8081/${API}/login`, { username: "Omar", password: "omartest" })
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
			`http://localhost:8081/${API}/messages`,
			{ to: "2", message: "How you doing?" },
			
		)
	}
	await sendMessageAsUser()
	expect(response.data).toBe("Message sent")
})

test("Logging in as an admin", async () => {
	async function login() {
		let login = await axios.post(`http://localhost:8081/${API}/login`, { username: "Kareem", password: "kareemtest" })
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
			`http://localhost:8081/${API}/messages`,
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
		await axios.post(`http://localhost:8081/${API}/messages`, {
			to: "1",
			message: "This is the second message"
		}, { headers: params() })

		await axios.post(`http://localhost:8081/${API}/messages`, {
			to: "2",
			message: "This is another message for another user"
		}, { headers: params() })


		let login = await axios.post(`http://localhost:8081/${API}/login`, { username: "Ahmed", password: "ahmedtest" })
		token = login.data

		response = await axios({
			method: "get",
			url: `http://localhost:8081/${API}/messages`,
			headers: params()
		})
	}

	await readMessagesAsUser()
	expect(response.data.length).toBe(3)
})

test("Read your messages as an admin", async () => {
	let response = null
	async function readMessagesAsAdmin() {
		await axios.post(`http://localhost:8081/${API}/messages`, {
			to: "1",
			message: "This is the second message"
		}, { headers: params() })

		await axios.post(`http://localhost:8081/${API}/messages`, {
			to: "2",
			message: "This is another message for another user"
		}, { headers: params() })


		let login = await axios.post(`http://localhost:8081/${API}/login`, { username: "Kareem", password: "kareemtest" })
		token = login.data

		response = await axios({
			method: "get",
			url: `http://localhost:8081/${API}/messages`,
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
			`http://localhost:8081/${API}/me`,
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
			`http://localhost:8081/${API}/role`,
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
			url: `http://localhost:8081/${API}/users`,
			headers: params()
		})
	}

	await getUsers()
	expect(response.data.length).toBe(2)
})

// test("Visit page", async () => {
// 	let browser = await puppeteer.launch()
// 	let page = await browser.newPage()
// 	await page.goto("http://localhost:8081")
// 	let url = page.url()
// 	await browser.close()
// 	expect(url !== null && url !== undefined).toBe(true)
// })

// test("Visit page and look for non existent selector", async () => {
// 	let browser = await puppeteer.launch()
// 	let page = await browser.newPage()
// 	await page.goto("http://localhost:8081")

// 	let errored = false
// 	await page.focus("#username")
// 	try {
// 		await page.focus("#notASelector")
// 	} catch (error) {
// 		errored = true
// 	}

// 	await browser.close()
// 	expect(errored).toBe(true)
// })

// test("Login using form as user", async () => {
// 	let browser = await puppeteer.launch()
// 	let page = await browser.newPage()
// 	await page.goto("http://localhost:8081")
	
// 	await page.type("#username","Omar")
// 	await page.type("#password","omaromar")
// 	await page.click("#submitButton")

// 	await page.waitForNavigation()

// 	let errors = 0
// 	try {
// 		await page.focus("#sent")
// 	} catch (error) {
// 		errors++
// 	}

// 	// Should fail because not admin logging in
// 	try {
// 		await page.focus("#all")
// 	} catch (error) {
// 		errors++
// 	}

// 	await browser.close()
// 	expect(errors).toBe(1)
// })

// test("Login using form as admin", async () => {
// 	let browser = await puppeteer.launch()
// 	let page = await browser.newPage()
// 	await page.goto("http://localhost:8081")
	
// 	await page.type("#username","kareem")
// 	await page.type("#password","kareemkareem")
// 	await page.click("#submitButton")

// 	await page.waitForNavigation()

// 	let errors = 0
// 	try {
// 		await page.focus("#sent")
// 	} catch (error) {
// 		errors++
// 	}

// 	try {
// 		await page.focus("#all")
// 	} catch (error) {
// 		errors++
// 	}

// 	await browser.close()
// 	expect(errors).toBe(0)
// })

// test("Send a message to a user", async () => {
// 	let browser = await puppeteer.launch()
// 	let page = await browser.newPage()
// 	await page.goto("http://localhost:8081")
	
// 	await page.type("#username","Omar")
// 	await page.type("#password","omaromar")
// 	await page.click("#submitButton")

// 	await page.waitForNavigation()

// 	await page.type("#message", "This message is from puppeteer")

// 	await browser.close()
// 	expect(errors).toBe(0)
// })
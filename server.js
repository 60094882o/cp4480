const express = require("express")
const jwt = require("jsonwebtoken")
const app = express()
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
const port = 3000
const mysql = require("promise-mysql")
dotenv.config()

const DATABASE = process.env.DATABASE
const PASSWORD = process.env.PASSWORD
const SECRETKEY = process.env.SECRETKEY

app.use(express.json())
app.use(express.static("webfiles"))

(async () => {
    let con = await mysql.createConnection({
        host: "localhost",
        user: "omar",
        password: PASSWORD,
        database: DATABASE
    })

    app.get("/", async (req, res) => {
        console.log("Connected!")
        let sql = "select * from users;"
        await con.query(sql).then(() => {
            if (err) throw err
            res.status(200)
            res.send(result)
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

        let users = await con.query("select * from users;")

        let user = users.find(user => {
            console.log("user.password", user.password)
            console.log("comparison", bcrypt.compareSync(p, user.password))
            return user.username === u && bcrypt.compareSync(p, user.password)
        })

        if (user) {
            let userInfo = {
                name: u,
                role: user.role
            }
            let token = jwt.sign(userInfo, SECRETKEY)
            res.send(token)
            res.status(200)
            return
        }

        res.status(401)
        res.send("not authorized")
    })

    app.get("/api/messages", async (req, res) => {
        try {
            let token = req.headers["authorization"].split(" ")[1]
            token = jwt.verify(token, SECRETKEY)

            let sql = "select * from users where messages.userid = users.id"
            con.query(sql, (err, result) => {
                if (err) throw err
                res.status(200)
                res.send(result)
            })

            if (token.name) {

            } else {

            }

            res.send("ok")
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
})()
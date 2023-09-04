const http = require('http')
const express = require('express')
const dotenv = require('dotenv')
const { DataSource } = require('typeorm')

const myDataSource = new DataSource({
    type : 'mysql',
    host : '127.0.0.1',
    port : '3306',
    username : 'root',
    password : '0412!@Jj',
    database : 'westagram'
})

const app = express()

app.use(express.json())

dotenv.config()

app.get('/', async(req, res) => {
    try{
    return res.status(200).json({"message" : "Welcome to Jeongjin's Server!"})
    } catch (error) {
        console.log(error)
    }
})

app.get("/users", async(req, res) => {
    try {
        const userData = await myDataSource.query(`SELECT id, name, email FROM USERS`)
        
        console.log("USER DATA : ", userData)

        return res.status(200).json({
            "users" : userData
        })
    } catch (error) {
        console.log(error)
    }
})

app.post("/users", async(req, res) => {
    try {
        const me = req.body
        
        console.log("ME : ", me)

        const newName = me.name;
        const newPw = me.password;
        const newMail = me.email;

        const userData = await myDataSource.query(`
        INSERT INTO users (
            name, 
            password, 
            email
            ) VALUES (
                '${newName}',
                '${newPw}',
                '${newMail}'
            )
        `)

        return res.status(201).json({
            "message" : "userCreated"
        })
    } catch (error) {
        console.log(error)
    }
})

const server = http.createServer(app)

const start = async() => {
    try {
        server.listen(8000, () => console.log(`Server is listening on 8000`))
    } catch (error) {
        console.log(error)
    }
}
myDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })

start()


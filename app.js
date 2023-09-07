const http = require('http')
const express = require('express')
const { DataSource } = require('typeorm');
const cors = require('cors')
const jwt = require('jsonwebtoken');
const { async } = require('regenerator-runtime');
const { addYears } = require('date-fns');
const status = require('statuses');
const { id } = require('date-fns/locale');

const myDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: '3306',
  username: 'root',
  password: '4488',
  database: 'westagram'
}) ;

myDataSource.initialize()
 .then(() => {
     console.log("Data Source has been initialized!")
 })

const app = express()

app.use(cors())
app.use(express.json()) 

app.get("/", async(req, res) => {
  try {
    return res.status(200).json({"message": "Welcome to Suhan's server!"})
  } catch (err) {
    console.log(err)
  }
})

app.get('/users',async(req, res)=> {
  try {
      const userData = await myDataSource.query(`SELECT id, name, email FROM users`)

    console.log("USER DATA :", userData)

    return res.status(200).json({
      "users": userData
    })
  } catch (error) {
    console.log(error)
  }
})

app.post("/users", async(req, res)=> {
  try {
    const me = req.body

    const { name, password, email } = me 

    if (!email || !name || !password) {
      const error = new Error("KEY_ERROR")
      error.statusCode = 400
      throw error
    }


    if (password.length <8) {
      const error = new Error("INVALID_PASSWORD")
      error.statusCode = 400
      throw error 
    } ;

    const existingUser = await myDataSource.query(`
      SELECT email FROM users WHERE email = ?`,email)

    if (existingUser.length) {
      const error = new Error("SAME_EMAIL")
      error.statusCode = 400
      throw error
    } ;

    const userData = await myDataSource.query(`
    INSERT INTO users (
      name, 
      password,
      email
    )
    VALUES (
      '${name}',
      '${password}', 
      '${email}'  
    )
  `);

  console.log('iserted user id', userData.insertId)

  return res.status(200).json({
    "message": "userCreated"
  })
    
  } catch (error) {
    console.log(error)
    return res.status(error.statusCode).json({
      "message": error.message
    })
  }
})

app.post("/login", async(req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const token = jwt.sign({id: id }, 'wecode')
    console.log(req.body);
  
    if (!email || !password ) {
      const error = new Error("KEY_ERROR")
      error.statusCode = 400
      throw error
    };

    const alreadyEmail = await myDataSource.query(`SELECT id, email FROM users WHERE 1=1 and email = "${email}" and password = "${password}"`)


    if (!alreadyEmail.length){
      const error = new Error("ERROR_email_password")
      error.statusCode = 400
      throw error
    }

       if (alreadyEmail.length) {
        return res.status(200).json({ 
          "message" : "LOGIN_SUCCESS",
          "accessToken" : token
        })
      } ;
    
  } catch (error) {
    console.log(error)
  }
  
})

const server = http.createServer(app) 

const start = async () => { 
  try {
    server.listen(8000, () => console.log(`Server is listening on 8000`))
  } catch (err) { 
    console.error(err)
  }
}

start()

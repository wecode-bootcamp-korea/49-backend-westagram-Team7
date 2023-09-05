const http = require('http')
const express = require('express')
const { DataSource } = require('typeorm');
const { async } = require('regenerator-runtime');
const { addYears } = require('date-fns');
// const DataSource = myDataSource.query(`SELECT * FROM USERS`)

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

app.get("/", async(req, res) => {
  try {
    return res.status(200).json({"message": "Welcome to Suhan's server!"})
  } catch (err) {
    console.log(err)
  }
})


app.use(express.json()) 

app.get('/users',async(req, res)=> {
  try {
      const userData = await myDataSource.query(`SELECT id, name, email, profile_image FROM USERS`)

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

    console.log("Me: ", me)

    const name2 = me.name
    const password2 = me.password
    const email2 = me.email
    const profile_image = me.profile_image

    if (password2.length <8) {
      const error = new Error("INVALID_PASSWORD")
      error.statusCode = 400
      throw error 
    }

    const userData = await myDataSource.query(`
    INSERT INTO users (
      name, 
      password,
      email,
      profile_image

    )
    VALUES (
      '${name2}',
      '${password2}', 
      '${email2}',
      '${profile_image}'
    )
  `)

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

const server = http.createServer(app) 

const start = async () => { 
  try {
    server.listen(8000, () => console.log(`Server is listening on 8000`))
  } catch (err) { 
    console.error(err)
  }
}

start()

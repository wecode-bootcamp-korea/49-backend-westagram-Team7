const http = require('http')
const express = require('express')
const cors = require('cors')
const userService = require('./services/userServie.js')
console.log(userService);

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

app.get('/users', userService.getUsers)
app.post("/signup", userService.signUp )
app.post("/login", userService.login )

const server = http.createServer(app) 

const start = async () => { 
  try {
    server.listen(8000, () => console.log(`Server is listening on 8000`))
  } catch (err) { 
    console.error(err)
  }
}

start()

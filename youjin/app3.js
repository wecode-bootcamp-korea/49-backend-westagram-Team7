const dotenv = require("dotenv")
dotenv.config()

const http = require('http')
const express = require('express')

// 이게 mysql로 database 가져오는거
const { DataSource } = require('typeorm');

const myDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
 host: process.env.TYPEORM_HOST,
 port: process.env.TYPEORM_PORT,
 username: process.env.TYPEORM_USERNAME,
 password: process.env.TYPEORM_PASSWORD,
 database: process.env.TYPEORM_DATABASE
})

myDataSource.initialize()
 .then(() => {
     console.log("Data Source has been initialized!")
 })
   
   



const app = express()

app.use(express.json()) // for parsing application/json

//서버 띄우는 get 
app.get("/", async(req, res) => {
  try {
    return res.status(200).json({"message": "Welcome to Soheon's server!"})
  } catch (err) {
    console.log(err)
  }
})

//과제2 
// user 가져오는 get
//1. API 로 users 화면에 보여주기 
//get 안의 첫번째 인자가 url --> 맨 밑의 server.listen 첫 인자 8000 -> localhost:8000/users
app.get('/users', async(req, res) => {
	try {
    // query DB with SQL
    // Database Source 변수를 가져오고.
    // SELECT id, name, password FROM users;
    const userData = await myDataSource.query(`SELECT id, name, email FROM USERS`)

    // console 출력
// 서버 화면에 띄우는 거 (javascript는 화면에 띄우려면 console.log 띄어야하니/ . 있으면 다 js연결)
    console.log("USER DATA :", userData)

    // consolelog로 띄우는 게 FRONT 전달

    // 함수 있으니까 반환
    return res.status(200).json({
      "users": userData
    })
	} catch (error) {
		console.log(error)
	}
})
//2. users 를 post로 생성, /users -> mysql의 users table에 생성
app.post("/users", async(req, res) => {
	try {
    // 1. user 정보를 frontend로부터 받는다. (프론트가 사용자 정보를 가지고, 요청을 보낸다) -> postman body에 받는다 
    const me = req.body

    // 2. user 정보 console.log로 확인 한 번!
    console.log("ME: ", me)

  
    // 3. DATABASE 정보 저장.
  // body에서 빈 창에 데이터 자세하게 적고, 여기로 와서 양식 쓰기 
    const name2 = me.name
    const password2 = me.password
    const email2 = me.email

    const userData = await myDataSource.query(`
      INSERT INTO users (
        name, 
        password,
        email
      )
      VALUES (
        '${name2}',
        '${password2}', 
        '${email2}'
      )
    `)

    // 4. DB data 저장 여부 확인
    console.log('inserted user id', userData.insertId)

    // 5. send response to FRONTEND
		return res.status(201).json({
      "message": "userCreated" 
		})

	} catch (err) {
		console.log(err)
	}
})






// 과제 3 DELETE 
// 가장 마지막 user를 삭제하는 엔드포인트
app.delete("/users", async(req, res) => {
  try {

  } catch (err) {
    console.log(err)
  }
})



// 과제 4 UPDATE
// 1번 user의 이름을 'Code Kim'으로 바꾸어 보세요.

app.put("/users/1", async(req, res) => {
  try {
    const newName = req.body.data.name
  } catch (err) {
    console.log(err)
  }
})



myDataSource.initialize()
 .then(() => {
    console.log("Data Source has been initialized!")
 })



const server = http.createServer(app) // express app 으로 서버를 만듭니다.

const start = async () => { // 서버를 시작하는 함수입니다.
  try {
    server.listen(8000, () => console.log(`Server is listening on 8000`))
  } catch (err) { 
    console.error(err)
  }
}

start()


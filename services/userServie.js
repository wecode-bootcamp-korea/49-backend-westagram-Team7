const { id } = require('date-fns/locale');
const jwt = require('jsonwebtoken');
const { DataSource } = require('typeorm');
const myDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: '3306',
  username: 'root',
  password: '4488',
  database: 'westagram'
})

myDataSource.initialize()
 .then(() => {
     console.log("Data Source has been initialized!")
 })



const getUsers = async(req, res)=> {
  try {
      const userData = await myDataSource.query(`SELECT id, name, email FROM users`)

    console.log("USER DATA :", userData)

    return res.status(200).json({
      "users": userData
    })
  } catch (error) {
    console.log(error)
  }
}

const signUp = async(req, res)=> {
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
}

const login = async(req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    
    console.log(req.body);
  
    if (!email || !password ) {
      const error = new Error("KEY_ERROR")
      error.statusCode = 400
      throw error
    };

    const alreadyEmail = await myDataSource.query(`SELECT id, email FROM users WHERE 1=1 and email = "${email}" and password = "${password}"`)
    const token = jwt.sign({id: alreadyEmail }, 'wecode')


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
  
}
console.log(login)

module.exports = {
    "signUp" : signUp,
    "login" : login,
    "getUsers" : getUsers,
}

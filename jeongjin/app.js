const http = require('http')
const express = require('express')
const dotenv = require('dotenv')
const { DataSource } = require('typeorm')
const mysql = require('mysql2')

const app = express()

app.use(express.json())

dotenv.config()

const myDataSource = new DataSource({
    type : 'mysql',
    host : '127.0.0.1',
    port : '3306',
    username : 'root',
    password : '0412!@Jj',
    database : 'westagram'
})

myDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })


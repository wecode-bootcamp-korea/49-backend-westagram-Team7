const http = require('http')
const express = require('express')

const app = express()

app.use(express.json()) // for parsing application/json

app.get("/", async(req, res) => {
  try {
    return res.status(200).json({"message": "Welcome to Soheon's server!"})
  } catch (err) {
    console.log(err)
  }
})

app.get("/foodReview", async(req, res) => {
	try {
    return res.status(200).json({"marketData": [
      {
        "type": "일반",
        "contents": "달고 맵고 싱싱!! \n재구매 예정, 맛나유 ~^^",
        "contentsProductName": "[압구정주꾸미] 주꾸미 볶음 300g",
        "likeCount": 0,
        "isLike": false,
        "visibility": "PUBLIC",
        "ownerGrade": "일반",
        "ownerName": "이**",
        "images": [
            {
                "no": 50106839,
                "image": "https://img-cf.kurly.com/cdn-cgi/image/width=640,height=640,quality=90/shop/data/review/20230830/a8373d7a-7389-4d85-abd4-368e227641f8.jpeg"
            }
        ],
    },
    {
        "type": "일반",
        "contents": "딱 일인분이고요. 콩나물무침하고 비벼서  맛있게  먹었답니다 ",
        "contentsProductName": "[압구정주꾸미] 주꾸미 볶음 300g",
        "likeCount": 0,
        "isLike": false,
        "visibility": "PUBLIC",
        "ownerGrade": "일반",
        "ownerName": "노**",
        "images": [
            {
                "no": 50106833,
                "image": "https://img-cf.kurly.com/cdn-cgi/image/width=640,height=640,quality=90/shop/data/review/20230830/709274c6-9e04-4022-9472-9d7ecd451aa6.jpeg"
            }
        ],
    }
    ]})
  } catch (err) {
    console.log(err)
  }
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
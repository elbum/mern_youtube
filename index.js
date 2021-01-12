const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const config = require('./config/key')

console.log(config.mongoURI)
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 
app.use(bodyParser.json())


const { User } = require("./models/User")
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send('Hello World! HIHI')
});

app.post('/register', (req, res) => {
    // 회원가입 정보를 client 에서 받아서  db 저장
    const user = new User(req.body)

    // db 저장
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })


});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});


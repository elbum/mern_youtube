const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const config = require('./config/key');
const cors = require('cors');
// const multer = require('multer');

console.log(config.mongoURI)

app.use(cors());

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 
app.use(bodyParser.json());

// cookie parser
app.use(cookieParser());


const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send('Hello World! HIHI')
});

app.get('/api/hello', (req, res) => {
    res.send("Hellloooo React")
})

app.post('/api/users/register', (req, res) => {
    // 회원가입 정보를 client 에서 받아서  db 저장
    const user = new User(req.body)

    // 비번 암호화
    // pre('save') 에서 구현함.

    // db 저장
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })


});

app.post('/api/users/login', (req, res) => {
    // 요청된 이메일을 db 에서 찾고
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "No user email"
            })
        }

        // 있으면.
        //이메일을 이메일이 데이터 베이스에 있으면.  맞는 비번인지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "wrong password" });

            // 비번이 맞으면 토큰 생성.
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // 토큰을 저장. 어디다?  쿠키 or localstorage ?
                // 쿠키 쓰자..
                res.cookie("x_authExp", user.tokenExp);
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })
            })
        })
    });
})

// auth middleware
app.get('/api/users/auth', auth, (req, res) => {

    // 여기까지 미들웨어를 통과해왔으면. Authentication 이 True 라는 뜻임.

    // role 0 : 일반 ,  아니면 관리자.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})


app.get('/api/users/logout', auth, (req, res) => {
    // 로그아웃하려는애를 찾아서. 
    User.findOneAndUpdate({ _id: req.user._id },
        { token: "", tokenExp: "" }, // 토큰을 그냥 빼버림.
        (err, user) => {
            if (err) return res.json({ success: false, err });
            console.log("logout ok")
            return res.status(200).send({
                success: true
            })
        });


})

// static 파일을 엑세스 하려면 명시해야함. (썸네일 로드)
app.use('/uploads', express.static('uploads'));

// video , subscribe 쪽은 라우터로 구현하자. 라우터로 엔드포인트를 정리.
app.use('/api/video',require('./routes/video.js'));

app.use('/api/subscribe',require('./routes/subscribe.js'));

app.use('/api/comment',require('./routes/comment.js'));


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});


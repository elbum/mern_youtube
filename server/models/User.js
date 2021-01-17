const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10  // 글자수

var jwt = require('jsonwebtoken');



const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        // maxlength: 50
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// 저장하기 전에 하는 작업

userSchema.pre('save', function (next) {
    var user = this;


    // 근데 이메일을 바꿔도 비번을 또 암호화함.
    // 그래서 조건 필요함.
    if (user.isModified('password')) {

        // 비번암호화시킴
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)

                // 해쉬값으로 교체
                user.password = hash;
                console.log(user.password);

                next();

            });
        });
    } else {
        next();  // 패스워드 바꿀때가 아니라면, next 로 진행을 시켜줘야 한다.
    }


})

userSchema.methods.comparePassword = function (plainPassword, cb) {
    // plainPassword 1234567  , bcrypt = asdlknfadasoij
    // plain 을 암호화 한다음 비교.

    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err)

        cb(null, isMatch)

    });
}

userSchema.methods.generateToken = function (cb) {
    var user = this;


    // jsonwebtoken 을 이용해서 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken'); // tohexString 안하면 payload 에러남.
    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id

    user.token = token
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user)
    })

}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    // 토큰 decode.
    // json web token.
    jwt.verify(token, 'secretToken', function (err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            // 클라이언트에서 가져온 token 과 DB 에 보관된 토큰이 일치하는지 확인
            if (err) return cb(err);
            cb(null, user);
        })


    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
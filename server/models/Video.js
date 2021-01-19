const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer:{
        type:Schema.Types.ObjectId,    // Id만 가지고 User 의 모든걸 불러올수있어서 이렇게 함.
        ref:'User'
    },
    title:{
        type:String,
        maxlength:50
    },
    description : {
        type:String
    },
    privacy:{
        type:Number
    },
    filePath:{
        type:String
    },
    category:{
        type:String
    },
    views:{
        type:Number,
        default:0
    },
    duration:{
        type:String
    },
    thumbnail:{
        type:String
    }
},{timestamps:true})


const Video = mongoose.model('Video', videoSchema)

module.exports = { Video }
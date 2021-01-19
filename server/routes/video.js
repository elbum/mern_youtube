const express = require('express');
const router = express.Router();
// const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');
const { Video } = require('../models/Video');

// Multer Boilerplate Config
let storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"uploads/");
    },
    filename : (req,file,cb) => {
        // YYYY-MM-DD_hhmmss type
        let now = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/\:+/g,'');
        now += '_'+file.originalname;
        console.log(now);
        cb(null,now);
    },
    fileFilter: (req,file,cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4' || ext !== '.png'){
            return cb(res.status(400).end('only mp4 and png are allowed'),false);
        } 
        cb(null,true)
    }
});

const upload = multer({storage:storage}).single("file");

// ===== Video ====
router.post('/uploadfiles',(req,res) => {
    console.log('uploadfiles router called');
    // 클라이언트에서 받은 비디오를 서버에 저장
    upload(req,res,err=>{
        if(err) {
            return res.json({success:false, err})
        }

        console.log("upload ok",res.req.file);
        return res.json({success:true,url:res.req.file.path,fileName:res.req.file.filename})  // url = 업로드한 파일

    });
});

router.post('/thumbnail',(req,res) => {
    console.log('thumbnail router called');
    // 비디오 정보 가저오기
    ffmpeg.ffprobe(req.body.url,function(err,metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    })

    // 썸네일 생성하고, 
    ffmpeg(req.body.url)
    .on('filenames',function(filenames) {
        console.log('Will Generate '+filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/"+filenames[0]
    })
    .on('end',function() {
        console.log('Screenshots taken');
        return res.json({success:true,url:filePath,fileDuration:fileDuration})

    })
    .on('error',function(err){
        console.log(err);
        return res.json({success:false,err});
    })
    .screenshots({
        //will take screenshots 20% 40% 60% and 80% of the video
        count:3,
        folder:'uploads/thumbnails',
        size:'320x240',
        // %b : input basename (without ext.)
        filename:'thumbnail-%b.png'
    })
    
});

router.post('/uploadVideo',(req,res) => {
    console.log('uploadVideo router called');
    // 폼에서 받은 비디오데이터를 DB에 저장

    const video = new Video(req.body)   // body 는 post 로 받은 variable 에 있는 모든게 있음.
    video.save((err,doc)=>{
        if(err) return res.json({success:false,err})
        res.status(200).json({success:true})
    })
    
});

// 초기 화면의 전체 비디오들
router.get('/getVideos',(req,res) => {
    console.log('getVideo router called');
    // 비디오를 DB 에서 가져온다
    // video 모델을 가져오고 파인드.

    Video.find()
    .populate('writer')  // 파퓰레이트를 해야 모든걸 가저온다
    .exec((err,videos) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({success:true,videos})
    })
    
});


// 비디오 클릭했을때 상세정보
router.post('/getVideoDetail',(req,res) => {
    console.log('getVideoDetail router called');
    // 비디오를 DB 에서 가져온다
    // video 모델을 가져오고 파인드.

    Video.findOne({"_id":req.body.videoId})
    .populate('writer')
    .exec((err,videoDetail) => {
        if(err) return res.status(400).send(err)
        console.log(videoDetail)
        return res.status(200).json({success:true,videoDetail})
    })
    
});


module.exports = router;

const express = require('express');
const router = express.Router();
// const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

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


module.exports = router;

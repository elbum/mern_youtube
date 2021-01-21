const express = require('express');
const router = express.Router();
const { Comment } = require('../models/Comment');


// comment

router.post('/saveComment',(req,res) => {
    console.log('saveComment router called');

    const comment = new Comment(req.body)
    comment.save((err,comment) => {
        if(err) return res.json({success:false,err})

        // 그냥 save 해서 Comment 를 쓰면. id 값밖에 없다.  
        // id 로 다시 찾아서 populate 해줘야 다른 정보들을 읽을 수 있다.
        Comment.find({'_id':comment._id}) 
        .populate('writer')
        .exec((err,result)=>{
            if(err) return res.json({success:false,err})
            res.status(200).json({success:true,result})
        })
    })
});

router.post('/getComments',(req,res) => {
    Comment.find({"postId":req.body.videoId})
    .populate('writer')
    .exec((err,comments) => {
        if (err) return res.status(400).send(err)
        console.log("getcomment router"+comments)
        return res.status(200).json({success:true,comments})
    })
})


module.exports = router;

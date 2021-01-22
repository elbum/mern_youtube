const express = require('express');
const router = express.Router();
const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');


// Like dislike

router.post('/getLikes',(req,res) => {
    // 비디오like  or 커멘트like  분기
    let variable = {}

    if(req.body.videoId){
        variable = {videoId:req.body.videoId}
    } else {
        variable = {commentId:req.body.commentId}
    }
    Like.find(variable)
    .exec((err,likes) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({success:true,likes})
    })
})

router.post('/getDislikes',(req,res) => {
    // 비디오like  or 커멘트like  분기
    let variable = {}

    if(req.body.videoId){
        variable = {videoId:req.body.videoId}
    } else {
        variable = {commentId:req.body.commentId}
    }

    Dislike.find(variable)
    .exec((err,dislikes) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({success:true,dislikes})
    })
})

router.post('/upLike',(req,res) => {
    // 비디오like  or 커멘트like  분기
    let variable = {}

    if(req.body.videoId){
        variable = {videoId:req.body.videoId , userId:req.body.userId}
    } else {
        variable =  {commentId:req.body.commentId , userId:req.body.userId}
    }

    // Like collection 에다가 클릭한 이력을 저장
    const like = new Like(variable)

    like.save((err,likeResult)=> {
        if(err) return res.json({success:false,err})

        // 성공하면 dislike 찾고..
        // 만약에 Dislike 이 이미 클릭되어있으면, Dislike 을 1 줄여준다. (지워버리믄됨)
        Dislike.findOneAndDelete(variable) 
        .exec((err,disLikeResult)=>{
            if(err) return res.status(400).json({success:false,err})
            res.status(200).json({success:true})
        })

    })
})

router.post('/unLike',(req,res) => {
    // 비디오like  or 커멘트like  분기
    let variable = {}

    if(req.body.videoId){
        variable ={videoId:req.body.videoId , userId:req.body.userId}
    } else {
        variable =  {commentId:req.body.commentId , userId:req.body.userId}
    }
  

    // 성공하면 like 찾고..
    // 만약에 like 이 이미 클릭되어있으면, like 을 1 줄여준다. (지워버리믄됨)
    Like.findOneAndDelete(variable) 
    .exec((err,result)=>{
        if(err) return res.status(400).json({success:false,err})
        res.status(200).json({success:true})
    })

})

router.post('/unDislike',(req,res) => {
    // 비디오like  or 커멘트like  분기
    let variable = {}

    if(req.body.videoId){
        variable = {videoId:req.body.videoId , userId:req.body.userId}
    } else {
        variable =  {commentId:req.body.commentId , userId:req.body.userId}
    }
  

    // 성공하면 like 찾고..
    // 만약에 like 이 이미 클릭되어있으면, like 을 1 줄여준다. (지워버리믄됨)
    Dislike.findOneAndDelete(variable) 
    .exec((err,result)=>{
        if(err) return res.status(400).json({success:false,err})
        res.status(200).json({success:true})
    })

})

router.post('/upDislike',(req,res) => {
    // 비디오like  or 커멘트like  분기
    let variable = {}

    if(req.body.videoId){
        variable = {videoId:req.body.videoId , userId:req.body.userId}
    } else {
        variable = {commentId:req.body.commentId , userId:req.body.userId}
    }

    // Like collection 에다가 클릭한 이력을 저장
    const dislike = new Dislike(variable)

    dislike.save((err,dislikeResult)=> {
        if(err) return res.json({success:false,err})

        // 성공하면 like 찾고..
        // 만약에 like 이 이미 클릭되어있으면, like 을 1 줄여준다. (지워버리믄됨)
        Like.findOneAndDelete(variable) 
        .exec((err,disLikeResult)=>{
            if(err) return res.status(400).json({success:false,err})
            res.status(200).json({success:true})
        })

    })
})
module.exports = router;

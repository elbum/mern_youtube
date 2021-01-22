import React,{useEffect,useState} from 'react'
import {Tooltip} from 'antd'
import {LikeOutlined,DislikeOutlined, LikeTwoTone , DislikeTwoTone} from '@ant-design/icons';
import axios from 'axios'

function LikeDislikes(props) {
    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DislikeAction, setDislikeAction] = useState(null)
    let variable = {}

    if(props.video){
        // video 에서 온 like 정보인지.
        variable = {videoId:props.videoId, userId:props.userId}
    } else {
        // comment 에서 온 like 정보인지 판단해야함.
        variable = {commentId: props.commentId , userId: props.userId}
    }

    // didmount
    useEffect(()=>{
        axios.post('/api/like/getLikes',variable)
        .then(response => {
            if(response.data.success){

                // 얼마나 많은 like 있냐?
                setLikes(response.data.likes.length)


                // 내가 like 눌렀냐?
                response.data.likes.map(like => {
                    if(like.userId === props.userId) {
                        setLikeAction('liked')
                    }
                })

            } else {
                alert('get likes info failed')
            }
        })

        axios.post('/api/like/getDislikes',variable)
        .then(response => {
            if(response.data.success){

                // 얼마나 많은 dislike 있냐?
                setLikes(response.data.dislikes.length)


                // 내가 dislike 눌렀냐?
                response.data.dislikes.map(dislike => {
                    if(dislike.userId === props.userId) {
                        setDislikeAction('disliked')
                    }
                })

            } else {
                alert('get dislikes info failed')
            }
        })
    },[])

    const onLike = () => {
        if(LikeAction===null){
            axios.post('/api/like/upLike',variable)
            .then(response => {
                if(response.data.success) {
                    setLikes(Likes+1)
                    setLikeAction('liked')    // filled 

                    if(DislikeAction !== null) {
                        setDislikeAction(null)
                        setDislikes(Dislikes -1 )
                    }

                } else {
                    alert('fail to uplike')
                }
            })

        } else {
            axios.post('/api/like/unLike',variable)
            .then(response => {
                if(response.data.success) {
                    setLikes(Likes-1)
                    setLikeAction(null)

                } else {
                    alert('fail to unlike')
                }
            })
        }
    }

    const onDislike = () => {
        // dislike 가 이미 클릭되어있을때
        if(DislikeAction !== null) {
            axios.post('/api/like/unDislike',variable)
            .then(response => {
                if(response.data.success) {
                    setDislikes(Dislikes-1)
                    setDislikeAction(null)

                } else {
                    alert('fail to unDislike')
                }
            })
        } else {
            // 클릭되어있지 않을때.
            axios.post('/api/like/upDislike',variable)
            .then(response => {
                if(response.data.success) {
                    setDislikes(Dislikes+1)
                    setDislikeAction('disliked')

                    if(LikeAction !== null) {
                        setLikeAction(null)
                        setLikes(Likes-1)
                    }

                } else {
                    alert('fail to uplike')
                }
            })
        }
    }
    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    {LikeAction === 'liked' ? <LikeTwoTone onClick={onLike}/> : <LikeOutlined onClick={onLike} /> }
                </Tooltip>
                <span style={{paddingLeft:'8px',cursor:'auto'}}> {Likes} </span>
            </span> &nbsp;&nbsp;&nbsp;

            <span key="comment-basic-like">
                <Tooltip title="Dislike">
                    {DislikeAction === 'disliked' ? <DislikeTwoTone onClick={onDislike}/> : <DislikeOutlined onClick={onDislike}/>}
                </Tooltip>
                <span style={{paddingLeft:'8px',cursor:'auto'}}> {Dislikes} </span>
            </span> &nbsp;&nbsp;&nbsp;
        </div>
    )
}

export default LikeDislikes

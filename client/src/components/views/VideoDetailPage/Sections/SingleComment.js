import React,{useEffect,useState} from 'react'
import {Row , Col , Card , List, Typographym , Comment,Avatar,Button,Input} from 'antd'
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import {useSelector} from 'react-redux';
const {TextArea} = Input

function SingleComment(props) {
    const user = useSelector(state => state.user);

    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")
    const onClickReplyOpen = () =>{
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();
        // 댓글내용을 보낸다.  comment.js 에 구현한거를 그대로 쓰자.

        const variables = {
            content: CommentValue,
            writer: user.userData._id, // 이번엔 리덕스에서 가져와보자.
            postId: props.postId ,  // 이건 props 에서 가져오자
            reponseTo: props.comment._id  // ReplyComment 에는 이게 있어야함.

        }
        axios.post('/api/comment/saveComment',variables)
        .then(response => {
            if(response.data.success){
                console.log(response.data.result)
                setCommentValue("")
                setOpenReply(false)
                props.refeshFunction(response.data.result)   // 싱글에서도 커맨트 추가 해주자. 그래야 계속 애드애드 된다.
            } else { 
                alert('comment save error')
            }
        })
    }
    console.log("heres Singlecomment.js = " + props.comment.content)

    const actions = [
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to"> Reply to </span>
    ]
    return (
        <div>
            <Comment
            actions={actions}
            author={props.comment.writer.name}
            avatar={<Avatar src alt/>}
            content={<p>{props.comment.content}</p>}
            refeshFunction={props.refeshFunction}
        />
        {OpenReply &&
         <form style={{display:'flex'}} onSubmit={onSubmit}>
                <textarea style={{width:'100%',borderRadius:'5px'}}
                onChange={onHandleChange}
                value={CommentValue}
                placeholder="코멘트를 작성해주세요"/>

            <br/>
            <button style={{width:'20%',height:'52px'}} onClick={onSubmit}> Submit</button>
            </form>
        }
        </div>

    )
}

export default SingleComment

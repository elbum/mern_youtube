import React,{useEffect,useState} from 'react'
import {Row , Col , Card , List, Typography,Input} from 'antd'
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import {useSelector} from 'react-redux';
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment'
const {Title} = Typography;
const {Meta} = Card;
const {TextArea} = Input

function Comment(props) {
    const user = useSelector(state => state.user);
    const videoId = props.postId;

    const [commentValue, setcommentValue] = useState("")
    const handleClick = (event)=>{
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id, // 이번엔 리덕스에서 가져와보자.
            postId: videoId,  // 이건 props 에서 가져오자

        }
        axios.post('/api/comment/saveComment',variables)
        .then(response => {
            if(response.data.success){
                console.log(response.data.result)
                console.log("comment saved")
                setcommentValue("")
                // 왜 에러나지?? ??????
                props.refeshFunction(response.data.result)  
            } else { 
                alert('comment save error')
            }
        },[])
    }

    console.log("comment.js props = ", props.commentLists)
    return (
        <div>
            <br/>
            <p> Replies </p>
            <hr/>

            {/* Comment Lists */}
            {props.commentLists && props.commentLists.map( (comment,index)=> (
                // responseTo 가 없는애들. 즉 1레벨인 애들만 보여준다.
                (!comment.responseTo && 
                <React.Fragment>
                    <SingleComment refeshFunction={props.refeshFunction} key={index} comment={comment} postId={props.postId}/>
                    <ReplyComment refeshFunction={props.refeshFunction} parentCommentId={comment._id} commentLists={props.commentLists} postId={props.postId}/>
                </React.Fragment>)
            ))
            }
           

            {/* Root Comment Form */}

            <form style={{display:'flex'}} onSubmit={onSubmit}>
                <textarea style={{width:'100%',borderRadius:'5px'}}
                onChange={handleClick}
                value={commentValue}
                placeholder="코멘트를 작성해주세요"/>

            <br/>
            <button style={{width:'20%',height:'52px'}} onClick={onSubmit}>Submit</button>
            </form>

            
        </div>
    )
}

export default Comment

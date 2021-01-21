import React,{useEffect,useState} from 'react'
import SingleComment from './SingleComment'
function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReply, setOpenReply] = useState(false)
    useEffect(()=>{
        let commentNumber = 0;
        props.commentLists.map((comment) => {
            if (comment.responseTo === props.parentCommentId) {
                commentNumber ++
            }

        })
        setChildCommentNumber(commentNumber)

    },[props.CommentLists])   // [] commentlkist 가 바뀔때마다 계속 재실행함.
    const renderReplyComment = (parentCommentId) => {   
        props.commentLists.map((comment,index) => (
            <React.Fragment>
                {     
                    // 2레벨을 재귀로 구현한다
                    comment.responseTo === props.parentCommentId &&
                    <div style={{width:'80%',marginLeft:'40px'} }>
                        <SingleComment refeshFunction={props.refeshFunction} key={index} comment={comment} postId={props.postId}/>
                        <ReplyComment refeshFunction={props.refeshFunction} commentLists={props.commentLists} parentCommentId={parentCommentId}/>
                    </div>
                }


            </React.Fragment>
        ))
    }

    const onHandleChange = () => {
        setOpenReply(!OpenReply)
    }

    return (
        <div>
            {ChildCommentNumber>0 && 
                <p style={{ fontSize:'14px' , margin:0, color:'gray'}} onClick={onHandleChange} >
                View {ChildCommentNumber} more comment(s)
                </p>
            }

            {OpenReply && 
                renderReplyComment(props.parentCommentId)
            }
            
            
        </div>
    )
}

export default ReplyComment

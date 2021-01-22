import React,{useEffect,useState} from 'react'
import {Row , Col , Card , List, Typography} from 'antd'
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscribe'
import Comment from './Sections/Comment'
import LikeDislikes from './Sections/LikeDislikes'
const {Title} = Typography;
const {Meta} = Card;


function VideoDetailPage(props) {
    
    
    // app.js 에 정의했으니까
    const videoId = props.match.params.videoId   

    const variable = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComments] = useState([])
    console.log(variable)

    useEffect(() => {
        axios.post('/api/video/getVideoDetail',variable)
        .then(response => {
            if(response.data.success) {
                console.log("succeed")
                console.log(response.data) // 이상하면 찍어보자..
                setVideoDetail(response.data.videoDetail)

            } else {
                alert('Video Info Loading failed')
            }
        })

        axios.post('/api/comment/getComments',variable)
        .then(response=>{
            if(response.data.success){
                
                setComments(response.data.comments)
                console.log("getcomments"+response.data.comments)

            } else {
                alert('comment load failed')
            }
        })
    
    }, [])
    
    console.log(VideoDetail.filePath);
    
    
    const updateComment = (newComment) => {
        // 중간 코멘트를 합쳐줘야함.
        setComments(Comments.concat(newComment))

    }
    
    if(VideoDetail.filePath){

        // 비디오업로더와 현재사용자가 다를때만 구독버튼을 활성화 한다.
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')}/>

        // videoDetail 의 writer 를 읽기전에 렌더링하면 오류가 난다.   그래서 if 로 감싸고 로딩처리...
        return (
       
            <Row gutter={[16,16]}>
                {/* 전체가 24 , 메인에 18 , 사이드에 6 부여 */}
                <Col lg={18} xs={24}>
                    <br/>
                    Main
                <div style={{width:'100%',padding:'3rem 4rem'}}>
                    <video style={{width:'100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls/>
                    {/* prop으로 등록자의 정보를 넘겨서, subscribe 정보를 조회함. */}
                    <List.Item
                    actions={[<LikeDislikes video userId={localStorage.getItem('userId')} videoId={videoId} />,subscribeButton]}
                    >  {VideoDetail.title}
                        <List.Item.Meta
                        avatar
                        title={VideoDetail.title}
                        description={VideoDetail.description}
        
                        />
                    </List.Item>
                    
                    {/* Comments */}
                    <Comment refreshFunction={updateComment} commentLists={Comments} postId={videoId}/>
    
                </div>
                
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo/>
                    {/* 깔끔하게 콤포넌트로 만들자 */}
    
                </Col>
            </Row>
        
        
        )

    } else {
        return ( <div>Loading...</div>)
    }
    
}


export default withRouter(VideoDetailPage)
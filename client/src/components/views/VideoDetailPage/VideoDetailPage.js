import React,{useEffect,useState} from 'react'
import {Row , Col , Card , List, Typography} from 'antd'
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import SideVideo from './Sections/SideVideo'

const {Title} = Typography;
const {Meta} = Card;


function VideoDetailPage(props) {
    
    
    // app.js 에 정의했으니까
    const videoId = props.match.params.videoId   

    const variable = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([])

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
    
    }, [])
    
    console.log(VideoDetail.filePath);
    
    
    
    
    if(VideoDetail.filePath){
        // videoDetail 의 writer 를 읽기전에 렌더링하면 오류가 난다.   그래서 if 로 감싸고 로딩처리...
        return (
       
            <Row gutter={[16,16]}>
                {/* 전체가 24 , 메인에 18 , 사이드에 6 부여 */}
                <Col lg={18} xs={24}>
                    <br/>
                    Main
                <div style={{width:'100%',padding:'3rem 4rem'}}>
                    <video style={{width:'100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls/>
                    <List.Item
                    actions
                    >
                        <List.Item.Meta
                        avatar
                        title={VideoDetail.title}
                        description={VideoDetail.description}
        
                        />
                    </List.Item>
    
                    {/* Comments */}
    
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
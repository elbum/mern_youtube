import React, { useEffect ,useState } from 'react'
import axios from 'axios';
import { Button, DatePicker, version } from "antd"
import "antd/dist/antd.css";
import { withRouter } from 'react-router-dom';
import { Card,Icons,Avatar, Col,Typography,Row} from 'antd';
import {PlusCircleOutlined} from '@ant-design/icons';
import moment from "moment";

const {Title} = Typography;
const {Meta} = Card;

function LandingPage(props) {

    const [Video, setVideo] = useState([])
    
    // dom 이 로드되자마자 뭘할건가 정의.
    // 클래스였으면 componentdidMount 써야함.
    // 이건 훅이니까 useEffect
    useEffect(() => {
        axios.get('/api/hello')
            .then(function(response) { if(response.status === 200){
                console.log("Backend OK")
            } else {
                console.log("Backend Down.")
            }})
            .then(axios.get('/api/video/getVideos')
            .then(response => {
                if(response.data.success){
                    console.log(response.data)
                    setVideo(response.data.videos)

                } else {
                    alert("Video Load Error")
                }
            }))
              
    }, []);

    const renderCards = Video.map((video,index) => {

        var minutes = Math.floor(video.duration/60);
        var seconds = Math.floor(video.duration - minutes*60);


        return <Col lg={6} md={8} xs={24}>
           

            <div style={{position:'relative'}}>
                <a href={`/video/${video._id}`}>
                    <img style={{width:'100%'}} src={`http://localhost:5000/${video.thumbnail}`}/>
                    <div className="duration">
                        <span>{minutes} : {seconds}</span>

                    </div>
                </a>
            </div>

        <br/>
        <Meta
        // avatar={
        //     // <Avatar src={Video.writer.image}/>
        // }
        title={Video.title}
        description=""/>
        <span>{video.writer.name}</span><br/>
        <span style={{marginLeft:'3rem'}}>{video.views} views </span> - <span>{moment(video.creaatedAt).format("MMM Do YY")}</span>


         </Col>


    })




    // const renderCards = 
    return (
        <div style={{ width: '85%', margin : '3rem auto' }}>
            <br/><br/><br/><br/><br/><br/>
            <Title level={2}> Recommended </Title>
            <Title level={5}> Level3Recommended </Title>
            <hr/>
            <Row gutter={[32,16]}>

                {renderCards}

           


            </Row>
            <br/><br/><br/><br/><br/><br/>

        </div >
    )
}

export default withRouter(LandingPage)

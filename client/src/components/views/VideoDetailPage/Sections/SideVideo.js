import React,{useEffect,useState} from 'react'
import { withRouter } from 'react-router-dom';
import axios from 'axios';

function SideVideo() {

    const [sideVideos, setsideVideos] = useState([])

    // 랜딩페이지에 전체 불러오는거 있으니까 그거 걍 씀
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
                    setsideVideos(response.data.videos)

                } else {
                    alert("Video Load Error")
                }
            }))
              
    }, []);

    const renderSideVideo = sideVideos.map((video,index) => {
        var minutes = Math.floor(video.duration/60);
        var seconds = Math.floor(video.duration - minutes*60);

        // key={index} 꼭 넣어줘야 반복에러 없음
        return (
        <div key={index} style={{display:'flex',marginBottom:'1rem',padding:'0 2rem'}}>
            
            <div style={{width:'40%',marginBottom:'1rem'}}><br/><br/><br/>
                <a href>
                    <img style={{width:'100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt='thumbnail'/>
                </a>
            </div>
            <div style={{width:'50%'}}><br/><br/><br/>
                <a href>
                    <span style={{fontSize:'1rem',color:'black'}}> {video.title} </span><br/>
                    <span>{video.writer.name}</span><br/>
                    <span>{video.views} views</span><br/>
                    <span>{minutes}:{seconds}</span><br/>
                </a>
            </div>
        </div>
    )
    })


    return (
        <React.Fragment>
            <div style={{marginTop:'3rem'}}/>
            {renderSideVideo}
        </React.Fragment>

    )
}

export default withRouter(SideVideo)

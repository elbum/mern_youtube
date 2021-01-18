import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import { Typography, Button, Form, message, Input } from 'antd';
import {PlusCircleOutlined} from '@ant-design/icons';
import axios from 'axios';
// import TextArea from 'antd/lib/input/TextArea';

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    {value:0 , label:"Private"},
    {value:1 , label:"Public"}
]

const CategoryOptions = [
    {value:0 , label:"Film & Animation"},
    {value:1 , label:"Autos & Vehicles"},
    {value:2 , label:"Music"},
    {value:3 , label:"Pets & Animals"}
]
function VideoUploadPage() {
    // state 에다가 value 를 저장한다.
    // 서버에 보낼떈 state 에있는 값을 보내버림.

    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film & Animation")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")
    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const onDrop = (files) => {
        let formData = new FormData;
        const config = {
            header:{'content-type':'multipart/form-data'}
        }
        formData.append("file",files[0])

        console.log(files)
        // axios 파일을 보낼때는 위에 헤더가 꼭 있어야함.
        axios.post('/api/video/uploadfiles',formData , config)
        .then(response => {
            if(response.data.success){
                console.log(response.data)

                // 성공하면 썸네일 만들자
                let variable = {
                    url:response.data.url,
                    fileName:response.data.fileName
                }

                setFilePath(response.data.url)

                axios.post('/api/video/thumbnail',variable)
                .then(response => {
                    if(response.data.success) {
                        console.log(response.data)
                        // 썸네일 성공하면 state 에 저장해놔야됨.
                        setDuration(response.data.fileDuration)
                        setThumbnailPath(response.data.url)


                    } else {
                        alert('Thumnail generating failed')
                    }
                })

            } else {
                alert('upload failed.')
            }
        })
    }


    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <br /><br /><br /><br />





            <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
                <Title>Upload Video</Title>
            </div>




            <Form onSubmit>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* drop zone */}
                    <Dropzone 
                        onDrop = {onDrop}
                        multiple = {false}
                        maxSize = {800000000000}
                    >
                        {({ getRootProps, getInputProps }) => (

                            <div style={{
                                width: '300px', height: '240px', border: '1px solid lightgray',
                                alignItems: 'center', justifyContent: 'center'
                            }}{...getRootProps()}>
                        <input {...getInputProps()}/>
                        <PlusCircleOutlined style={{fontSize:"3rem"}}/>
                        </div>
                        
                        )}

                    </Dropzone>

                    {/* thumbnail 있을때만 렌더링 */}
                    {ThumbnailPath &&
                    <div>
                        <img src={`http://localhost:5000/${ThumbnailPath}`} alt='thumbnail' />
                    </div>
                    }


                </div>
                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br />
                <br />
                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item,index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                    {/* 이것보다 낫다. <option key value> </option> */}
                </select><br /><br />


                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((item,index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                    {/* <option key value></option> */}
                </select><br /><br />

                <Button type="primary" size="large" onClick>
                    Submit

                </Button>


            </Form>

        </div>
    )
}

export default withRouter(VideoUploadPage)


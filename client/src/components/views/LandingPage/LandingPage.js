import React, { useEffect } from 'react'
import axios from 'axios';
import { Button, DatePicker, version } from "antd"
import "antd/dist/antd.css";
import { withRouter } from 'react-router-dom';
function LandingPage(props) {

    useEffect(() => {
        axios.get('/api/hello')
            .then(response => console.log(response.data))
    }, []);

    const onClickHandler = () => {
        axios.get('/api/users/logout')
            .then(response => {
                console.log(response.data)
                if (response.data.success) {
                    props.history.push("/login")
                } else {
                    console.log("logout failed")
                }
            })
    }
    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <div className="App">
                <h1>antd version: {version}</h1>
                <DatePicker />
                <Button type="primary" style={{ marginLeft: 8 }}>
                    Primary Button
                </Button>
                <br />

                <h2>시작 페이지</h2><br /><br />
                <Button onClick={onClickHandler}>
                    로그아웃
                </Button>
            </div >
        </div >
    )
}

export default withRouter(LandingPage)

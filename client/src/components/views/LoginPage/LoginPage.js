import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';


function LoginPage(props) {

    const dispatch = useDispatch()

    const [Email, setEmail] = useState("test@naver.com")
    const [Password, setPassword] = useState("12345678")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onSubmitHandler = (event) => {
        event.preventDefault();  // 해줘야함. 차이를 잘 확인. 안하면 page refresh 되버림.
        console.log("Email =", Email)
        console.log("Password =", Password)

        let body = {
            email: Email,
            password: Password
        }

        dispatch(loginUser(body))
            .then(response => {
                if (response.payload.loginSuccess) {
                    props.history.push('/')
                } else {
                    alert('Login Error')
                }
            })


    }
    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <form style={{ disply: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label><br />
                <input type="email" value={Email} onChange={onEmailHandler} /><br />
                <label>Password</label><br />
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br /><br />
                <button type="submit">
                    Login
                </button>
            </form>

        </div>
    )
}

export default withRouter(LoginPage)

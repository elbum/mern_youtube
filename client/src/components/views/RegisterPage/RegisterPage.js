import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { registerUser } from '../../../_actions/user_action';
import "antd/dist/antd.css";
import { withRouter } from 'react-router-dom';

function RegisterPage(props) {
    const dispatch = useDispatch()

    const [Email, setEmail] = useState("test@naver.com")
    const [Name, setName] = useState("")
    const [Password, setPassword] = useState("12345678")
    const [ConfirmPassword, setConfirmPassword] = useState("12345678")



    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }


    const onSubmitHandler = (event) => {
        event.preventDefault();  // 해줘야함. 차이를 잘 확인. 안하면 page refresh 되버림.
        console.log("Email =", Email)
        console.log("Password =", Password)

        if (Password !== ConfirmPassword) {
            return alert("비밀번호와 비밀번호 확인은 같아야 합니다.")
        }

        let body = {
            name: Name,
            email: Email,
            password: Password
        }

        // redux 안쓰면 여기서 axios


        dispatch(registerUser(body))
            .then(response => {
                console.log("REGISTER Success")
                if (response.payload.success) {
                    props.history.push("/login")
                } else {
                    alert("Failed to sign up")
                }
            })


    }

    return (
        <div className="App" style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>

            <form style={{ disply: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label>Email </label><br />

                <input type="email" value={Email} onChange={onEmailHandler} /><br />

                <label>Name </label><br />

                <input type="text" value={Name} onChange={onNameHandler} /><br />

                <label>Password  </label><br />

                <input type="password" value={Password} onChange={onPasswordHandler} /><br />

                <label>Confirm Password</label><br />

                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />


                <br /><br />
                <button type="submit" style={{ justifyContent: 'center' }}>
                    회원가입
                </button>
            </form>

        </div>
    )
}

export default withRouter(RegisterPage)

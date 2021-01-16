import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null) {
    // option
    // null - 아무나
    // true - 로그인한 사람만 가능
    // false - 로그인한 사람 불가능

    //adminRoute = true 는 어드민만 들어갈수있음.

    const dispatch = useDispatch();
    function AuthenticationCheck(props) {
        useEffect(() => {

            dispatch(auth()).then(response => {
                console.log(response)

                // 권한별 분기처리

                // 로그인하지 않은 상태
                if (!response.payload.isAuth) {
                    if (option) {
                        props.history.push('/login')
                    }

                } else {
                    // 로그인 상태

                    // 어드민 아닌데 어드민 들어가려고 하면
                    if (adminRoute && !response.payload.isAdmin) {
                        props.history.push('/')
                    } else {
                        // 로그인한 유저가 못들어가는곳 (회원가입)
                        if (option === false) {
                            props.history.push('/')
                        }
                    }



                }
            })

            // axios.get('/api/users/auth')

        }, [])

        return (<SpecificComponent />)
    }



    return AuthenticationCheck
}
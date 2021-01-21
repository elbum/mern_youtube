import React,{useEffect,useState} from 'react'
import { withRouter } from 'react-router-dom';
import axios from 'axios'

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(()=>{

        let variable = {userTo:props.userTo}
        axios.post('/api/subscribe/subscriberNumber',variable)
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setSubscribeNumber(response.data.subscribeNumber)

            } else {
                alert('subscriber number info failed')
            }
        })

        // 내아이디와 조회한애 아이디를 같이 던저서 내가 구독자인지 확인.
        let subscribedVariable = { userTo:props.userTo , userFrom : localStorage.getItem('userId') }

        axios.post('/api/subscribe/subscribed',subscribedVariable)
        .then(response => {
            if(response.data.success){
                console.log(response.data.subscribed)
                setSubscribed(response.data.subscribed)

            } else {
                alert('isSubscribed info failed')
            }
        })

    },[])

    const onSubscribe = () => {
        // 위에선 로컬에서 가저왔는데. 여기선 프롭에서..
        let subscribedVariable = { userTo:props.userTo , userFrom : props.userFrom }
        if(Subscribed) {
            // 구독중이면 구독취소

            axios.post('/api/subscribe/unSubscribe',subscribedVariable)
            .then(response => {
                if(response.data.success){
                    console.log('unsubscribe succeed')
                    setSubscribeNumber(SubscribeNumber -1)
                    setSubscribed(!Subscribed)

                } else {
                    alert('unsubscribe failed')
                }
            })

        } else {
            // 구독중이 아니면 구독신청

            axios.post('/api/subscribe/subscribe',subscribedVariable)
            .then(response => {
                if(response.data.success){
                    console.log('enroll subscribe succeed')
                    setSubscribeNumber(SubscribeNumber + 1)
                    setSubscribed(!Subscribed)

                } else {
                    alert('enroll subscribe failed')
                }
            })

        }
    }
    return (
        <div>
           <button style={{backgroundColor: `${Subscribed ?  '#AAAAAA': '#CC0000'}`, borderRadius:'4px',
        color:'white',padding:'10px 16px',
        fontWeight:'500',fontSize:'1rem',textTransform:'uppercase'
        }}
        onClick={onSubscribe}
        >
            {SubscribeNumber} {Subscribed ? 'Subscribed' : 'You can Subscribe' }
            </button> 
        </div>
    )
}

export default withRouter(Subscribe)

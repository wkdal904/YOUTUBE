import React, { useEffect, useState } from 'react';
import Axios from 'axios';


function Subscribe(props) {
const [SubscribeNumber, setSubscribeNumber] = useState(0)
const [Subscribed, setSubscribed] = useState(false) 

    useEffect(() => {
        //구독자 수를 알기 위해서는 사용자의 ID를 알아야하기 때문에 variable을 넣어줘야 한다
        //userTo는 비디오 디테일페이지의 VideoDetail.writer.name이 userTo가 된다
        //왠지는 모르겠음...암ㅁ튼 비디오 디테일 페이지에서 props로 받아올 수 있다.
        let variable={userTo: props.userTo}

        Axios.post('/api/subscribe/subscribeNumber', variable)
        .then(response=>{
            if(response.data.success){
                setSubscribeNumber(response.data.subscribeNumber)
            }else{
                alert('구독자 수 정보를 받아오지 못했습니다.')
            }
        })
        //콘솔창 어플리케이션을 보면 userid만 어느곳에서든 쓸 수 있게 localhost에 저장해놔서
        //getItem으로 Id를 불러올 수 있다
        let subscribedvariable={userTo: props.userTo, userFrom: localStorage.getItem('userId')}
        //아래의 것은 내가 누군가를 구독하고 있는지를 알아보는 것이기 때문에
        //나의 아이디가 필요하기 때문에 위와같은 variable이 필요하다
        Axios.post('/api/subscribe/subscribed', subscribedvariable)
        .then(response=>{
            if(response.data.success){
                setSubscribed(response.data.subscribed)
            }else{
                alert('정보를 받아오지 못했습니다.')
            }
        })
    }, [])
    const onSubscribe=() =>{

        let subscribedvariable={
            userTo:props.userTo,
            userFrom:props.userFrom//본인의 아이디
        }
        if(Subscribed) {
            //이미구독중이라면
            Axios.post('/api/subscribe/unSubscribe', subscribedvariable)
            .then(response=>{
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber-1)
                    //구독취소했기 때문에 -1
                    setSubscribed(!Subscribed)
                    //구취했기때문에 현재상태와 반대상태로
                }else{
                    alert('구독취소 실패')
                }
            })

        }else{
            //아직 구독하지 않았다면
            Axios.post('/api/subscribe/Subscribe', subscribedvariable)
            .then(response=>{
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber+1)
                    //구독취소했기 때문에 +1
                    setSubscribed(!Subscribed)
                    //구취했기때문에 현재상태와 반대상태로
                }else{
                    alert('구독하는데 실패')
                }
            })
        }
    }


    return (
        <div>
            <button
            style={{
                backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius:'4px',
                color:'white', padding:'10px 16px',
                fontWeight:'500', fontSize:'1rem', textTransform:'uppercase'
            }}
            onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe

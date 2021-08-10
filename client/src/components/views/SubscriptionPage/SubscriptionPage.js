//새로운 페이지를 만들고 나서는 항상 App.js에서 route를 만들어줘야 한다.
import React,{useEffect, useState} from 'react'
import { Card, Icon, Avatar, Col, Typography, Row} from 'antd';
import Axios from 'axios';
import moment from 'moment';
const {Title} = Typography;
const {Meta} = Card;


function SubscriptionPage() {

     const [Video, setVideo] = useState([])
    //useEffect는 페이지가 로드 되자마자 무엇을 먼저 할것인지 정해준다
//[]c처럼 되어있다면 DOM이 업데이트 될 때 한번만 이 문장을 수행하는것이다.
useEffect(() => {

    const subscriptionVariables ={
        userFrom: localStorage.getItem('userId')
    }
//이부분은 landingpage에서 그대로 가져와서 그때는 property가 필요없이 모든 데이터를
//가져와야 했지만 여기서는 선별된 데이터만 가져와야하기 때문에 
//property를 넣어줘야한다 subscriptionVariables에 구독중인지 아닌지 비교하기 위해 유저의 아이디를가져온다
    Axios.post('/api/video/getSubscriptionVideos', subscriptionVariables)
    .then(response=>{
        if(response.data.success){
            console.log(response.data)
            setVideo(response.data.videos)//정보들을 Video에 담는 작업
        }else{
            alert('비디오 가져오기를 실패 했습니다.')
        }
    })
    
}, [])
   const renderCards = Video.map((video, index)=>{
    var minutes = Math.floor(video.duration/60);
    var seconds = Math.floor((video.duration- minutes*60));


    return <Col key={index} lg={6} md={8} xs={24}>
        <div style={{position:'relative'}}>
        <a href={`/video/${video._id}`}>
        <img style={{width:'100%'}} src={`http://localhost:5000/${video.thumbnail}`}/>
        <div className="duration"
            style={{bottom:0, right:0, position:'absolute', margin:'4px',
        color: '#fff', backgroundColor:'rgba(17, 17, 17, 0.8)', opacity:0.8,
        padding: '2px 4px', borderRadius:'2px', letterSpacing:'0.5px', fontSize:'12px',
        fontWeight:'500', lineHeight:'12px' }}>
        <span>{minutes} : {seconds}</span>//영상의 길이
        </div>
</a>
</div><br />
                <Meta
                avatar={
                    <Avatar src={video.writer.image}/>//유저이미지
                }
                title={video.title}
                
                />
                <span>{video.writer.name}</span><br />
                <span style={{marginLeft:'3rem'}}>{video.views} views</span>-<span>{moment(video.createdAt).format("MMM Do YY")}</span>
            </Col>
})
    return (
        <div style={{width:'85%', margin:'3rem auto'}}>
            <Title level={2}>내가 구독중인 사람들</Title>
        <hr />
        
      <Row gutter={[32, 16]}>

            {renderCards}
           
        </Row>

        </div>

        )}


export default SubscriptionPage

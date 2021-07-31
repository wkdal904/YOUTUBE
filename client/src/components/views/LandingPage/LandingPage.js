import React,{useEffect, useState} from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Icon, Avatar, Col, Typography, Row} from 'antd';
import Axios from 'axios';
import moment from 'moment';

const {Title} = Typography;
const {Meta} = Card;


function LandingPage() {
    const [Video, setVideo] = useState([])
    //useEffect는 페이지가 로드 되자마자 무엇을 먼저 할것인지 정해준다
//[]c처럼 되어있다면 DOM이 업데이트 될 때 한번만 이 문장을 수행하는것이다.
useEffect(() => {
    Axios.get('/api/video/getVideos')
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
    return <Col lg={6} md={8} xs={23}>
        <a href={`/video/post/${video._id}`}>id를 이용해서 링크를 걸어주기
        <div style={{position:'relative'}}>
        <img style={{width:'100%'}} src={`http://localhost:5000/${video.thumbnail}`}/>
        <div className="duration">
            <span>{minutes} : {seconds}</span>//영상의 길이
        </div>
    </div>
</a>
                

                    
                <br />
                <Meta
                avatar={
                    <Avatar src={video.writer.image}/>//유저이미지
                }
                title={video.title}
                description=""
                />
                <span>{video.writer.name}</span><br />
                <span style={{marginLeft:'3rem'}}>{video.views} views</span>-<span>{moment(video.createdAt).format("MMM Do YY")}</span>
            </Col>
})
    return (
        <div style={{width:'85%', margin:'3rem auto'}}>
            <Title level={2}>Recommended</Title>
        <hr />
        
      <Row gutter={[32, 16]}>

            {renderCards}
           
        </Row>

        </div>

        )}

export default LandingPage

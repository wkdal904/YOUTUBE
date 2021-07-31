import React, { useEffect, useState } from 'react'
import {Row, Col, List, Avatar} from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';


function VideoDetailPage(props) {
    const videoId = props.match.params.videoId
    //app.js에서 주소를 :video/videoId로 설정했기때문에 props로 가져올 수 있다
    const variable={videoId: videoId}
    
    const [VideoDetail, setVideoDetail] = useState([])
    //아래에서 비디오정보를 성공적으로 받았을 때 state에 저장해줘야하기 때문에 VideoDetail state생성

useEffect(() => {
    Axios.post('/api/video/getVideoDetail', variable)
    .then(response=>{
        if(response.data.success){
            setVideoDetail(response.data.videoDetail)
            //서버에서 videoDetail로 보내줬기땜누에 똑같이 그걸로 받는다.

        }else{
            alert('비디오 정보를 가져오길 실패했습니다.')
        }
    })
}, [])//이에 맞는 라우트를 서버에 꼭 만들어줘야한다
    if(VideoDetail.writer){ 
        return (
        <Row gutter={[16, 16]}>
            <Col lg={18} xs={24} >
            <div style={{width:'100%', padding:'3rem 4rem'}}>
                <video style={{width:'100%' }} src={`http://lacalhost:5000/${VideoDetail.filePath}`} controls/>

                <List.Item
                actions>
                    <List.Item.Meta
                    //VideoDetail.writer.image를 할 수 있는이유는 populate을 해줬기 때문이다.
                    //avatar는 유저의 이미지
                        avatar={<Avatar src={VideoDetail.writer.image}/>}
                        title={VideoDetail.writer.name}
                        description={VideoDetail.description}
                        />

                </List.Item>
                {/*comments*/}
            </div>
            </Col>
            <Col lg={6} xs={24}>
                <SideVideo />//깔끔하게 하기 위해서 컴포넌트를 만들어준것
            </Col>        
        </Row>

    )
}
    else{
        return (
            <div>...loading</div>
        )
    }
   
}



export default VideoDetailPage
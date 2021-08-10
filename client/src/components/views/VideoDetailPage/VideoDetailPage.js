import React, { useEffect, useState } from 'react';
import {Row, Col, List, Avatar} from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
function VideoDetailPage(props) {
    const videoId = props.match.params.videoId
    //app.js에서 주소를 :video/videoId로 설정했기때문에 props로 가져올 수 있다
    const variable={videoId: videoId}
    
    const [VideoDetail, setVideoDetail] = useState([])
    //아래에서 비디오정보를 성공적으로 받았을 때 state에 저장해줘야하기 때문에 VideoDetail state생성

    const [Comments, setComments] = useState([])
//singlecomment와 comment에서 submit한 것들을 여기 Comments에 업데이트 해줘야한다

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
    Axios.post('/api/comment/getComments', variable)
    .then(response=>{
        if(response.data.success){
            setComments(response.data.comments)
            //코멘트정보를 받아와서 Comments에 넣고 이것을 <Comment commentLists={Comments}
            //이런식으로 넣어주고 
        }else{
            alert("코멘트 정보를 가져오는 것을 실패했습니다.")
        }
    })

}, [])//이에 맞는 라우트를 서버에 꼭 만들어줘야한다 
    const refreshFunction=(newComment)=>{
        setComments(Comments.concat(newComment))
//원래 Comments에 새로운 댓글 newComment를 추가해주는 것이다.
    }

    if(VideoDetail.writer){ 
        const subscribeButton = VideoDetail.writer._id!==localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />
        //내가 나의 페이지를 볼때에는 구독 버튼이 보이지 않도록 설정
        return (
        <Row gutter={[16, 16]}>
            <Col lg={18} xs={24} >
            <div style={{width:'100%', padding:'3rem 4rem'}}>
                <video style={{width:'100%'}} src={`http://lacalhost:5000/${VideoDetail.filePath}`} controls/>

                <List.Item
                actions={[subscribeButton]}>
                    <List.Item.Meta
                    //VideoDetail.writer.image를 할 수 있는이유는 populate을 해줬기 때문이다.
                    //avatar는 유저의 이미지
                        avatar={<Avatar src={VideoDetail.writer.image}/>}
                        title={VideoDetail.writer.name}
                        description={VideoDetail.description}
                        />

                </List.Item>
                {/*comments*/}
                <Comment refreshFunction={refreshFunction} commentLists={Comments} postId={videoId}/>
            {/*Comment에 refreshFunction를 props으로 줄때에는 이렇게 줘야한다*/}
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

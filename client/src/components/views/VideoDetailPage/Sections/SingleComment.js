import React, {useState} from 'react'
import {Comment, Avatar, Button, Input} from 'antd';
import {useSelector} from 'react-redux';
import Axios from 'axios'


const {TextArea} = Input;
function SingleComment(props) {
    const user = useSelector(state=>state.user);
    const [OpenReply, setOpenReply] = useState(false)
//대댓글 버튼이 누를때마다 사라졌다가 나와야하기위해 만든 state
//처음에는 숨겨져있어야 하기 때문에 false
    const [CommentValue, setCommentValue] = useState("")
    const onHandleChange =(event) =>{
        setCommentValue(event.currentTarget.CommentValue)
    }//댓글을 쓸수 있게 해주는 부분
    
    const onSubmit = (event) =>{
        event.preventDefault();
        const variables={
            content:CommentValue ,
            writer: user.userData._id,
            //localstrage에서 불러오는 방법과 redux에서 가져오는 방법이있는데
            //여기서는 redux를 이용해서 가져올것이다.
            postId:props.postId,
            //prop으로 비디오디테일페이지의 videioId를 가져오거나
            //비디오디테일페이지의 videioId를 그대로 가져와서 작성해도된다.
            responseTo: props.comment._id//Comment에서 가져온것
            
            //이정보를 가져오기 위해서는 모든 comment정보들을 데이터베이스에서 가져오야한다
            //따라서 가장 부모인 비디오디테일페이지에서 axios로 가져온다
        }
        //댓글의 내용과 여러가지 정보를 데이터베이스에 넣기위해 AXIOS를 이용한다
        //property를 넣어줘서 필요한 정보들을 가져온다.
        Axios.post('/api/comment/saveComment', variables)
        .then(response =>{
            if(response.data.success){
                console.log(response.data.result)
                setCommentValue("")
                props.refreshFunction(response.data.result)
            }else{
                alert('댓글을 저장하지 못했습니다.')
            }
        })
    }


    const onClickReplyOpen =()=>{
        setOpenReply(!OpenReply)//클릭될때 토글 시켜준다.
    }
    const actions = [
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]//대댓글 버튼 생성

    return (
        <div>
            <Comment 
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={<p>{props.comment.content}</p>}
                />
        {OpenReply &&

            <form style={{display:'flex'}} onSubmit={onSubmit}>
                <textarea
                style={{width:'100%', borderRadius:'5px'}}
                onChange={onHandleChange}
                value={CommentValue}
                placeholder="코멘트를 작성해 주세요"
            />
            <br />
            <button style={{width:'20%', height:'52px'}} onClick={onSubmit}>Submit</button>
            </form>

        
        }
        

        </div>
    )
}

export default SingleComment

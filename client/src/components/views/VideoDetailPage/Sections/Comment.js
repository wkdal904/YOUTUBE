import Axios from 'axios'
import React, {useState} from 'react'
import {useSelector} from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {

    const videoId = props.postId;
    const user = useSelector(state=>state.user);
    //state에서 state.user정보 전체를 가져온것이다.
    const [commentValue, setcommentValue] = useState("")
    const handleClick=(event)=>{
        setcommentValue(event.currentTarget.value)
    }//이걸 만드는 이유는 댓글창에 타이핑을 하기 위해서다
    const onSubmit=(event)=>{
        //원래 onSubmit의 동작은 버튼을 눌렀을때 새로고침되는 것이 기본설정이기 때문에
        //이것을 바꿔줘야한다
        event.preventDefault();//새로고침되지 않게 해주는 것이 이 줄이다.
        const variables={
            content:commentValue ,
            writer: user.userData._id,
            //localstrage에서 불러오는 방법과 redux에서 가져오는 방법이있는데
            //여기서는 redux를 이용해서 가져올것이다.
            postId:videoId
            //prop으로 비디오디테일페이지의 videioId를 가져오거나
            //비디오디테일페이지의 videioId를 그대로 가져와서 작성해도된다.
        }
        //댓글의 내용과 여러가지 정보를 데이터베이스에 넣기위해 AXIOS를 이용한다
        //property를 넣어줘서 필요한 정보들을 가져온다.
        Axios.post('/api/comment/saveComment', variables)
        .then(response =>{
            if(response.data.success){
                console.log(response.data.result)
                setcommentValue("")
                props.refreshFunction(response.data.result)
            }else{
                alert('댓글을 저장하지 못했습니다.')
            }
        })
    }
    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />

             {/*Comment Lists
             props.commentLists이 있다면 이를 다시 map으로 돌려서 하나씩 
             SingleComment에 넣어준다*/
             }
           
            {props.commentLists && props.commentLists.map((comment, index)=>(
                (!comment.responseTo &&//reponseTo가있다면 대댓글이기 때문에
                    //처음화면에서는 responseTo가 없는 메인댓글만 보여주기 위해서 위와같은 조건 추가
                    <React.Fragment>
                    <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId} />
                    <ReplyComment refreshFunction={props.refreshFunction} postId={videoId} parentCommentId={comment._id} commentLists={props.commentLists}/>
                    </React.Fragment>//항상 리액트에서는 div나 React.Fragment로 감싸줘야한다
                    
                    ) 
            ))}
            //비디오디테일에서 받아온정보를 다시 SingleComment로 넘겨주기 위한 작업

            {/*Root Comment From*/}
            <form style={{display:'flex'}} onSubmit={onSubmit}>
                <textarea
                style={{width:'100%', borderRadius:'5px'}}
                onChange={handleClick}
                value={commentValue}
                placeholder="코멘트를 작성해 주세요"
                />
                <br />
                <button style={{width:'20%', height:'52px'}} onClick={onSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default Comment
//비디오디테일에 작성해도 되지만 너무 복잡해지기 때문에 따로 빼서 작성한다
//댓글 작성후에 다시 부모컴포넌트인 비디오디테일로 보내줘서 작성된 댓글을 화면에보여줘야하기땜누에
//순환되는 형식이라고 할 수 있다
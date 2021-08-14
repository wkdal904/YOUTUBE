import React, {useState, useEffect} from 'react'
import SingleComment from './SingleComment';

function ReplyComment(props) {
//모든 대댓글들의 정보를 renderReplyComment라는 변수로 만들어서
//비디오디테일페이지에서의 Comment스테이트를 props로 가져와야한다

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
//대댓글의 개수를 넣어주기위한 state
    const [OpenReplyComments, setOpenReplyComments] = useState(false)
//몇개의 대댓글이 달려있는지 알려주기 위한 useEffect 처음의 대댓글은 0으로하고
//commentLists를 가져와 map으로 하나하나의 댓글을 분석하면서 responseTo와 parentCommentId가 같은지 확인한다
    useEffect(() => {
        let commentNumber=0;
        props.commentLists.map((comment)=>{
            if(comment.responseTo===props.parentCommentId){
                commentNumber ++
            }
        })
        setChildCommentNumber(commentNumber)
    }, [])
    //[]처럼 비어있다면 한번실행될때 

    const renderReplyComment = (parentCommentId) =>
        props.commentLists.map((comment, index)=>(
            //대댓글의responTo와 댓글의 Id가 같아야지만 렌더링 될 수 있게 해준다

            //postId와 videoId는 같은 것이다. 이름을 같게 해줘도된다.
            <React.Fragment>
                {comment.responseTo===parentCommentId &&
                <div style={{width:'80%', marginLeft:'40px'}}>
                <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.videoId} />
                <ReplyComment  refreshFunction={props.refreshFunction} commentLists={props.commentLists} postId={props.videoId} parentCommentId={comment._id} />
                </div>
                }
            </React.Fragment>
        ))
            
                const onHandleChange=()=>{
                    setOpenReplyComments(!OpenReplyComments)
                }

    return (
        <div>
            {ChildCommentNumber > 0 &&
             <p style={{fontSize:'14px', margin:0, color:'gray'}} onClick={onHandleChange}>
             View {ChildCommentNumber} more comment(s)
             </p>
            }
        {OpenReplyComments &&//true일때에만 눌리게
        renderReplyComment(props.parentCommentId)
        }
        </div>
    )
}

export default ReplyComment

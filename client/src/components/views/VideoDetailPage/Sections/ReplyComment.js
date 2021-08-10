import React from 'react'

function ReplyComment(props) {
//모든 대댓글들의 정보를 renderReplyComment라는 변수로 만들어서
//비디오디테일페이지에서의 Comment스테이트를 props로 가져와야한다

    const renderReplyComment = () =>{
        props.commentLists.map((comment, index)=>{
            <React.Fragment>
                <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId} />
                <ReplyComment commentLists={props.commentLists}/>
            </React.Fragment>
        })
    }

    return (
        <div>
            <p styl={{fontSize:'14px', margin:0, color:'gray'}} onClick>
            View 1 more comment(s)
            </p>
            
        renderReplyComment

        </div>
    )
}

export default ReplyComment

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
    writer:{//댓글쓴 사람의 정보
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    postId:{//댓글이 작성되는 비디오의 ID
        type:Schema.Types.ObjectId,
        ref:'Video'
    },
    responseTo:{//대댓글을 쓰는 사람으 ID
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    content:{//댓글의 내용 부분
        type:String
    }
}, { timestamps: true })
//timestaps는 만든날과 업데이트한 날이 기록된다.


const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment }
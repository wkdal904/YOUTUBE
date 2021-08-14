const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer: {
        //쓰는사람의 아이디를넣는것인데typq에 유져아이디를 넣어주면
        //ref의 User에서 그 아이디에 맞는 유저정보를 가져다 준다.
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type:String,
        maxlength:50,
    },
    description: {
        type: String,
    },
    privacy: {//0은 privacy 1은 public
        type: Number,
    },
    filePath: {
        type: String,
    },
    catogory: String,
    views : {//뷰수는 0부터 시작
        type: Number,
        default: 0 
    },
    duration :{
        type: String
    },
    thumbnail: {
        type: String
    }
}, { timestamps: true })
//timestaps는 만든날과 업데이트한 날이 기록된다.


const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }
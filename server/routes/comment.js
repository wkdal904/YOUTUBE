const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");

//항사이렇게 새로운 route파일을 만들고 index.js에서 app.use를 만들ㅇ줘야한다.
//=================================
//             Comment
//=================================
//여기서는 req가 파일을 받는방식이다.


router.post('/saveComment', (req, res)=>{
    const comment = new Comment(req.body)//save를 위해 모델로 인스턴스를 생성한다?

    comment.save((err, comment)=>{
        if(err) return res.json({success: false, err})
//정보가 저장된 comment를 그대로 쓰게 된다면 writer의 모든 정보가 아닌 Id만들어있다
//따라서 자주쓰던 populate('writer')를 쓰려고 했지만 save를 한 상태에서는 populate를 사용할 수 없기때문에
//그냥 Comment에서 comment._id로 찾고 그 다음에 populate을 사용한다
        Comment.find({'_id':comment._id})
        .populate('writer')
        .exec((err, result)=>{
            if(err) return res.json({success:false, err})
            res.status(200).json({success:true, result})
        })
    })


});
router.post('/getComments', (req, res)=>{
    Comment.find({"postId":req.body.videoId})
    .populate('writer')
    .exec((err, comments)=>{
        if(err) return res.status(400).send(err)
        res.status(200).json({success:true, comments})
    })

});



module.exports = router;

const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");
const { auth } = require("../middleware/auth");

//항사이렇게 새로운 route파일을 만들고 index.js에서 app.use를 만들ㅇ줘야한다.
//=================================
//             Subscribe
//=================================
//여기서는 req가 파일을 받는방식이다.


//클라에서 비디오 ID를보내고있기 때문에 ID를 이용해서 비디오 정보를 가져와야한다.
router.post('/subscribeNumber', (req, res)=>{
    Subscriber.find({'userTo':req.body.userTo})
    //subscribe에는 userTo를 구독하는 모든 케이스가 들어있다.
    .exec((err, subscribe)=>{
        if(err) return res.status(400).send(err);
        return res.status(200).json({success:true, subscribeNumber:subscribe.length})
    })
});

//subscribelength가 1만 된다면 내가 이사람을 구독하고 있다는 의믜가된다
router.post('/subscribed', (req, res)=>{
    Subscriber.find({'userTo':req.body.userTo, 'userFrom':req.body.userFrom})
    .exec((err, subscribe)=>{
        if(err) return res.status(400).send(err);
        let result=false
        if(subscribe.length!==0){
            result=true
        }
        res.status(200).json({success:true, subscribed:result})
    })
});


router.post('/unSubscribe', (req, res)=>{
    Subscriber.findOneAndDelete({userTo:req.body.userTo, userFrom:req.body.userFrom})
    .exec((err, doc)=>{
        if(err) return res.status(400).json({success:false, err})
        res.status(200).json({success:true, doc})
    })
});

router.post('/Subscribe', (req, res)=>{
    //데이터베이스에 userto와 userfrom을 저장하기 위해 하나를 만든다
    //이 인스턴스에는 모든 usertom userFrom의 정보를 넣어준다.
    const subscribe = new Subscriber(req.body)
    subscribe.save((err, doc)=>{
        if(err) return res.json({success:false, err})
        res.status(200).json({success:true})
    })
});
module.exports = router;

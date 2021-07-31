const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
const { response } = require('express');


//=================================
//             Video
//=================================
//여기서는 req가 파일을 받는방식이다.

var storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "uploads/");
    },//파일이 저장되는위치
    filename: (req, file, cb)=>{
        cb(null, `${Date.now()}_${file.originalname}`);
    },//파일이 저장되는이름 -> 시간_파일의 이름
    fileFilter:(req, file, cb)=>{
        const ext = path.extname(file.originalname)
        if(ext!=='.mp4'){//파일의 형식은 오직 mp4만 되게
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
})
//storage는 옵션같은 의미이다 이 옵션을 upload변수에 넣어준것이다.
const upload = multer({storage:storage}).single("file");
//위의 storage옵션들을 multer에 넣어주고 파일은 single(하나만 올릴수있게)해준것

router.post('/uploadfiles', (req, res)=>{
    //비디오를 서버에 저장한다
    upload(req,res, err=>{
        if(err){
            return res.json({success:false, err})
        }
        return res.json({success:true, filePath:res.req.file.path, fileName:res.req.file.filename})
    })//성공한다면 파일의 위치와 이름도 같이 보내준다
});


router.post('/thumbnail', (req, res)=>{  
    //썸네일 생성하고 비디오 러닝타임같은 정보도 가져오기
    
    let filePath="";
    let fileDuration="";


    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        console.dir(metadata);//probe가 metadata를가져와준다
        console.log(metadata.format.duration);
        fileDuration=metadata.format.duration;
    })

    
    //썸네일 생성
    ffmpeg(req.body.url)//클라에서 온 비디오 저장 경로
    .on('filenames', function(filenames){
        console.log('Will generate'+filenames.join(', '))
        console.log(filenames)
        //썸네일 파일의 이름을 또 생성하는 것이다.
        filePath="uploads/thumbnails/" + filenames[0]
    })
    .on('end', function () {
        //썸네일 생성후에 무엇을 할 것인지 여기에 작성한다
        console.log('Screenshots taken');
        return res.json({success: true, url:filePath, fileDuration:fileDuration})
    })
    .on('error', function (err){
        //에러발생시의 어떻게 동작할 것인지
        console.log(err);
        return res.json({success:false, err});
    })
    .screenshot({
        //옵션을 주는것이다
        //3개의 썸네일을 찍고 저장하고 사이즈까지 지정
        count:3,
        folder:'uploads/thumbnails',
        size:'320x240',
        filename:'thumbnail-%b.png'
    })

})

router.post('/uploadVideo', (req, res)=>{
    //비디오 정보들을 저장한다.
    const video = new Video(req.body)
    //req.body를 하게 되면 클라에서 보냈던 variables(모든정보)를 Video에 담게 된다.
    video.save((err, doc)=>{//save라는 몽고명령어를 써서 몽고에 저장한다
        if(err) return res.json({success:false, err})
        res.status(200).json({success:true})
    })


})

router.get('/getVideos', (req, res)=>{
    //비디오를 db에서 가져와서 클라에 보낸다.
    Video.find()//이러면 Video콜렉션ㅇ 안에 있는 모든 비디오를 가져오는 것이다.
        .populate('writer')//populate를 해줘야 모든 writer정보를 가져올수있고 해주지 않는다면 id만 오는것이다
        .exec((err, videos)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({success:true, videos})
        })

})
//클라에서 비디오 ID를보내고있기 때문에 ID를 이용해서 비디오 정보를 가져와야한다.
router.post('/getVideoDetail', (req, res)=>{
    Video.findOne({"_id":req.body.videoId})
    //Video모델을 이용해서 비디오를 찾는다
        .populate('writer')//이걸 해주지 않는다면 비디오의 Id만 오게된다
        //이걸해주면 비디오의 모든 정보를 알 수 있다.
        .exec((err, videoDetail)=>{
            if(err) return res.status(400).send(err)
            return res.status(200).json({success:true, videoDetail })
        })

});





module.exports = router;

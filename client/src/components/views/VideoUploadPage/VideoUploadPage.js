//리액트 훅이 나온 후로 functinal 컴포넌트를 사용했다
import React ,{useState} from 'react'
import {Typography, Button, Form, message, Input, Icon} from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import {useSelector} from 'react-redux';

const {TextArea} = Input;
const {Title} = Typography;
const PrivateOptions = [
    {value:0, label:"Private"},
    {value:1, label:"Public"}
]

const CategoryOptions =[
    {value:0, label: "Flim & Animation"},
    {value:1, label: "Autos & Vehicles"},
    {value:2, label: "Music"},
    {value:3, label: "Pets & Animals"}
]


function VideoUploadPage(props) {
    const user = useSelector(state => state.user);
    //redux에서 가지고 있는 state에서 state user의 정보를 가져오는것이다.
    //따라서 이정보들은 user에 담기게 되는 것이다 이 정보들을 onClick variables에 넣어준다
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film & Animation")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")



    const onTitleChange = (e) =>{
        //스테이트를 바꿔줄때에는 setVideoTtitle을 이용해서 바꿔준다
        setVideoTitle(e.currentTarget.value)
    }

    const onDesciptionChange = (e) =>{
        //스테이트를 바꿔줄때에는 setVideoTtitle을 이용해서 바꿔준다
        setDescription(e.currentTarget.value)
    }
    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }
    const onCategoryChange = (e) =>{
        setCategory(e.currentTarget.value)
    }
    const onDrop = (files) => { 
        let formData = new FormData;
        const config = {
            header: {'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])
//Axios로 post로 보낼때 위의 절차처럼 header에 저런걸 보내주지 않는다면 오류가 발생한다
//files파라미터는우리가 파일을 올렸을때 그 파일의정보를말한다
        Axios.post('/api/video/uploadfiles', formData, config)
        .then(response => {
            if(response.data.success){

                let variable={
                    url: response.data.filePath,
                    fileName: response.data.fileName
                }
                setFilePath(response.data.url)

                Axios.post('/api/video/thumbnail', variable)
                .then(response=>{
                    if(response.data.success){
                        setDuration(response.data.fileDuration)
                        setThumbnailPath(response.data.url)
                    }else{
                        alert("썸네일 생성에 실패 했습니다.")
                    }
                })

            }else{
                alert('비디오 업로드를 실패했습니다.')
            }
        })
    }
//항상 이걸작성하고 AXIOS.POST에대한 라우터를 서버쪽에 만든다!
//먼저 리퀘스트를 보내면 서버의 index.js로 간다 
//index에서 app.use로 라우트로 보내주면 video에서 작성하는방식이다.`
const onSubmit = (e) => {
    e.preventDefault();//원래 클릭하면 하려고했던것을 방지하고 우리가 하고싶은것을 사용할 수 있게 해준다
    const variables={
        writer: user.userData._id,
        title: VideoTitle,//여기서부터는 이미 위 state에서 가지고 있어서 그래도 복사해준다
        description: Description,
        privacy: Private,
        filePath: FilePath,
        category: Category,
        duration: Duration,
        thumbnail: ThumbnailPath

    }
    
    
    Axios.post('/api/video/uploadVideo', variables)
    .then(response=>{
        if(response.data.success){
            message.success('성공적으로 업로드를 완료했습니다.')
            setTimeout(()=>{
                props.history.push('/')
                //3초뒤에 업로드를 하고 루트페이지로 돌아가도록 시키는 것
            }, 3000);
           
           
           
           
        }else{
            alert('비디오 업로드에 실패했습니다.')
        }
    })
}



    return (
        <div style={{ maxWidth:'700px', margin:'2rem auto'}}>
            <div style={{textAlign:'center', marginBottom:'2rem'}}>
                <Title level={2}>Upload Video</Title>

            </div>
            <Form onSubmit={onSubmit}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    {/*drop zone*/}
                    <Dropzone 
                    onDrop={onDrop}
                    multiple={false}
                    //한번올릴때 여러개의 파일을 올릴것인지
                    maxSize={800000000}
                    //파일의 크기
                    >
                    
                    {({ getRootProps, getInputProps})=>(
                        <div style={{ width:'300px', height:'240px', border:'1px solid lightgray', 
                        alignItems:'center', justifyContent:'center'}} {...getRootProps()}>
                            <input {...getInputProps()}/>
                            <Icon type="plus" style={{fontSize:'3rem'}}/>
                        </div>
                    )}

                    </Dropzone>

                    {/*Thumbnail*/}
                        //src에는 썸네일 경로가 들어있는 ThumbnailPath를 넣어준다
                   {ThumbnailPath &&
                    <div>
                        <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail"/>
                    </div>
                    }
            </div>

            <br />
            <br />
            <label>Title</label>
            <Input 
                onChange={onTitleChange}
                value={VideoTitle}
            />
            <br />
            <br />
            <label>Description</label>
            <TextArea
            //onChange를 만들어줘야 이칸을 작성할 수 있어진다.
                onChange={onDesciptionChange}
                //위에 따로 onDescriptionChange를 만들어줘야한다
                value={Description}
                //이렇게 useState를 사용해주면서 나중에 데이터를 보내줄때 한번에 보낼줄수 있게된다
                />

            <br />
            <br />

            <select onChange={onPrivateChange}>

                {PrivateOptions.map((item, index)=>(
                <option key={index} value={item.value}>{item.label}</option>    
                ))}
            </select>
            <br />
            <br />
 
            <select onChange={onCategoryChange}>
            {CategoryOptions.map((item, index)=>(
                <option key={index} value={item.value}>{item.label}</option>    
                ))}
            </select>
            <br />
            <br />

            <Button type="primary" size="large" onClick={onSubmit}>
                Submit
            </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage

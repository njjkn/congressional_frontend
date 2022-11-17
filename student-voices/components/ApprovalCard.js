import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0';
import Button from '@mui/material/Button';

const ApprovalCard = (props) => {
    const [userInfo, setUserInfo] = useState(null)
    const { user, error, isLoading } = useUser();

    const router = useRouter()

    const onPostSelect = () => {
        console.log("getting the post")
        var postID = String(props.postId)
        localStorage.setItem("postID", postID)
        console.log(postID)
        if (user) {
            router.push("/preview")
        } else {
            router.push("/api/auth/login")
        }
    }

    useEffect(() => {
        console.log("entered useEffect for approval card")
        const getUser = async() => {
            console.log("getting the user")
            var userId = props.userId
            console.log("userID: ", userId)
            var user = await axios.get(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/user/${userId}`)
            user = user.data
            console.log("got the user: ", user)
            setUserInfo(user)
        }
        getUser();
    }, []);

    const accept = async() => {
        console.log("accepting post ", props.postId)
        var approved = await axios.put(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/update/post/approval/${props.postId}`, {})
        console.log("clicked accept ", approved.data)
        router.reload()
    }

    const deny = async() => {
        console.log("denying post ", props.postId)
        var denied = await axios.delete(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/remove/post/${props.postId}`)
        console.log("clicked deny ", denied)
        router.reload()
    }

    return (
            <Card sx={{ width: 225 , height: 215}}>
                <Box sx={{pl: 2.5, pt: 1.25}}>
                    <div onClick = {onPostSelect}>
                    <Typography variant="h5" component="div">
                    {props.title}
                    </Typography>
                    </div>
                    <Box pt={1.25}>
                        <Typography variant="body1">
                            {props.date}
                            <br/>
                            author: 
                            {
                                userInfo &&
                                userInfo.username
                            }
                            <br/>
                            grade:
                            {
                                userInfo &&
                                userInfo.grade
                            }
                        </Typography>
                        <Button variant="outlined" onClick={() => accept()}>ACCEPT</Button>
                        <Button variant="outlined" onClick={() => deny()}>DENY</Button>
                    </Box>
                </Box>
            </Card>
    )
}

export default ApprovalCard
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import PendingIcon from '@mui/icons-material/Pending';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { useUser } from '@auth0/nextjs-auth0';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import styled from "styled-components";

const PostCard = (props) => {
    const [userInfo, setUserInfo] = useState(null)
    const { user, error, isLoading } = useUser();
    const [checked, setChecked] = useState(false);
    const [likes, setLikes] = useState("likes")
    const [isAdmin, setIsAdmin] = useState(false);
    const [postStatus, setPostStatus] = useState("");

    console.log("props likes ",props.likes)
    var status = props.status;
    var statusIcon = null;
    var statusColor = "";

    if (status == "resolved") {
        statusIcon = <DoneIcon/>
        statusColor = "green"
    } else if (status == "pending") {
        statusIcon = <PendingIcon/>
        statusColor = "#dce02f"
    } else {
        statusIcon = <CancelIcon/>
        statusColor = "red"
    }

    const router = useRouter()

    const onPostSelect = () => {
        console.log("getting the post")
        var postID = String(props.postId)
        localStorage.setItem("postID", postID)
        console.log(postID)
        if (user) {
            router.push("/post")
        } else {
            router.push("/api/auth/login")
        }
        
    }

    useEffect(() => {
        console.log("entered useEffect for post card")
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

        var currentUser = localStorage.getItem('userIdStr')
        var postLikesList = props.likes

        if (postLikesList.includes(currentUser)) {
            setChecked(true)
            console.log("current user liked the post")
        } else {
            setChecked(false)
            console.log("current user didnt like the post")
        }

        if (postLikesList.length == 1) {
            setLikes("like")
        }

        const checkAdmin = async() => {
            var email = localStorage.getItem('userEmail')
            var logUser = await axios.get(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/user/email/${email}`)
            logUser = logUser.data
            console.log("logUser ", logUser)
            setIsAdmin(logUser.isStudentRep)
            if (logUser.isStudentRep) {
              localStorage.setItem('isAdmin', true)
            }
            console.log("is this user an admin post card", logUser.isStudentRep)
          }
    
          checkAdmin()
    }, []);

    const handleChange = async(event) => {
        console.log("handle change to change status of card")
        var status = String(event.target.value)
        console.log("changing status to ", status)
        var postId = String(props.postId)
        var post = await axios.get(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/post/${postId}`)
        post = post.data
        console.log("post ",post)
        let updatedStatus = {    
            comments: props.comments,
            userID: props.userId,
            likes: props.likes,
            title: props.title,
            content: props.content,
            date: props.date,
            status: status,
            grade: props.grade,
            isSchoolWide: props.isSchoolWide,
            isApproved: true,
        }
        console.log("updated status ", updatedStatus)
        var changedStatus = await axios.put(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/update/post/status/${postId}/${props.userId}`, updatedStatus)
        router.reload()
    };

    return (
        <div>
            {!isAdmin &&
                <Card sx={{ width: 225 , height: 240}}>
                    <Box sx={{pl: 2.5, pt: 1.25}}>
                        <Typography variant="h5" component="div">
                            <div onClick = {() => onPostSelect()}>
                                {props.title}
                            </div>
                        </Typography>
                        <Box pt={1.25}>
                            <Typography variant="body1">
                                {props.date}
                                <br/>
                                {props.likes.length} {likes}
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
                                <p style={{fontWeight: '600', color: `${statusColor}`}}>status: {props.status} {statusIcon}</p>
                            </Typography>
                        </Box>
                    </Box>
                </Card>
            }
            {isAdmin && 
                <Card sx={{ width: 225 , height: 300}}>
                    <Box sx={{pl: 2.5, pt: 1.25}}>
                        <Typography variant="h5" component="div">
                            <div onClick = {() => onPostSelect()}>
                                {props.title}
                            </div>
                        </Typography>
                        <Box pt={1.25}>

                            <Typography variant="body1">
                                {props.date}
                                <br/>
                                {props.likes.length} {likes}
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
                                <p style={{fontWeight: '600', color: `${statusColor}`}}>status: {props.status} {statusIcon}</p>
                            </Typography>

                            <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                                <InputLabel id="demo-select-small">Status</InputLabel>
                                <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={postStatus}
                                label="Status"
                                onChange={handleChange}
                                >
                                <MenuItem value={"unresolved"}>Unresolved</MenuItem>
                                <MenuItem value={"resolved"}>Resolved</MenuItem>
                                <MenuItem value={"pending"}>Pending</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </Card>
            }
        </div>
    )
}

export default PostCard
import { useEffect, useState, useRef, Fragment } from 'react';
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";
import date from "date-and-time";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import PendingIcon from '@mui/icons-material/Pending';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Button from '@mui/material/Button';
import axios from 'axios'

export default function PostContent({postJSON , userJSON}) {
    const [checked, setChecked] = useState(false);
    const [likes, setLikes] = useState(0)
    const [currentUserID, setCurrentUserID] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        var currentUser = localStorage.getItem('userIdStr')
        setLoggedInUser(currentUser)

        var isLiked = false;
        var userId = localStorage.getItem('userIdStr')
        setCurrentUserID(userId)

        if (postJSON) {
            console.log("likes list ", postJSON.likes)

            if (postJSON.likes.includes(userId)) {
                console.log("this post has been liked by the user already ", postJSON)
                isLiked = true;
            }
        
            if (isLiked == true) {
                setLikes(postJSON.likes.length)
                setChecked(true)
            } else {
                setLikes(postJSON.likes.length)
                setChecked(false)
            }
        }
    }, []);

    var statusColor = "";
    var statusIcon = null;
  
    if (postJSON) {
      if (postJSON.status == "resolved") {
        statusIcon = <DoneIcon/>
        statusColor = "green"
      } else if (postJSON.status == "pending") {
        statusIcon = <PendingIcon/>
        statusColor = "#dce02f"
      } else {
        statusIcon = <CancelIcon/>
        statusColor = "red"
      }
    }

    const onLikeClick = async() => {
        //var userId = localStorage.getItem('userIdStr')
        console.log("the user who liked the comment is ", currentUserID)
        console.log("the comment being liked is ", postJSON._id)
        console.log("checked state on like: ", checked)
        // likes api
    
        // check if checked state is false, if false call the api 
        // then set like and then set checked
        if (checked == false) {
            console.log("checked false")
            var res = await axios.put(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/update/post/likes/${postJSON._id}/${currentUserID}`)
            console.log("the res when liking a comment ", res.data)
            setLikes(res.data.likes.length)
            setChecked(!checked)
        } else { // checked true
            console.log("checked true")
            var res = await axios.put(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/update/post/likes/${postJSON._id}/${currentUserID}`)
            console.log("the res when unliking a comment ", res.data)
            setLikes(res.data.likes.length)
            setChecked(!checked)
        }
    
        console.log("checked state after like: ", checked)
        console.log("the comment has been liked, currentlikes is ", likes)
    }
    
    const handleChange = () => {
        if (checked == false) {
            setChecked(true)
            setLikes(postJSON.likes.length)
        } else {
            setChecked(false)
            setLikes(postJSON.likes.length)
        }
    }

    return (
        <div>
            <Box pl={1} pt={0.5}>
                <a href="/landing">Back to landing page</a>
            </Box>
            <br/>
                <Box sx={{pl: 36, pt:1.5}}>
                <Card sx={{ width: 850 , maxheight: 1000, alignContent: 'center'}}>
                    <Box sx={{pl: 2.5, pt: 1.5, pr: 2.5}}>
                    <Typography variant="h4" component="div">
                        {postJSON.title}
                    </Typography>
                    <Box sx={{pl: 82}}>
                        <h3 style={{fontWeight: '100', color: `${statusColor}`}}>status: {postJSON.status} {statusIcon}</h3>
                    </Box>
                    <Typography variant="h6" component="div">
                        posted on {postJSON.date}
                    </Typography>
                    <Box pt={1.25}>
                    <Typography variant="body1">
                        <div onClick = {() => {
                            handleChange();
                            onLikeClick();
                        }}>
                            {checked ? <FavoriteIcon/> : <FavoriteBorder/>}
                        </div>
                        {likes}
                        <br/>
                        {postJSON.content}
                        <Box sx={{pl: 84, pt: 1}}>
                        <Avatar sx={{ width: 35, height: 35 }}>
                            {userJSON.username.charAt(0)}
                        </Avatar>
                        {userJSON.username}
                        </Box>
                        <br/>
                    </Typography>
                    </Box>
                    </Box>
                </Card>
                </Box>
            <br/>
        </div>
    )
}
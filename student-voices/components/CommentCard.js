import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
// import { handleInputChange } from 'react-select/dist/declarations/src/utils';

const CommentCard = ({commentJSON}) => {
    const [user, setUser] = useState(null);
    const [checked, setChecked] = useState(false);
    const [likes, setLikes] = useState(0)
    const [currentUserID, setCurrentUserID] = useState(null);

    console.log("making comment: ", commentJSON)
    //var likesLength = commentJSON.likes.length

    useEffect(() => {
        const getUser = async() => {
            console.log("user id for comment: ", commentJSON.userID)
            var userData = await axios.get(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/user/${commentJSON.userID}`)
            userData = userData.data 
            console.log("got user for comment: ", userData)
            setUser(userData)
        }
        getUser()
        var isLiked = false;
        var userId = localStorage.getItem('userIdStr')
        setCurrentUserID(userId)
        // make sure you actually get back user id
        // also make sure the user id is inside the likes list
        console.log("likes list ", commentJSON.likes)
        if (commentJSON.likes.includes(userId)) {
            console.log("this comment has been liked by the user already ", commentJSON._id)
            isLiked = true;
        }

        if (isLiked == true) {
            setLikes(commentJSON.likes.length)
            setChecked(true)
        } else {
            setLikes(commentJSON.likes.length)
            setChecked(false)
        }

        console.log("checked state: ", checked)
    }, []);

    const onLikeClick = async() => {
        //var userId = localStorage.getItem('userIdStr')
        console.log("the user who liked the comment is ", currentUserID)
        console.log("the comment being liked is ", commentJSON._id)
        console.log("checked state on like: ", checked)
        // likes api

        // check if checked state is false, if false call the api 
        // then set like and then set checked
        if (checked == false) {
            console.log("checked false")
            var res = await axios.put(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/update/comment/likes/${commentJSON._id}/${currentUserID}`)
            console.log("the res when liking a comment ", res.data)
            setLikes(res.data.likes.length)
            setChecked(!checked)
        } else { // checked true
            console.log("checked true")
            var res = await axios.put(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/update/comment/likes/${commentJSON._id}/${currentUserID}`)
            console.log("the res when unliking a comment ", res.data)
            setLikes(res.data.likes.length)
            setChecked(!checked)
        }

        console.log("checked state after like: ", checked)
        console.log("the comment has been liked, currentlikes is ", likes)

        // else you still call the api 
        // set likes and then set checked 

        // you know how you did !checked that would be good to use in this scenario
    }

    const handleChange = () => {
        if (checked == false) {
            setChecked(true)
            setLikes(commentJSON.likes.length)
        } else {
            setChecked(false)
            setLikes(commentJSON.likes.length)
        }
    }

    return (
        <div>
            <Card sx={{ width: 850 , maxheight: 175}}>
                <Box sx={{pl: 2.5, pr: 2.5, pb:2.5}}>
                    <br/>
                    <Stack>
                        <div onClick = {() => {
                            handleChange();
                            onLikeClick();
                        }}>
                            {checked ? <FavoriteIcon/> : <FavoriteBorder/>}
                        </div>
                        {likes}
                    </Stack>
                    <br/>
                    {commentJSON.content}
                    <br/>
                    <Box sx={{pl: 84, pt: 1}}>
                        <Stack spacing={2}>
                            {
                                user &&
                                <Avatar sx={{ width: 35, height: 35 }}>
                                    {user.username.charAt(0)}
                                </Avatar>
                            }
                            {commentJSON.date}
                            <br/>
                            {
                                user &&
                                user.username
                            }
                        </Stack>
                    </Box>
                </Box>
            </Card>
        </div>
    )
}

export default CommentCard
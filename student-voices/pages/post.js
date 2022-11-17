import CommentCard from '../components/CommentCard'
import PostContent from '../components/PostContent'
import axios from 'axios'
import Link from 'next/link'
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
import { CoPresent, PropaneSharp } from '@mui/icons-material';
import { render } from 'react-dom'
import { useEffect, useState, useRef, Fragment } from 'react';
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";
import date from "date-and-time";
import Avatar from '@mui/material/Avatar';
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from 'next/router';

// /fetch/post/:postID"
const useStyles = makeStyles({
  field: {
    marginTop: 20,
    marginBottom: 20,
    display: "block",
  },
});

export default function Post() {
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [commentsList, setCommentsList] = useState([]);
  const [commentJSON, setCommentJSON] = useState(null);
  const contentRef = useRef();
  const classes = useStyles();
  const router = useRouter()
  const curUser = useUser()

  //console.log("this is commentsList: ", commentList)

  useEffect(() => {
    if (!curUser) {
      router.push('/signup')
    }
    setLoggedInUser(localStorage.getItem('userIdStr'))
    var postId = localStorage.getItem("postID")
    console.log("post id ", postId)
    // console.log("all commnts list: ", allCommentList)
    // var filteredCommentList = allCommentList.filter((comment) => !(postId != comment.postID))
    // console.log("filtered comment list: ",  filteredCommentList)
    // call api to get all comments for a post given a post id 
    // https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/post/comments/:postID

    var commentsData = axios.get(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/post/comments/${postId}`).then((commentsData) => {
      commentsData = commentsData.data
      console.log("got the comments for the post ", commentsData)
      setCommentsList(commentsData)
    })

    var postData = axios.get(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/post/${postId}`).then((postData) => {
      postData = postData.data
      console.log("got the post")
      console.log(postData)
      setPost(postData)
      var userId = postData.userID
      var userData = axios.get(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/user/${userId}`).then((userData) => {
        console.log("got the user")
        userData = userData.data
        console.log(userData)
        setUser(userData)
      })
    })
  }, [commentJSON]);

  const handleSubmit = async(e) => {
    e.preventDefault()
    console.log("calling the handle submit")
    console.log("current logged in user ", loggedInUser)
    var postId = String(post._id)
    console.log("making a comment on this post ", postId)
    const now = new Date();
    const timeStamp = date.format(now, "YYYY/MM/DD HH:mm:ss");
    console.log("this is time stamp: ", timeStamp);
    var commentJSON = {}
    commentJSON.userID = String(loggedInUser)
    commentJSON.postID = postId
    commentJSON.content = contentRef.current.value
    commentJSON.date = timeStamp
    commentJSON.likes = []
    console.log("you are making this comment ", commentJSON)
    await axios
    .post(
      "https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/make/post/comment",
      commentJSON
    )
    .then((res) => {
      setCommentJSON(commentJSON);
    })
    .catch((error) => {});

    contentRef.current.value = "";
  }

  const renderedComments = commentsList.map((comment) => {
    console.log("this is a comment: ", comment);
    return (
      <div>
        <Box pl={3} pt={3}>
          <CommentCard
            commentJSON = {comment}
          />
        </Box>
    </div>
    )
  })

  return (
    <div>
      {
        user && post && 
        <PostContent
          postJSON = {post}
          userJSON = {user}
        />
      }
      <Grid container spacing={1} justifyContent="center">
        {renderedComments}
      </Grid>
      <Box sx={{pl: 36, pt:3}}>
        <Card sx={{ width: 850 , maxheight: 1000, alignContent: 'center'}}>
          <form onSubmit={handleSubmit}>
            <TextField
              inputRef={contentRef}
              className={classes.field}
              type="text"
              label="share your thoughts"
              variant="outlined"
              color="secondary"
              multiline
              rows={4}
              fullWidth
            />
            <Button type="submit" color="secondary" variant="contained">
              Submit
            </Button>
          </form>
        </Card>
      </Box>
    </div>
  )
}

// export async function getServerSideProps() {
//   // find me api that gets me all comments in the data base
//   //https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/all/comments
//   const allCommentList = await (await axios.get("https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/all/comments")).data;
//   return {
//     props: { allCommentList },
//   };
// }
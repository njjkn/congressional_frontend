import PostContent from '../components/PostContent'
import axios from 'axios'
import { useEffect, useState } from 'react';
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function Preview() {
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter()
  const curUser = useUser()

  //console.log("this is commentsList: ", commentList)

  useEffect(() => {
    if (!curUser) {
      router.push('/signup')
    }
    var postId = localStorage.getItem("postID")
    console.log("post id ", postId)

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
  }, []);

  const accept = async() => {
    if (post.postId) {
      console.log("accepting post")
      var approved = await axios.put(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/update/post/approval/${post.postId}`, {})
      console.log("clicked accept ", approved.data)
      router.push('/admin')
    }
  }

  const deny = async() => {
    console.log("denying post ", props.postId)
    var denied = await axios.delete(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/remove/post/${props.postId}`)
    console.log("clicked deny ", denied)
    router.push('/admin')
  }

  return (
    <div>
      {
        user && post && 
        <PostContent
          postJSON = {post}
          userJSON = {user}
        />
      }
      <Box pl={36}>
        <Button variant="outlined" onClick={() => accept()}>ACCEPT</Button>
        <Button variant="outlined" onClick={() => deny()}>DENY</Button>
      </Box>
    </div>
  )
}
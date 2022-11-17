import Button from '@mui/material/Button';
import PostCard from '../components/PostCard';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Searchbar from '../components/Searchbar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useRouter } from 'next/router';
import { useUser } from "@auth0/nextjs-auth0";
import styled from "styled-components";
import {TextField} from "@material-ui/core";

const WhiteBorderTextField = styled(TextField)`
  & label.Mui-focused {
    color: white;
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: white;
    }
  }
`;

export default function Landing({schoolwidePostsList}) {
    const [gradePosts, setGradePosts] = useState([])
    const [allPosts, setAllPosts] = useState([])
    const [grade, setGrade] = useState(0)
    const [filteredPosts, setFilteredPosts] = useState([])
    const [isAdmin, setIsAdmin] = useState(false);
    const user = useUser()

    console.log("printing the schoolwidepostslist ", schoolwidePostsList)

    useEffect(() => {
      if (!user) {
        router.push('/signup')
      }

      console.log("RE RENDERING USE EFFECT")
      var userId = localStorage.getItem('userIdStr');
      // get user from email from token -> if user exists take to landing page if user doesnt exist take to sign up page
      const getPosts = async() => {
          const gradePosts = await axios.get(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/posts/grade/${userId}`)
          const gradeRes = gradePosts.data
          gradeRes = gradeRes.filter((post) => (post.isApproved === true))
          setAllPosts(gradeRes)
          gradeRes.sort(function (a, b) {
            return b.likes.length - a.likes.length;
          });
          gradeRes = gradeRes.slice(0, 10);
          console.log(gradeRes);
          setGradePosts(gradeRes);
      }
      getPosts();

      console.log("USE EFFECT FILTERED POSTS ", filteredPosts)
      // filteredPost param
      setFilteredPosts(schoolwidePostsList)

      const checkAdmin = async() => {
        var email = localStorage.getItem('userEmail')
        var logUser = await axios.get(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/user/email/${email}`)
        logUser = logUser.data
        console.log("logUser ", logUser)
        setIsAdmin(logUser.isStudentRep)
        if (logUser.isStudentRep) {
          localStorage.setItem('isAdmin', true)
        }
        console.log("is this user an admin ", logUser.isStudentRep)
      }

      checkAdmin()
    }, []);

    const renderedGrade = gradePosts.map((post) => {
      console.log("mapping through grade posts")
      console.log(post);
      return (
        <Box pl={3} pt={3}>
          <PostCard
            title = {post.title}
            date = {post.date}
            likes = {post.likes}
            status = {post.status}
            postId = {post._id}
            userId = {post.userID}
            comments = {post.comments}
            content = {post.content}
            grade = {post.grade}
            isSchoolWide = {post.isSchoolWide}
          />
        </Box>
      )
    })

    // you are going to loop through the new merged list
    // before loop make empty list called optioms
    // before loop make var valueCount and set to zero 
    // inside the loop create a empty json
    // create three keys for json called value, label, postId
    // once you set the key and values push that json into options array

    // if statement to check if gradeposts state has actual things inside 

    const text= {
      color: 'white',
    };

    const handleChange = async(event) => {
      console.log("event: ", event.target.value)
      let selectedGrade = String(event.target.value)
      var filteredPostsData = await axios.get(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/posts/specific/grade/${selectedGrade}`)
      filteredPostsData = filteredPostsData.data
      filteredPostsData = filteredPostsData.filter((post) => (post.isApproved === true))
      filteredPostsData = filteredPostsData.slice(0, 10);
      console.log("filtered post data ", filteredPostsData)
      setFilteredPosts(filteredPostsData)
    };

    const router = useRouter()

    const makePost = () => {
      router.push('/makepost')
    }

    const profilePage = () => {
      localStorage.setItem('studentProfileId', localStorage.getItem('userIdStr'));
      router.push('/profile')
    }

    const adminPage = () => {
      
      router.push('/admin')
    }

    const renderedFilteredPosts = filteredPosts.map((post) => {
      console.log("mapping through filtered posts ", post)
      return (
        <Box pl={3} pt={3}>
          <PostCard
            title = {post.title}
            date = {post.date}
            likes = {post.likes}
            status = {post.status}
            postId = {post._id}
            userId = {post.userID}
            comments = {post.comments}
            content = {post.content}
            grade = {post.grade}
            isSchoolWide = {post.isSchoolWide}
          />
        </Box>
      )
    })
 
    return (
      <div>
        <Box pl={12.25}>
          <h1 style={text}>Welcome to Student Voices!</h1>
          {isAdmin &&
            <div>
              <h1 style={text}>You are viewing this page as an admin.</h1>
            </div>
          }
          <FormControl sx={{ m: 1, minWidth: 120, color: "white" }} size="small">
            <InputLabel id="demo-simple-select-standard-label">Grade</InputLabel>
            <Select
              className="select"
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={grade}
              label="Grade"
              onChange={handleChange}
            >
            <MenuItem value={1}>None</MenuItem>
            <MenuItem value={9}>9</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={11}>11</MenuItem>
            <MenuItem value={12}>12</MenuItem>
            </Select>
          </FormControl>
          {isAdmin &&
            <div>
              <Button variant="outlined" onClick={() => adminPage()}>manage</Button>
              <Button variant="outlined" onClick={() => makePost()}>make a post</Button>
              <Button variant="outlined" onClick={() => profilePage()}>profile</Button>
            </div>
          }
          {
            !isAdmin &&
            <div>
              <Button variant="outlined" onClick={() => makePost()}>make a post</Button>
              <Button variant="outlined" onClick={() => profilePage()}>profile</Button>
            </div>
          }
        </Box>
        <br/>
        <div>
          <Box pl={12.25}>
            <h1 style={text}>Schoolwide posts</h1>
          </Box>
          <Grid container spacing={1.25} justifyContent="center">
            {renderedFilteredPosts}
          </Grid>
        </div>
        <br/>
        <Box pl={12.25}>
          <h1 style={text}>Posts in your grade</h1>
          {
            allPosts.length > 0 &&
            <Searchbar gradePosts={allPosts}/>
          }
        </Box>
        <br/>
        <Grid container spacing={1.25} justifyContent="center">
          {renderedGrade}
        </Grid>
        <a href="/api/auth/logout">Logout</a>
      </div>
    )
}

// https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/posts/specific/grade/10

export async function getServerSideProps() {
  const response = await axios.get("https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/posts/schoolwide");
  var schoolwidePostsList = response.data
  schoolwidePostsList = schoolwidePostsList.filter((post) => (post.isApproved === true))
  
  schoolwidePostsList.sort(function (a, b) {
    return b.likes.length - a.likes.length;
  });
  schoolwidePostsList = schoolwidePostsList.slice(0, 10);

  return {
    props: {schoolwidePostsList},
  };
}
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import styled from "styled-components";
import Card from '@mui/material/Card';
import { useUser } from "@auth0/nextjs-auth0";
import PostCard from '../components/PostCard';
import Grid from '@mui/material/Grid';

const Text = styled.div`
  .text-field {
    color: white;
  }
`;

export default function Profile({allPosts}) {
    console.log("all posts ", allPosts)
    const [curUser, setCurUser] = useState(null);
    const user = useUser()
    const router = useRouter()


    var resolved = []
    var pending = []
    var unresolved = []
    

    useEffect(() => {
        if (!user) {
            router.push("/signup")
        }
        console.log("rendering current student ", localStorage.getItem('studentProfileId'))

        const getUser = async() => {
            var user = await axios.get(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/user/${localStorage.getItem('studentProfileId')}`)
            user = user.data
            console.log("user ", user)
            setCurUser(user)
        }
        getUser()

        var userFilteredPosts = allPosts.filter((post) => (post.userID === localStorage.getItem('studentProfileId')))
        console.log("user filtered post ", userFilteredPosts)
        resolved = userFilteredPosts.filter((post) => (post.status === "resolved"))
        pending = userFilteredPosts.filter((post) => (post.status === "pending"))
        unresolved = userFilteredPosts.filter((post) => (post.status === "unresolved"))
        console.log("resolved ",resolved)
        console.log("pending ",pending)
        console.log("unresolved ",unresolved)
    }, []);

    const renderedResolved = resolved.map((post) => {
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
    })

    const renderedPending = pending.map((post) => {
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
    })
    
    var renderedUnresolved = []
    if (unresolved.length > 0) {
        console.log("unresolved length > 0")
        renderedUnresolved = unresolved.map((post) => {
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
        })
    }
    

    return (
        <div>
            <Box pl={12.25} pt={3}>
                <Card sx={{ width: 225 , height: 160}}>
                    <Box pl={2}>
                        <div className="text-field">
                            <h2>Student profile</h2>
                            {
                                curUser &&
                                <p>
                                    username: {curUser.username}
                                    <br/>
                                    grade: {curUser.grade}
                                    <br/>
                                    bio: {curUser.bio}
                                    <br/>
                                </p>
                            }
                        </div>
                    </Box>
                </Card>
                <br/>
                <Text>
                    <h2>
                        Student posts:
                    </h2>
                </Text>
            </Box>
            <Grid container spacing={1.25} justifyContent="center">
                {
                    renderedUnresolved
                }
            </Grid>
        </div>
    )
}

export async function getServerSideProps() {
    var allPosts = await axios.get("https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/all/users/posts")
    allPosts = allPosts.data
    return {
      props: {allPosts},
    };
  }
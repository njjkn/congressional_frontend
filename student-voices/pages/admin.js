import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useEffect} from 'react';
import axios from 'axios';
import styled from "styled-components";
import ApprovalCard from '../components/ApprovalCard';
import Button from '@mui/material/Button';

const Text = styled.div`
  .text-field {
    color: white;
  }
`;

export default function Admin({unresolvedPosts}) {
    const user = useUser() // logged in user
    const router = useRouter()
    console.log("list of unresolved ",unresolvedPosts)

    useEffect(() => {
        if (!user) {
          router.push('/signup')
        }
        var admin = localStorage.getItem('isAdmin')
        console.log("admin status ", admin)
        if (!admin) {
            router.push('/landing');
        }
    }, []);

    const renderedUnresolved = unresolvedPosts.map((post) => {
        console.log("mapping through unresolved posts for admin")
        console.log(post);
        return (
          <Box pl={3} pt={3}>
            <ApprovalCard
              title = {post.title}
              date = {post.date}
              likes = {post.likes}
              status = {post.status}
              postId = {post._id}
              userId = {post.userID}
            />
          </Box>
        )
    })

    return (
        <div>
            <div>
                <Text>
                    <h1 className="text-field">You are viewing this page as an admin.</h1>
                    <br/>
                    <h1 className="text-field">List of unresolved posts</h1>
                </Text>
                <Grid container spacing={1.25} justifyContent="center">
                    {renderedUnresolved}
                </Grid>
            </div>
        </div>
    )
}

export async function getServerSideProps() {
    var unresolvedPosts = await axios.get('https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/status/all/posts/unresolved')
    unresolvedPosts = unresolvedPosts.data
    unresolvedPosts = unresolvedPosts.filter((post) => (post.isApproved === false))
  
    return {
      props: {unresolvedPosts},
    };
}
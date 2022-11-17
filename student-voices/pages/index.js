import Login from '../components/Login'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { withStyles } from "@material-ui/core/styles";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router'
import { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import axios from 'axios'

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'Helvetica',
      textTransform: 'none',
      fontSize: 60,
      color: "white"
    },
  },
});

const theme2 = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'Helvetica',
      textTransform: 'none',
      fontSize: 20,
      color: "white"
    },
  },
});


export default function Home() {
  const { user, error, isLoading } = useUser();
  const router = useRouter()

  useEffect(() => {
    // get user from email from token -> if user exists take to landing page if user doesnt exist take to sign up page
    const getUser = async() => {
      if (user) {
        console.log("i hit the use effect")
        const email = user.email
        console.log(email)
        var userInfo = null
        try {
          userInfo = await axios.get(`https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/fetch/user/email/${email}`)
        } catch(err) {
          console.log(err)
        }

        if (userInfo) { // user exists
          var userIdStr = String(userInfo.data._id)
          localStorage.setItem('userIdStr', userIdStr);
          localStorage.setItem('userEmail', user.email)
          const userData = userInfo.data;
          console.log("index userdata ",userData);
          router.push("/landing")
        } else {
          console.log("user does not exist, signing up ",userInfo)
          router.push("/signup")
        }
      }
    }

    getUser();
  }), []

  const checkAuthentication = () => {
    console.log("signing in")
    router.push("/api/auth/login")
  }

  const checkAuthentication2 = () => {
    router.push("/api/auth/logout")
  }

  return (
    <div>
      <Box pt={20} pl={66}>
        <ThemeProvider theme={theme}>
          <Typography>
            Student Voices
          </Typography>
        </ThemeProvider>
        <br/>
        <Box pl={5}>
          <ThemeProvider theme={theme2}>
            <Typography>
              Rethinking the student government
            </Typography>
          </ThemeProvider>
        </Box>
        <br/>
        <Box pl={9}>
          <Card sx={{ maxWidth: 250 }}>
            <img src="https://i.ibb.co/1QzKKHV/LOGO.png" width="250" height="250"/>
          </Card>
        </Box>
        <br/>
        <Box pl={19}>
          <Button variant="outlined" style={{maxWidth: '100px', maxHeight: '50px', minWidth: '40px', minHeight: '40px', borderColor: 'white'}} onClick={()=>checkAuthentication()}>
            <Typography>
              Sign In
            </Typography>
          </Button>
        </Box>
        <br/>
        <Box pl={19}>
          <Button variant="outlined" style={{maxWidth: '100px', maxHeight: '50px', minWidth: '40px', minHeight: '40px', borderColor: 'white'}} onClick={()=>checkAuthentication2()}>
            <Typography>
              Sign Out
            </Typography>
          </Button>
        </Box>
      </Box>
    </div>
  )
}
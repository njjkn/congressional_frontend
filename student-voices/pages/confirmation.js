import { useRouter } from "next/router";
import styled from "styled-components";
import Button from '@mui/material/Button';

const Text = styled.div`
  .text-field {
    color: white;
  }
`;

export default function Confirmation() {

  const router = useRouter()

  const profilePage = () => {
    localStorage.setItem('studentProfileId', localStorage.getItem('userIdStr'));
    router.push('/profile')
  }

  return (
      <Text>
          <div className="text-field">
            <h2>Your post has been submitted and will be reviewed within 1 to 2 business days.</h2>
            <Button variant="outlined" onClick={() => profilePage()}>profile</Button>
          </div>
      </Text>
  )
}
import styled from "styled-components";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";

const SignupBlock = styled.div`
  padding-top: 11rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 10rem;
  .signup-form {
    display: flex;
    flex-direction: column;
  }
  .text-field {
    margin-bottom: 3rem;
    display: flex;
    flex-direction: column;
    font-family: lato;
    font-size: 2rem;
    color: white;
    & > label {
      margin-bottom: 1rem;
    }
  }
  .button {
    background-color: transparent;
    border: solid 0.3rem transparent;
    box-shadow: 0rem 0rem 1rem #c4c7cc;
    border-radius: 0.6rem;
    width: 12rem;
    color: rgb(32, 38, 46);
    font-size: 1.6rem;
    margin-bottom: 2rem;
    font-family: lato;
    font-weight: 900;
    :hover {
      border: 0.3rem solid gray;
    }
  }
`;

export default function Signup() {
    const user = useUser()
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("user signup ",user)

        const email = user.user.email
        const fullname = e.target.fullname.value
        const username = e.target.username.value
        const grade = e.target.grade.value
        const bio = e.target.bio.value

        let userJSON = {};
        userJSON.email = email
        userJSON.fullname = fullname
        userJSON.username = username
        userJSON.grade = grade
        userJSON.bio = bio
        userJSON.profileImage = ''
        userJSON.feedback = []
        userJSON.comments = []
        userJSON.isStudentRep = false
        userJSON.posts = []

        console.log("user is creating a new account ", userJSON)

        const userDocument = await axios.post(
        'https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/signup/user',
        userJSON
        );

        console.log("user document ", userDocument)

        if (userJSON.email && userJSON.fullname && userJSON.username && userJSON.grade) {
          console.log("creating user ")
            router.push('/landing');
        } else {
            router.reload();
        }
    };

  return (
    <SignupBlock>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="text-field">
          <label for="fullname">Enter your full name</label>
          <textarea
            rows="2"
            type="fullname"
            id="fullname"
            name="fullname"
            placeholder="Only your display name will be visible to others"
          />
        </div>

        <div className="text-field">
          <label for="username">Enter your display name</label>
          <textarea
            rows="7"
            type="username"
            id="username"
            name="username"
            placeholder="Your display name will be visible to others"
          />
        </div>

        <div className="text-field">
          <label for="bio">Enter a short description of yourself (optional)</label>
          <textarea
            rows="7"
            type="bio"
            id="bio"
            name="bio"
            placeholder="Your bio"
          />
        </div>

        <div className="text-field">
          <label for="grade">Enter the grade you are in.</label>
          <select id="grade" name="grade">
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
        </div>

        <input className="button" type="submit" value="Submit"></input>
      </form>
    </SignupBlock>
  );
}
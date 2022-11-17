import styled from "styled-components";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";
import date from "date-and-time";

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

export default function MakePost() {
    const user = useUser()
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("firstname :", e.target.firstname.value);

        //const name = e.target.firstname.value + " " + e.target.lastname.value;

        const title = e.target.title.value
        const content = e.target.content.value
        const schoolWide = e.target.schoolWide.value
        const grade = e.target.grade.value

        const now = new Date();
        const timeStamp = date.format(now, "YYYY/MM/DD HH:mm:ss");

        let postJSON = {};
        postJSON.title = title;
        postJSON.content = content;
        if (schoolWide == "true") {
            postJSON.isSchoolWide = true
        } else {
            postJSON.isSchoolWide = false
        }
        postJSON.comments = [];
        postJSON.userID = localStorage.getItem('userIdStr');
        postJSON.date = timeStamp;
        postJSON.grade = parseInt(grade);
        postJSON.likes = [];
        postJSON.status = "unresolved"
        postJSON.isApproved = false

        console.log("user is creating a post ", postJSON)
        // `https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/create/post/${localStorage.getItem('userIdStr')}`
        const postDocument = await axios.post(
          `https://guarded-retreat-82841.herokuapp.com/api/v1/student/voices/create/post/${localStorage.getItem('userIdStr')}`,
        postJSON
        );

        if (user && postJSON.title && postJSON.content && postJSON.grade) {
            router.push("/confirmation");
        } else {
            router.reload();
        }
    };

  return (
    <SignupBlock>
      <form className="signup-form" onSubmit={handleSubmit}>

        <div className="text-field">
          <label for="investmentPhilosophy">Title</label>
          <textarea
            rows="2"
            type="title"
            id="title"
            name="title"
            placeholder="The title of your post"
          />
        </div>

        <div className="text-field">
          <label for="content">Post contents</label>
          <textarea
            rows="7"
            type="content"
            id="content"
            name="content"
            placeholder="What would you like to talk about?"
          />
        </div>

        <div className="text-field">
          <label for="schoolWide">Is this a school-wide issue?</label>
          <select id="schoolWide" name="schoolWide">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div className="text-field">
          <label for="grade">Enter the grade it concerns.</label>
          <select id="grade" name="grade">
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
        </div>

        <div className="text-field">
          * School-wide means it affects the whole school
        </div>

        <input className="button" type="submit" value="Submit"></input>
      </form>
    </SignupBlock>
  );
}
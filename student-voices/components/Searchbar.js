import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import Select from 'react-select'
//import SearchIcon from "@material-ui/icons/Search";

const Searchbar = ({gradePosts}) => {
    const router = useRouter();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [value, setValue] = useState([]);

    useEffect(() => {
        console.log("this is gradeposts: ", gradePosts)
        var optionsList = [];
        var valueCounter = 0;
        // make another for loop that iterates through allPostsLists
        // inside the loop create a empty json
        // create three keys for json called value, label, postId
        // once you set the key and values push that json into options array
        for (var k = 0; k < gradePosts.length; k++) {
          var option = {};
          valueCounter++;
          option["value"] = valueCounter
          option["label"] = gradePosts[k].title
          option["postId"] = String(gradePosts[k]._id)
          optionsList.push(option);
        }
        console.log("this is options list: ", optionsList);
  
        setSelectedOptions(optionsList);
    }, [])

    const handleChange = (e) => {
      console.log("entered handle change")
      setValue({value: e});
      console.log("this is e: " , e)
      var postId = e.postId;
      console.log("postID in handle change ", postId)
      localStorage.setItem("postID", postId);
      router.push("/post")
    }

    // console.log(postList);
    return (
        <div>
            <Select options = {selectedOptions} placeholder = "Search for posts by grade" onChange = {handleChange}/>
        </div>
    )
}

export default Searchbar;
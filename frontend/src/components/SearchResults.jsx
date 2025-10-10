import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostCard from "./PostCard";


function SearchResults() {
  const [filterPost, setFilterPost] = useState([]);
  const { title } = useParams();
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/searchResults/${title}`
        );
        setFilterPost(response.data);
        console.log("filter: ",response.data)
      } catch (e) {
        console.log("err: ", e);
        alert("failed in fetching posts");
      }
    };
    fetchResult();
  }, []);

  return (
    <div>
      {/* POSTS */}
      <div className="space-y-10 flex flex-col justify-center items-center max-w-3xl mx-auto py-10">
        {filterPost.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default SearchResults;

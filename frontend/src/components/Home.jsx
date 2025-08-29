import React from 'react'
import Navbar from './Navbar'
import Categories from './Categories'
function Home() {
   const token = localStorage.getItem("jwt_token");
   console.log("token:",token)
  
  return (
    <div>
      <Navbar/>
      <Categories/>
    </div>
  )
}

export default Home

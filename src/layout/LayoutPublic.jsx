import React from "react";
import NavBar from "../components/NavBar";
import { Outlet , Navigate} from "react-router-dom";
export default function LayoutPublic() {

  const token = window.localStorage.getItem('ACCESS_TOKEN');
  if(token){
    console.log(token)
    return <Navigate to='/'/>

  }

  return (
    <>
    <NavBar />
      <Outlet />
    </>
  );
}

import React from "react";
import { redirect, Outlet, Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function LayoutPrivate() {

  const token = window.localStorage.getItem('ACCESS_TOKEN');
  if(!token){
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

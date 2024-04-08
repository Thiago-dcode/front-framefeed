import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import "./css/home.css";
import "./css/navbar.css";
import "./css/effects.css";
import "./css/post.css";
import "./css/index.css";
import './css/user.css'
import './css/postToEdit.css'
import './css/form.css'
import { router } from "./routes";
import { RouterProvider } from "react-router-dom";
ReactDOM.createRoot(document.getElementById("root")).render(
 
    <RouterProvider router={router} />

);

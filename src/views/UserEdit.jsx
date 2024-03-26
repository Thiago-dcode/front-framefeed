import React, { useEffect, useState } from "react";
import Api from "../api/Api";
import { useParams, useNavigate } from "react-router-dom";

import Form from "../components/Form";
import Input from "../components/Input";
import FileInput from "../components/FileInput";
import "../css/form.css";

export default function PostEdit() {
  const navigate = useNavigate("/");
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [userUpdated, setUserUpdated] = useState({});
  const [token, setToken] = useState("");
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [_username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);

  const getUser = async (post, controller) => {
    try {
      setIsPending(true);
      const { data } = await Api.get(post, {
        signal: controller.signal,
      });
      setName(data.name);

      setUsername(data.username);
      setEmail(data.email);

      setUser(data);
    } catch (error) {
      switch (error.response.status) {
        case 422:
          setError(error.response.data.errors);
          break;
        case 401:
          console.log(error.message);
          break;
        default:
          console.log(error);
          break;
      }
    } finally {
      setIsPending(false);
    }
  };
  const updateUser = async (formData, signal) => {
    try {
      setIsPending(true);
      const { data } = await Api.post(`/users/${user.username}`, formData, {
        signal,
      });
    if (!(data === undefined || data.length === 0)) {
        window.localStorage.setItem("user", JSON.stringify(data.user));
        window.localStorage.setItem("ACCESS_TOKEN", data.token);
        return navigate("/" + data.user.username);
      }
    } catch (error) {
      switch (error.response.status) {
        case 422:
          setError(error.response.data.errors);
          break;
        case 401:
          console.log(error.message);
          break;
        default:
          console.log(error.message);
          break;
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleSubmit = (e) => {
    setUserUpdated({});
    setError("");
    const controller = new AbortController();
    const signal = controller.signal;
    e.preventDefault();
    const formData = {
      name,
      username: _username,
      avatar: file,
      email,
      _method: "patch",
    };

    updateUser(formData, signal);
  };
  const handleStorage = () => {
    console.log(token);
    if (Object.keys(userUpdated.length === 0) || !token) return;
  };

  useEffect(() => {
    const usernameLoggedIn = JSON.parse(
      window.localStorage.getItem("user")
    ).username;
    if (usernameLoggedIn !== username) {
      return navigate("/");
    }
    const controller = new AbortController();
    getUser(`/users/${username}`, controller);

    return () => controller.abort();
  }, [username]);

  return (
    <>
      {Object.keys(user).length > 0 ? (
        <Form
        
          errors={error}
          isPending={isPending}
          style={{ top: "10%" }}
          handleSubmit={handleSubmit}
          title={`Edit your profile`}
          buttonText={"Update"}
          elements={[
            <Input
              handleInput={setName}
              name={"name"}
              style={{ width: "500px" }}
              value={name}
            />,
            <FileInput
              title={"Avatar"}
              prevImage={{
                image: user.avatar,
                shape: "avatar",
              }}
              handleFile={setFile}
            />,
            <Input
              handleInput={setUsername}
              value={_username}
              name="username"
              style={{ width: "500px" }}
            />,
            <Input
              handleInput={setEmail}
              value={email}
              name="email"
              type="email"
              style={{ width: "500px" }}
            />,
          ]}
        />
      ) : null}
    </>
  );
}

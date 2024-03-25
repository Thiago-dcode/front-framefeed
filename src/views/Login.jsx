import React, { useEffect, useState } from "react";
import Form from "../components/Form";
import Input from "../components/Input";
import Api from "../api/Api";
import { Navigate, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(window.localStorage.getItem("user"))
  );
  const [token, setToken] = useState(
    window.localStorage.getItem("ACCESS_TOKEN")
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const login = async (formData, signal) => {
    try {
      setIsPending(true);
      const { data } = await Api.post("/login", formData, { signal });
      setUser(data.user);
      setToken(data.token);
    } catch (error) {
      console.log(error);
      switch (error?.response?.status) {
        case 422:
          setError(error.response.data.errors);
          break;
        case 401:
          setError([error.response.data]);
          break;
        default:
          if (error instanceof AxiosError) {
            console.log(error.message)
            setError({
            'Internal':[ error.message]
            });
          }
          break;
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) return;
    const controller = new AbortController();
    const signal = controller.signal;

    login({ username, password }, signal);

    return () => controller.abort();
  };
  const handleLocalStorage = () => {
    if (!user || !token || error) return;
    window.localStorage.setItem("user", JSON.stringify(user));
    window.localStorage.setItem("ACCESS_TOKEN", token);

    navigate("/");
  };

  useEffect(() => {
    handleLocalStorage();
  }, [user, token]);

  useEffect(() => {
    if (user || token) navigate("/");
  }, []);


  return (
    <>
      {!user && !token ? (
        <Form
          errors={error}
          isPending={isPending}
          title={"Login"}
          handleSubmit={handleSubmit}
          buttonText={"Login!"}
          elements={[
            <Input
              handleInput={setUsername}
              value={username}
              name={"username"}
            />,

            <Input
              handleInput={setPassword}
              value={password}
              name={"password"}
              type="password"
            />,
          ]}
        />
      ) : null}
    </>
  );
}

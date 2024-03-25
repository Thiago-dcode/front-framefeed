import React, { useState } from "react";
import Form from "../components/Form";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import Api from "../api/Api";
import { useEffect } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(window.localStorage.getItem("user"))
  );
  const [token, setToken] = useState(
    window.localStorage.getItem("ACCESS_TOKEN")
  );
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPassWordConfirmation] = useState("");
  const [isPending, setIspending] = useState(false);
  const [error, setError] = useState(null);

  const newUser = async (formData, controller) => {
    try {
      setError("");
      setIspending(true);
      const {data} = await Api.post("/register", formData, {
        signal: controller.signal,
      });
      setUser(data.user)
      setToken(data.token)
    } catch (error) {
      if (error.response.status === 422) {
        setError(error.response.data.errors);
      } else {
        console.log(error);
      }
    } finally {
      setIspending(false);
    }
  };

  const handleSubmit = (e) => {
    const controller = new AbortController();
    e.preventDefault();
    const formData = {
      name,
      username,
      email,
      password,
      password_confirmation: passwordConfirmation,
    };
    newUser(formData, controller);

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

  useEffect(() => {
    setError("");
  }, [name, username, email, password, passwordConfirmation]);

  return (
    <>
      {!user && !token ? (
        <Form
          title={"Register"}
          handleSubmit={handleSubmit}
          buttonText={"Register!"}
          isPending={isPending}
          errors={error}
          elements={[
            <Input handleInput={setName} value={name} name={"name"} />,
            <Input
              handleInput={setUsername}
              value={username}
              name={"username"}
            />,
            <Input
              handleInput={setEmail}
              value={email}
              name={"email"}
              type="email"
            />,
            <Input
              handleInput={setPassword}
              value={password}
              name={"password"}
              type="password"
            />,
            <Input
              handleInput={setPassWordConfirmation}
              value={passwordConfirmation}
              name={"password-confirmation"}
              content={"password confirmation"}
              placeholder={"Confirm your password"}
              type="password"
            />,
          ]}
        />
      ) : null}
    </>
  );
}

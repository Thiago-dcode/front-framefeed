import React, { useEffect, useState } from "react";
import Api from "../api/Api";
import { useParams, useNavigate } from "react-router-dom";

import Form from "../components/Form";
import Input from "../components/Input";
import FileInput from "../components/FileInput";
import "../css/form.css";
import SearchByCategory from "../components/SearchByCategory";

export default function PostCreate() {
  const navigate = useNavigate();
  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [body, setBody] = useState("");



  const createPost = async (formData) => {
    try {
      setIsPending(true);
      const { data } = await Api.post("/posts", formData);
      if (!(data === undefined || data.length === 0)) {
        return navigate("/posts/" + data.post.slug);
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

  const handleCategories = (category) => {
    if (categoriesSelected.includes(category)) {
      const categoriesFiltered = categoriesSelected.filter(
        (cater) => cater !== category
      );

      setCategoriesSelected(categoriesFiltered);
      return;
    }
    setCategoriesSelected((prev) => [...prev, category]);
  };

  const categoriesToSubmit = categoriesSelected.join(",");

  const handleSubmit = (e) => {
    setError("");
    e.preventDefault();
    const formData = {
      user_id: userId,
      title,
      image: file,
      body,
      categories: categoriesToSubmit,
    };
    createPost(formData);
  };
  useEffect(() => {
    const userLocalStorage = JSON.parse(window.localStorage.getItem("user"));

    if (!userLocalStorage) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
      return navigate("/");
    }
    const controller = new AbortController();
    const signal = controller.signal;
    setUserId(userLocalStorage.id);
  
    return () => controller.abort();
  }, []);

  return (
    <Form
      isPending={isPending}
      errors={error}
      style={{ top: "10%" }}
      handleSubmit={handleSubmit}
      title={`Create your post`}
      buttonText={"Create"}
      elements={[
        <Input
          handleInput={setTitle}
          name={"title"}
          style={{ width: "500px" }}
          value={title}
        />,
        <FileInput title={"Image"} handleFile={setFile} />,

        <SearchByCategory
          className={"categories-form"}
          title={"Categories"}
          categoriesSelected={categoriesSelected}
          handleQuery={handleCategories}
        />,
        <Input
          handleInput={setBody}
          value={body}
          name="description"
          type="textarea"
          style={{ width: "500px" }}
        />,
      ]}
    />
  );
}

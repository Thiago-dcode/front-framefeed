import React, { useEffect, useState } from "react";
import Api from "../api/Api";
import { useParams, useNavigate } from "react-router-dom";

import Form from "../components/Form";
import Input from "../components/Input";
import FileInput from "../components/FileInput";
import "../css/form.css";
import SearchByCategory from "../components/SearchByCategory";
import LinkBroken from "../components/LinkBroken";

export default function PostEdit() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [post, setPost] = useState({});
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState("");
  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState(null);

  const getPost = async (post, controller) => {
    try {
      setError(null);
      setIsPending(true);
      const { data } = await Api.get(post, {
        signal: controller.signal,
      });

      if (Object.keys(data).length === 0) setPost(null);
      else {
        setPost(data);
        setTitle(data.title);
        setBody(data.body);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

  const editPost = async (formData) => {
    try {
      setIsPending(true);
      const { data } = await Api.post("/posts/" + post.slug, formData);
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

  const handleSubmit = (e) => {
    setError(null);
    e.preventDefault();
    const categoriesToSubmit = categoriesSelected.join(",");

    const formData = {
      title,
      image: file,
      body,
      categories: categoriesToSubmit,
      _method: "patch",
    };
  
    editPost(formData);
  };
  useEffect(() => {
    const userLocalStorage = JSON.parse(window.localStorage.getItem("user"));

    if (!userLocalStorage) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
      return navigate("/");
    }
  }, []);
  useEffect(() => {
    if (post?.categories) {
      const categoriesSelectedPost = post.categories.map(
        (category) => category.name
      );
      setCategoriesSelected(categoriesSelectedPost);
    }
  }, [post]);

  useEffect(() => {
    const controller = new AbortController();
    getPost(`/posts/${slug}`, controller);

    return () => controller.abort();
  }, [slug]);
  return (
    <>
      {post ? (
        <Form
          errors={error}
          isPending={isPending}
          style={{ top: "10%" }}
          handleSubmit={handleSubmit}
          title={`Edit your post`}
          buttonText={"Update"}
          elements={[
            <Input
              handleInput={setTitle}
              name={"title"}
              style={{ width: "500px" }}
              value={title}
            />,
            <FileInput
              title={"Image"}
              prevImage={{
                image: post.image,
                shape: post.image_shape,
              }}
              handleFile={setFile}
            />,
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
      ) : (
        <LinkBroken />
      )}
    </>
  );
}

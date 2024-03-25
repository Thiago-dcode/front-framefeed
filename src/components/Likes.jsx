import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as lightHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import Api from "../api/Api";
import Loading from "./Loading";

export default function Likes({ className, _likes, userId = null, type, id }) {
  const [like, setLike] = useState(null);
  const [url, setUrl] = useState("");
  const [likes, setLikes] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [formData, setFormData] = useState(null);

  const getLikes = async (signal = null) => {
    try {
      const { data } = await Api.get(`/likes/${type}/${id}`, { signal });
      //check if user liked the response likes

      setLikes(data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsPending(false);
    }
  };

  const storeLike = async (url, formData, signal = null) => {
    try {
      const { data } = await Api.post("/likes/" + url, formData, { signal });

      setLike(data.like);
      setLikes(data.likes);
    } catch (error) {
      console.log(error);
    }
  };
  const destroyLike = async (url, signal = null) => {
    try {
      const { data } = await Api.delete("/likes/" + url, { signal });
      setLike(null);

      setLikes(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  //Handle the like form button
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId) return;
    setFormData("");
    setUrl("");

    if (like) {
      setUrl(`${type}/${like.id}`);
      return;
    }
    //If is not liked, send a form to store a new like
    const typeSingular = type.substring(0, type.length - 1);

    setFormData({
      user_id: userId,
      [typeSingular + "_id"]: id,
    });
    setUrl(`${type}`);
  };

  // handle the destroy and store likes
  useEffect(() => {
    if (!userId || !url) return;
    const controller = new AbortController();
    const signal = controller.signal;

    if (like && !formData) {
      destroyLike(url, signal);
    } else {
      storeLike(url, formData, signal);
    }

    return () => controller.abort();
  }, [url]);

  //First render get all likes for the post or comment
  useEffect(() => {

    for (let i = 0; i < _likes.length; i++) {
      setLike(null);
      if (_likes[i].user_id === userId) {
        setLike(_likes[i]);
        break;
      }
    }
    setLikes(_likes);


  
  }, []);

  return (
    <>
      {likes ? (
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className={"like-component " + className}
        >
          <button style={{ background: "none", border: "none" }}>
            <FontAwesomeIcon
              type="submit"
              className="icon"
              icon={like ? solidHeart : lightHeart}
              style={{
                color: like ? "brown" : "white",
              }}
            />
          </button>
          <p>{likes.length}</p>
        </form>
      ) : (
        <Loading />
      )}
    </>
  );
}

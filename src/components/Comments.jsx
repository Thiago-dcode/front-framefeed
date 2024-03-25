import React, { useEffect, useState } from "react";
import Api from "../api/Api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import ErrorDiv from "./errorDiv";
import UserLink from "./UserLink";
import { NavLink } from "react-router-dom";
import Likes from "./Likes";
import Loading from "./Loading";
export default function Comments({ author, postId, user }) {
  const [comment, setComment] = useState("");
  const [url, setUrl] = useState("");
  const [formData, setFormData] = useState(null);
  const [comments, setComments] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const getComments = async (signal = null) => {
    try {
      setIsPending(true);
      const { data } = await Api.get("/comments?post=" + postId, { signal });

      setComments(data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsPending(false);
    }
  };

  const storeComment = async (url, formData, signal) => {
    try {
      setIsPending(true);
      const { data } = await Api.post(url, formData, { signal });
      setComment("");
      setComments(data.comments);
    } catch (error) {
      setIsPending(false);
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

  const destroyComment = async (url, signal) => {
    try {
      setIsPending(true);

      const { data } = await Api.delete(url, { signal });

      setComments(data.comments);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsPending(false);
    }
  };

  const handleSubmit = (e, isDelete = false, _comment = null) => {
    e.preventDefault();
    setError(null);
    setUrl("");
    setFormData(null);
    if (!user) return;

    if (isDelete) {
      setUrl("/comments/" + _comment.id);
      return;
    }
    if(!comment) return
    setFormData({
      user_id: user.id,
      post_id: postId,
      comment,
    });
    setUrl("/comments");
  };
  // handle the destroy and store likes
  useEffect(() => {
    if (!user || !url) return;
    const controller = new AbortController();
    const signal = controller.signal;
    console.log(formData);
    if (!formData) {
      destroyComment(url, signal);
    } else {
      storeComment(url, formData, signal);
    }

    return () => controller.abort();
  }, [url, formData]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getComments(signal);

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      {comments ? (
        <section className="comments">
          {user ? (
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="avatar-input">
                <div className="avatar">
                  <img src={user.avatar} alt="" />
                </div>
                <div className="input">
                  <input
                    onChange={({ target }) => {
                      setError(null);
                      setComment(target.value);
                    }}
                    value={comment}
                    type="text"
                    placeholder={`Add a comment to a ${author} post.`}
                  />
                </div>
              </div>
              <div className="comment-error">
                {error && !isPending ? <ErrorDiv errors={error} /> : null}
                <div className="btn">
                  {!isPending ? (
                    <button id="comment-btn">Comment</button>
                  ) : (
                    <Loading />
                  )}
                </div>
              </div>
            </form>
          ) : (
            <div className="login-register" style={{ color: "white" }}>
              <NavLink className={"link"} to={"/login"}>
                Login
              </NavLink>
              <p>or</p>
              <NavLink className={"link"} to={"/register"}>
                Register
              </NavLink>
              <p>to comment.</p>
            </div>
          )}
          <div className="comments-section">
            {comments &&
              !isPending ?
              comments.map((_comment, i) => {
                console.log(_comment.likes);
                return (
                  <article key={i} className="">
                    <div className="user-comment">
                      {_comment?.author.avatar && (
                        <UserLink user={_comment.author} />
                      )}
                      <p className="comment">{_comment.comment}</p>
                    </div>
                    <div className="likes-delete">
                      {_comment && (
                        <Likes
                          className={"comment-like"}
                          type={"comments"}
                          _likes={_comment.likes}
                          id={_comment.id}
                          userId={user?.id}
                        />
                      )}

                      {user?.id === _comment.author.id && (
                        <form
                          onSubmit={(e) => {
                            handleSubmit(e, true, _comment);
                          }}
                          className="delete-form"
                          action=""
                        >
                          <button>
                            <FontAwesomeIcon
                              className="icon-delete"
                              icon={faTrash}
                              style={{ color: "#ffffff", cursor: "pointer" }}
                            />
                          </button>
                        </form>
                      )}
                    </div>
                  </article>
                );
              }):   <>
              <div
                style={{
                  width: "500px",
                  height: "500px",
                
                }}
              >
               
              </div>
            </>}
          </div>
        </section>
      ) : (
        <>
          <div
            style={{
              width: "500px",
              height: "500px",
            }}
          >
            <Loading />
          </div>
        </>
      )}
    </>
  );
}

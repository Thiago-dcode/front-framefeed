import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../api/Api";
import Likes from "../components/Likes";
import UserLink from "../components/UserLink";
import Comments from "../components/Comments";
import Loading from "../components/Loading";
import EditDelete from "../components/EditDelete";
import LinkBroken from "../components/LinkBroken";

export default function Post() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { slug } = useParams();
  const [post, setPost] = useState({});

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState("");

  const getPost = async (url, signal) => {
    try {
      setIsPending(true);
      const response = await Api.get(url, { signal });

      setPost(response.data);
    } catch (error) {
      console.log(error.message);
      setError(error);
    } finally {
      setIsPending(false);
    }
  };
  const destroyPost = async () => {
    try {
      const { data } = await Api.delete("/posts/" + post.slug);
      return navigate("/" + user.username);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = (e, isYes) => {
    e.preventDefault();
    if (!isYes) return;
    destroyPost();
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getPost(`/posts/${slug}`, signal);
  }, [slug]);

  useEffect(() => {
    const userLocalStorage = JSON.parse(window.localStorage.getItem("user"));

    setUser(userLocalStorage);
  }, []);

  return (
    <>
      {post && (
        <div className="home post">
          {isPending && !error ? <Loading /> : null}

          {Object.keys(post).length !== 0 && !isPending && !error ? (
            <>
              <header className="title">
                <h1>{post.title}</h1>
              </header>
              <main>
                <div className="img-user-like">
                  {post.image && (
                    <div className={"img " + post.image_shape}>
                      <img src={post.image} alt="" />
                    </div>
                  )}
                  <div className="category">
                    {post.categories.map((category, i) => (
                      <p key={i}>{category.name}</p>
                    ))}
                  </div>

                  {post.author && (
                    <div className="user-like">
                      <UserLink user={post.author} />

                      <Likes
                        className={"post-like"}
                        type={"posts"}
                        id={post.id}
                        _likes={post.likes}
                        userId={user?.id}
                      />
                    </div>
                  )}
                </div>
                <div className="body">
                  <p>{post.body}</p>
                </div>
              </main>

              {post ? (
                <Comments
                  author={post.author.username}
                  postId={post.id}
                  comments={post.comments}
                  user={user}
                />
              ) : null}

              {user?.id === post.author.id && (
                <EditDelete
                  PopUpContent={
                    "This action will delete the post forever, continue?"
                  }
                  classNameForm={"post-page"}
                  handleSubmit={handleDelete}
                  className={"post-edit-delete"}
                  edit={{
                    content: "Edit post",

                    url: `/posts/${slug}/edit`,
                  }}
                  del={{
                    content: "Delete",
                  }}
                />
              )}
            </>
          ) : null}
          {(Object.keys(post).length === 0 && !isPending) || error ? (
            <LinkBroken />
          ) : null}
        </div>
      )}
    </>
  );
}

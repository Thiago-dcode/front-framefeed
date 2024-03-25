import React from "react";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UserLink from "./UserLink";
import Loading from "./Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import logo from "../assets/images/FrameFeed.png";
import Api from "../api/Api";

export default function NavBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(window.localStorage.getItem("user"))
  );
  const [token, setToken] = useState(
    window.localStorage.getItem("ACCESS_TOKEN")
  );
  const [users, setUsers] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchUsers = async (url) => {
    try {
      setIsPending(true);
      const response = await Api.get(url);

      setUsers(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsPending(false);
    }
  };
  const logOut = async () => {
    try {
      const res = await Api.post("/logout");
      console.log(res);
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("ACCESS_TOKEN");
      setUser("");
      setToken("");
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    logOut();
  };

  useEffect(() => {
    if (search) {
      fetchUsers(`/users?user=${search}`);
    }
  }, [search]);
  return (
    <nav>
      <ul>
        <li className="logo">
          <NavLink to={"/"}>
            {" "}
            <img src={logo} alt="" />
          </NavLink>
        </li>
        <li className="search">
          <div className="input">
            <input
              onFocus={() => setIsFocus(true)}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              type="text"
              placeholder="Search for an author"
            />
          </div>
          {search && isFocus && (
            <div onMouseOver={() => setIsFocus(true)} className="list">
              {isPending && !error && <Loading />}
              {!isPending && users.length === 0 && (
                <p className="match">No matches</p>
              )}
              {!isPending &&
                !error &&
                users.map((user, i) => {
                  return (
                    <UserLink
                      onclick={() => {
                        setIsFocus(false);
                        setSearch("");
                      }}
                      key={i}
                      user={user}
                    />
                  );
                })}
            </div>
          )}
        </li>
        <li className="user-new-post">
          {user && token ? (
            <>
            <NavLink to={`/${user.username}/create`}>
              <FontAwesomeIcon
                className="icon post"
                icon={faPlus}
                style={{ color: "#ffffff" }}
              />
              </NavLink>
              <div className="user">
                <div className="img">
                <img style={{cursor: 'pointer'}}
                  onClick={() => {
                    setShowDropdown(!showDropdown);
                  }}
                  src={user.avatar}
                  alt=""
                />
                </div>

                <div
                  style={{
                    display: showDropdown ? "flex" : "none",
                  }}
                  className="dropdown"
                >
                  <NavLink
                    onClick={() => {
                      setShowDropdown(false);
                    }}
                    to={`/${user.username}`}
                  >
                    Profile
                  </NavLink>
                  <form
                    onSubmit={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    <button>Log out</button>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <>
              <NavLink to={"/login"}>Login</NavLink>
              <NavLink to={"/register"}>Register</NavLink>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
}

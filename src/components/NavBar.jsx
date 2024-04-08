import React from "react";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UserLink from "./UserLink";
import Loading from "./Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBars } from "@fortawesome/free-solid-svg-icons";

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
  const [isDropOpen, setIsDropOpen] = useState(false);
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
      window.localStorage.removeItem("user");
      const res = await Api.post("/logout");
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
        <li className="user-new-post w-20">
          {user && token ? (
            <>
              <div className="sm:hidden relative w-full flex-col flex items-center justify-center">
                <button
                  className="z-[99]"
                  onClick={() => {
                    setIsDropOpen(!isDropOpen);
                  }}
                >
                  <FontAwesomeIcon
                    className=""
                    icon={faBars}
                    style={{ color: "#ffffff" }}
                  />
                </button>
                {isDropOpen && (
                  <div
                    onMouseEnter={() => {}}
                    onBlur={() => {
                      setIsDropOpen(false);
                    }}
                    className="z-[99] absolute top-6 right-4 flex items-start "
                  >
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                      }}
                      className=" flex flex-col items-center gap-2 bg-white/90 rounded-md  !text-black p-2"
                    >
                      <NavLink  className={
                        "!text-black hover:bg-white/80 w-full rounded-md text-center px-1 "
                      }
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
                        <button  >Log out</button>
                      </form>
                      <NavLink to={`/${user.username}/create`}>
                        <FontAwesomeIcon
                          className="icon post"
                          icon={faPlus}
                          style={{ color: "#000000" }}
                        />
                      </NavLink>
                    </div>
                  </div>
                )}
                {isDropOpen && (
                  <div
                    onMouseDown={() => {
                      console.log("DROPP");
                      setIsDropOpen(false);
                    }}
                    className=" z-[97] bg-black/10 fixed left-0 top-0 w-screen h-screen"
                  ></div>
                )}
              </div>
              <div className="hidden gap-5 items-center  justify-evenly sm:flex">
                <NavLink to={`/${user.username}/create`}>
                  <FontAwesomeIcon
                    className="icon post"
                    icon={faPlus}
                    style={{ color: "#ffffff" }}
                  />
                </NavLink>
                <div className="user">
                  <div className="img">
                    <img
                      style={{ cursor: "pointer" }}
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
              </div>
            </>
          ) : (
            <div className="relative w-full flex-col flex items-center justify-center">
              <button
                className="z-[99]"
                onClick={() => {
                  setIsDropOpen(!isDropOpen);
                }}
              >
                <FontAwesomeIcon
                  className=""
                  icon={faBars}
                  style={{ color: "#ffffff" }}
                />
              </button>
              {isDropOpen && (
                <div
                  onMouseEnter={() => {}}
                  onBlur={() => {
                    setIsDropOpen(false);
                  }}
                  className="z-[99] absolute top-6 right-4 flex items-start "
                >
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    className=" flex flex-col items-center gap-2  bg-white/90 rounded-md  !text-black p-2"
                  >
                    <NavLink
                      className={
                        "!text-black hover:bg-white/80 w-full rounded-md text-center  px-1 "
                      }
                      onClick={() => {
                        setIsDropOpen(false);
                      }}
                      to={"/login"}
                    >
                      Login
                    </NavLink>
                    <NavLink
                      className={
                        "!text-black hover:bg-white/80 w-full rounded-md text-center px-1 "
                      }
                      onClick={() => {
                        setIsDropOpen(false);
                      }}
                      to={"/register"}
                    >
                      Register
                    </NavLink>
                  </div>
                </div>
              )}
              {isDropOpen && (
                <div
                  onMouseDown={() => {
                    console.log("DROPP");
                    setIsDropOpen(false);
                  }}
                  className=" z-[97] bg-black/10 fixed left-0 top-0 w-screen h-screen"
                ></div>
              )}
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}

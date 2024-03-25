import React from "react";
import Loading from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function LoadMore({ isLoading, error, handleMore }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="load-more"
    >
      {isLoading && <Loading />}
      {!isLoading && !error && (
        <FontAwesomeIcon
          onClick={handleMore}
          className="icon"
          icon={faChevronDown}
          style={{ color: "#ffffff" }}
        />
      )}
    </div>
  );
}

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass as lupa } from "@fortawesome/free-solid-svg-icons";
export default function SearchInput({ handleSearch, inputRef, placeholder }) {
  return (
    <form onSubmit={(e) => handleSearch(e)} className="form">
      <input ref={inputRef} type="text" placeholder={placeholder} />
      <button type="submit" className="icon-div">
        <FontAwesomeIcon
          className="icon"
          icon={lupa}
          style={{ color: "#ffffff" }}
        />
      </button>
    </form>
  );
}

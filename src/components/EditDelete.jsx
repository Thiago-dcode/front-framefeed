import React, { useRef, useState } from "react";
import { NavLink } from "react-router-dom";

export default function EditDelete({
  className,
  classNameForm,
  edit,
  del,
  handleSubmit,
  PopUpContent,
}) {
  const [yesNo, setYesNo] = useState("");
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <div className={`edit-delete ${className}`}>
        {edit && (
          <NavLink to={edit.url} className={"child edit"}>
            {edit.content}
          </NavLink>
        )}
        {del && (
          <div className="delete-div">
            <button
              onClick={() => {
                setShowForm(!showForm);
              }}
              className="child delete"
            >
              {del.content}
            </button>
          </div>
        )}
      </div>
      <div
        style={{
          display: showForm ? "flex" : "none",
        }}
        id="form-dropdown"
        className={classNameForm}
      >
        <form
          onSubmit={(e) => {
            handleSubmit(e, yesNo);
          }}
        >
          <p>{PopUpContent}</p>
          <div>
            <button
              onClick={() => {
                setYesNo(true);
                setShowForm(false);
              }}
              className="yes"
            >
              Yes
            </button>
            <button
              onClick={() => {
                setYesNo(false);
                setShowForm(false);
              }}
              className="no"
            >
              No
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

import React, { useEffect, useState } from "react";
import ErrorDiv from "./errorDiv";
import Loading from "./Loading";
export default function Form({
  style = null,
  title,
  elements,
  handleSubmit,
buttonText,
  isPending = null,
  errors = null,
}) {
  const [isHover, setIsHover] = useState(false);


  return (
    <div style={style} className="home div-form">
      <h2
        style={{
          color: "white",
        }}
      >
        {title}
      </h2>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className={isHover ? "component-form hover" : "component-form"}
      >
        {elements.map((element, i) => {
          return (
            <div key={i} className="input-div">
              {element}
            </div>
          );
        })}

        <div
          className="btn-errors"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <button
            onMouseLeave={() => {
              setIsHover(false);
            }}
            onMouseOver={() => {
              setIsHover(true);
            }}
            type="submit"
          >
            {buttonText}
          </button>

         <ErrorDiv
         errors={errors}/>
          {isPending && !errors && <Loading />}
        </div>
      </form>
    </div>
  );
}

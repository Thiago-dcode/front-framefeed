import React from "react";
import Error from "./Error";

export default function ErrorDiv({ errors }) {

  return (
    <>
      {errors && (
        <div className="errors" style={{ color: "white" }}>
          {errors &&
            Object.entries(errors).map(([key, value]) => {
             
              if (!Array.isArray(value)) {
         
                return <Error key={key} message={value.message} />;
              }
              return value.map((errorMessage, i) => {
                return <Error key={i} message={errorMessage} />;
              });
            })}
        </div>
      )}
    </>
  );
}

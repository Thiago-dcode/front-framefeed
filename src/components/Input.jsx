import React from "react";

export default function Input({
  name,
  content = name,
  type = "text",
  value = "",
  handleInput,
  placeholder = "Your " + name,
  style = { width: "300px" },
  options = [],
}) {
  return (
    <>
      <label htmlFor={name}>{content}</label>
      {type === "textarea" && (
        <textarea
          style={style}
          onChange={({ target }) => {
            handleInput(target.value);
          }}
          name={name}
          id=""
          cols="30"
          rows="10"
          value={value}
          placeholder={"Write your " + name}
        ></textarea>
      )}
      {type !== "select" && type !== 'textarea' && (
        <input
          onChange={({ target }) => {
            handleInput(target.value);
          }}
          style={style}
          required
          name={name}
          placeholder={placeholder}
          type={type}
          value={value}
        />
      )}
      {type === "select" && (
        <select name={name}>
          {options.map((option) => {
            return <option value={option.id}>{option.name}</option>;
          })}
        </select>
      )}
    </>
  );
}

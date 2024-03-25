import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function DropDownMenu({ Icon, elements }) {
  const [isActive, SetIsActive] = useState(false);
  return (
    <div className="dropdown-menu">
      <div onBlur={()=> {SetIsActive(!isActive)}}  className="div">
        <button onClick={()=>{SetIsActive(!isActive)}}className="icon-button">
          {Icon}
        </button>

        {isActive && (
          <div className="elements">
            {elements.map((element, i) => {
              return (
                <NavLink key={i} to={element.url} className="nav-link">
                  <p>{element.content}</p>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

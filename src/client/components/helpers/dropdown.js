import React, { useEffect, useRef, useState } from "react";

//DropDown component
export default function DropDown({ trigger, children }) {
  //so we pass props dynamically as trigger which can be reusable as button or icon
  //secondly we pass children as prop so can nest multiple elements inside it
  const [show, setShow] = useState(false);
  const dropDownRef = useRef(null);
  const handleClickOutside = (e) => {
    if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
      setShow(false);
    }
  };
  useEffect(() => {
    if (show) {
      document.addEventListener("click", handleClickOutside, true);
    } else {
      document.removeEventListener("click", handleClickOutside, true);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [show]);
  return (
    <div className="dropdown">
      <div ref={dropDownRef}>
        <div className="trigger" onClick={() => setShow((prev) => !prev)}>
          {trigger}
        </div>
        {show && <div className="content">{children}</div>}
      </div> 
    </div>
  );
}

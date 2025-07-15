import React from "react";
//functional component for loading
export default function Loading({ size = 40, color = "#6ca6fd" }) {
  const style = {
    backgroundColor: color,
    width: size,
    height: size,
    borderRadius: "50%",
    animation: "bounce 0.6s infinite alternate",
  };
  return <div className="bouncer" style={style}></div>;
}

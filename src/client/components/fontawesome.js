import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//Icon file
export default function Icon({
  icon,
  size = "1x",
  color = "inherit",
  ...props
}) {
  return <FontAwesomeIcon icon={icon} size={size} color={color} {...props} />;
}

import React from "react";
import { Link } from "react-router-dom";

const SwitchAuthLink = ({ question, linkText, to }) => {
  return (
    <p className="text-sm text-center mt-6">
      {question}{" "}
      <Link to={to} className="text-blue-800 font-medium">
        {linkText}
      </Link>
    </p>
  );
};

export default SwitchAuthLink;

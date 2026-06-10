import React from "react";

const Button = ({ buttonName, onClick }) => (
  <button onClick={onClick} className="px-5 py-2 bg-background cursor-pointer rounded-lg whitespace-nowrap">
    {buttonName}
  </button>
);
export default Button;


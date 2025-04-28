import React from "react";

const Star = ({ active }) => (
    <svg width="51" height="48" viewBox="0 0 51 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M25.6047 0L31.5778 17.9656H50.9072L35.2694 29.0689L41.2425 47.0344L25.6047 35.9311L9.96683 47.0344L15.9399 29.0689L0.302124 17.9656H19.6315L25.6047 0Z"
            fill={active ? "#4FA0FF" : "#D9D9D9"}
        />
    </svg>
);

export default Star;
import React from "react";


const gradients = [
  "from-pink-400 via-red-300 to-yellow-300",
  "from-green-300 via-blue-500 to-purple-600",
  "from-yellow-200 via-green-200 to-green-500",
  "from-blue-300 via-indigo-400 to-purple-400",
  "from-cyan-200 via-teal-200 to-lime-200",
  "from-red-300 via-pink-400 to-purple-400",
  "from-teal-200 via-cyan-300 to-blue-500",
];

const getRandomGradient = () => {
  return gradients[Math.floor(Math.random() * gradients.length)];
};

const InitialAvatar = ({ name }) => {
  const initial = name?.[0]?.toUpperCase() || "U";
  const gradient = getRandomGradient();

  return (
    <div
      className={`w-12 md:w-24 h-12 md:h-24 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold text-xl`}
    >
      {initial}
    </div>
  );
};

export default InitialAvatar;

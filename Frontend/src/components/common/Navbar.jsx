import React from "react";

const Navbar = ({ setView }) => {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between">
      <h1 className="text-lg font-bold">Dashboard</h1>
      <button
        onClick={() => setView("dashboard")}
        className="bg-blue-500 px-4 py-2 rounded"
      >
        Chat
      </button>
    </nav>
  );
};

export default Navbar;

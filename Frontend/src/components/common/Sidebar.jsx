import React from "react";
import { FaHome, FaUsers, FaChartBar } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-1/6 bg-blue-900 text-white flex flex-col items-center py-4">
      <FaHome className="text-2xl my-4" />
      <FaUsers className="text-2xl my-4" />
      <FaChartBar className="text-2xl my-4" />
    </div>
  );
};

export default Sidebar;

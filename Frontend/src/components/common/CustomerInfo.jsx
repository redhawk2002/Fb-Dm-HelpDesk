import React from "react";

const CustomerInfo = ({ selectedChat }) => {
  return (
    <div className="w-1/4 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          {selectedChat?.name || "Customer Info"}
        </h3>
        <button className="bg-gray-300 px-4 py-2 rounded">Profile</button>
      </div>
      <p
        className={`text-xs mt-2 ${
          selectedChat?.online ? "text-green-500" : "text-red-500"
        }`}
      >
        {selectedChat?.online ? "Online" : "Offline"}
      </p>
    </div>
  );
};

export default CustomerInfo;

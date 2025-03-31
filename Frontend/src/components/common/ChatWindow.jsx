import React from "react";

const ChatWindow = ({ selectedChat }) => {
  return (
    <div className="flex-grow p-4 bg-white">
      <h2 className="font-bold text-lg">
        {selectedChat?.name || "Select a chat"}
      </h2>
      <div className="mt-4 space-y-2">
        <div className="p-2 bg-gray-200 rounded w-fit">
          {selectedChat?.message || "No messages yet."}
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          className="border p-2 rounded w-full mt-4"
        />
      </div>
    </div>
  );
};

export default ChatWindow;

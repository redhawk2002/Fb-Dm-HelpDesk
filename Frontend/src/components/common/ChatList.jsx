import React from "react";

const ChatList = ({ setSelectedChat }) => {
  const chats = [
    { name: "Amit RG", message: "Is it available?", online: true },
    { name: "Hiten Saxena", message: "Thank you!", online: false },
  ];

  return (
    <div className="w-1/4 bg-gray-100 p-4">
      <h2 className="font-bold text-lg">Conversations</h2>
      <div className="mt-4 space-y-2">
        {chats.map((chat, index) => (
          <div
            key={index}
            className="p-2 bg-white rounded shadow cursor-pointer"
            onClick={() => setSelectedChat(chat)}
          >
            <h3 className="font-semibold">{chat.name}</h3>
            <p className="text-sm text-gray-500">{chat.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;

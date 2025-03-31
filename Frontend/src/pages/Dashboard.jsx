import React, { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import ChatList from "../components/common/ChatList";
import ChatWindow from "../components/common/ChatWindow";
import CustomerInfo from "../components/common/CustomerInfo";

const Dashboard = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <ChatList setSelectedChat={setSelectedChat} />
      <ChatWindow selectedChat={selectedChat} />
      <CustomerInfo selectedChat={selectedChat} />
    </div>
  );
};

export default Dashboard;

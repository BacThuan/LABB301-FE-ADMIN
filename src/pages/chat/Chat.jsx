import "./chat.css";
import Sidebar from "../../components/sidebar/Sidebar";
import React from "react";
import { useEffect } from "react";
import ListUser from "./ListUser";
import Content from "./Content";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const Chat = () => {
  const token = Cookies.get("token");
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Chat room";
    if (!token) navigate("/auth");
  }, []);
  return (
    <div className="chatRoom">
      <Sidebar />
      <div className="chatContainer">
        <ListUser />
        <Content />
      </div>
    </div>
  );
};

export default Chat;

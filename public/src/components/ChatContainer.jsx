import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  sendMessageRoute,
  recieveMessageRoute,
  getAllGroupsMessages,
  sendGroupMessage,
} from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );

    // if group chat
    if (currentChat?.admin) {
      let response = await axios.get(
        `${getAllGroupsMessages}/${currentChat._id}`
      );

      response = (response.data?.allMessages || []).map((item) => ({
        ...item,
        fromSelf: item.sender._id === data._id,
      }));
      setMessages(response);
      return;
    }
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });
    setMessages(response.data);
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const loggedInUser = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );

    // check if current chat is group
    if (currentChat?.admin) {
      const payload = {
        sender: loggedInUser,
        group: currentChat._id,
        message: msg,
      };
      await axios.post(sendGroupMessage, payload);
      console.log("loggedInUser", loggedInUser, currentChat);
      socket.current.emit("send-msg", {
        username: loggedInUser.username,
        group: currentChat._id,
        msg,
        fromGroup: true,
      });
    } else {
      console.log("else case");
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: loggedInUser._id,
        msg,
        username: loggedInUser.username,
      });
      await axios.post(sendMessageRoute, {
        from: loggedInUser._id,
        to: currentChat._id,
        message: msg,
      });
    }

    const msgs = [...messages];
    msgs.push({
      fromSelf: true,
      message: msg,
      sender: { username: loggedInUser.username },
    });
    setMessages(msgs);
  };

  useEffect(() => {
    socket.current?.on("msg-recieve", (data) => {
      console.log("message arived", data.room, currentChat);

      if (data.room) {
        // if msg recieved in room and same id only then add to current chat, will handle it later
        if (data.room === currentChat._id) {
          setArrivalMessage({
            fromSelf: false,
            message: data.msg,
            sender: data.sender,
          });
        }
      } else {
        setArrivalMessage({
          fromSelf: false,
          message: data.msg,
          sender: data.sender,
        });
      }
    });
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            {currentChat?.avatarImage && (
              <img
                src={`data:image/svg+xml;base64,${currentChat?.avatarImage}`}
                alt=""
              />
            )}
          </div>
          <div className="username">
            <h3>{currentChat?.username || currentChat?.name}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  {message?.sender?.username ? (
                    <p className="message-owner">{message.sender.username}</p>
                  ) : null}
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;

        .message-owner {
          color: yellow;
          padding-bottom: 10px;
          text-transform: capitalize;
        }
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
      .message-owner {
        text-align: end;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

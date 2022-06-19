import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [allGroups, setAllGroups] = useState(null);

  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
      setAllGroups(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_GROUP_KEY) || []
        )
      );
    }
  }, []);

  useEffect(() => {
    if (currentUser && allGroups) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);

      console.log("allGroups", allGroups);

      allGroups.forEach((group) => {
        socket.current.emit("join-room", {
          user: currentUser._id,
          username: currentUser.username,
          room: group._id,
        });
      });
    }
  }, [currentUser, allGroups]);

  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  // const callBack = useCallback(
  //   (data) => {
  //     console.log("101", data, currentChat);
  //     if (data.room) {
  //       // console.log("from room");

  //       // if msg recieved in room and same id only then add to current chat, will handle it later
  //       if (data.room === currentChat._id) {
  //         // console.log("room id match");

  //         setArrivalMessage({
  //           fromSelf: false,
  //           message: data.msg,
  //           sender: data.sender,
  //         });
  //       }
  //     } else {
  //       // console.log("from normal user");

  //       if (data.user === currentChat._id) {
  //         console.log("normal user match");
  //         setArrivalMessage({
  //           fromSelf: false,
  //           message: data.msg,
  //           sender: data.sender,
  //         });
  //       }
  //     }
  //   },
  //   [currentChat]
  // );

  return (
    <>
      <Container>
        <div className="container">
          <Contacts
            contacts={contacts}
            allGroups={allGroups}
            changeChat={handleChatChange}
          />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              socket={socket}
              // arrivalMessage={arrivalMessage}
              // setArrivalMessage={setArrivalMessage}
            />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

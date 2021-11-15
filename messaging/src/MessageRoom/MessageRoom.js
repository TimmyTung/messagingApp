import React, { useState, useEffect } from "react";
import "./MessageRoom.css";
import { useParams } from "react-router-dom";
import axios from "../axios";
import Pusher from "pusher-js";
import { useStateValue } from "../stateProvider.js";
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";

function MessageRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { convoId } = useParams();
  //const [convos, setConvos] = useState([]);
  const [name, setName] = useState("");
  const [{ user }] = useStateValue();

  useEffect(() => {
    if (convoId) {
      axios.get(`/convos/${convoId}`).then(response => {
        //setConvos(response.data);
        setName(response.data.name);
        setMessages(response.data.mess);
      });
    }
  }, [convoId]);

  useEffect(() => {
    const pusher = new Pusher("409ee1be60ed4493d67e", {
      cluster: "us3"
    });
    const channel = pusher.subscribe("convos");
    channel.bind("updated", newMessages => {
      setMessages(newMessages.mess);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  //setMessages([...messages, newMessage]);

  const sendMessage = async e => {
    if (input === "") return;

    e.preventDefault();
    let addingMess;

    if (messages) {
      addingMess = [
        ...messages,
        {
          who: user.displayName,
          what: input,
          when: "now",
          senderEmail: user.email
        }
      ];
    } else {
      addingMess = [
        {
          who: user.displayName,
          what: input,
          when: "now",
          senderEmail: user.email
        }
      ];
    }

    await axios
      .patch(`/convos/${convoId}`, {
        mess: addingMess
        //hello: "jddsjf"
      })
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log("convo patch error", err);
      });

    setInput("");
  };

  return (
    <div className="messageRoom">
      <div className="messageRoom__top">
        <Avatar />
        <div className="messageRoom__info">
          <h3>{name}</h3>
          <p>Last Seen</p>
        </div>
        <div className="messageRoom__tools">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AddAPhotoIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="messageRoom__convo">
        {messages?.map(message => (
          <p
            className={`messageRoom__message ${message.senderEmail ===
              user.email && "messageRoom__sender"}`}
          >
            <span className="messageRoom__name">{message.who}</span>
            {message.what}
            <span className="messageRoom__time">{message.when}</span>
          </p>
        ))}
      </div>
      <div className="messageRoom__bottom">
        <SentimentSatisfiedIcon />
        <form>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessageRoom;

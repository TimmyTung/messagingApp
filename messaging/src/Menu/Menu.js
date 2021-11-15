import React, { useState, useEffect } from "react";
import "./Menu.css";
import { useStateValue } from "../stateProvider.js";
import axios from "../axios.js";
import Pusher from "pusher-js";
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ConvoPreview from "../ConvoPreview/ConvoPreview.js";

function Menu() {
  const [convos, setConvos] = useState([]);
  const [convoIds, setConvoIds] = useState([]);
  const [person, setPerson] = useState(null);
  const [{ user }] = useStateValue();

  useEffect(() => {
    axios
      .get(`/peoples/${user.email}`)
      .then(response => {
        setPerson(response.data);
        console.log("should be first", person);
      })
      .catch(err => console.log(err));
  }, [user]);

  useEffect(() => {
    let temp = [];
    const getPersonsConvos = async () => {
      await person?.convo?.map(id => {
        console.log("should be third");
        temp.push(id);
      });
    };

    getPersonsConvos();
    setConvoIds(temp);
  }, [person]);

  useEffect(() => {
    console.log("all here?", convoIds);
    let temp = [];
    let promises = [];

    const getConvoData = async () => {
      await convoIds.map(id => {
        promises.push(
          axios
            .get(`/convos/${id}`)
            .then(response => {
              temp.push(response.data);
            })
            .catch(err => console.log(err))
        );
      });
    };

    getConvoData();
    Promise.all(promises).then(() => setConvos(temp));
  }, [convoIds]);

  useEffect(() => {
    //console.log("here", convos);
    const pusher = new Pusher("409ee1be60ed4493d67e", {
      cluster: "us3"
    });

    const channel = pusher.subscribe("convos");
    channel.bind("inserted", newConvo => {
      let addingConvo;

      if (convos) {
        addingConvo = [...convos, newConvo];
      } else {
        addingConvo = [newConvo];
      }

      //console.log("from pusher", newConvo);
      setConvos(addingConvo);
    });

    console.log("here", convos);

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [convos]);

  const addConvo = async () => {
    const convoName = prompt("name this new conversation");

    if (convoName === null) return;

    if (convoName === "") {
      alert("please name the new conversation");
      return;
    }

    var newConvoId;

    await axios
      .post("/convos/new", {
        name: convoName,
        mess: Array
      })
      .then(response => {
        newConvoId = response.data._id;
        console.log("new convo id", response.data._id);
      })
      .catch(err => console.log(err));

    let addingConvo;

    if (convoIds) {
      addingConvo = [...convoIds, newConvoId];
    } else {
      addingConvo = [newConvoId];
    }

    await axios
      .patch(`/peoples/${user.email}`, {
        convo: addingConvo
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="menu">
      <div className="menu__top">
        <Avatar src={user.photoURL} />
        <div className="menu__tools">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon onClick={addConvo} />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="menu__search">
        <div className="menu__searchCont">
          <SearchOutlined />
          <input placeholder="search your convos" type="text" />
        </div>
      </div>
      <div className="menu__convos">
        {convos?.map(convo => (
          <ConvoPreview name={convo.name} id={convo._id} />
        ))}
      </div>
    </div>
  );
}

export default Menu;
